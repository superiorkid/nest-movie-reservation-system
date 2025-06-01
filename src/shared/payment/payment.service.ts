import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReservationService } from 'src/modules/reservation/reservation.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private configService: ConfigService,

    @Inject(forwardRef(() => ReservationService))
    private reservationService: ReservationService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') || '',
      { apiVersion: '2025-05-28.basil' },
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Stripe.MetadataParam,
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // converts to cent
        currency: 'usd',
        metadata,
        automatic_payment_methods: { enabled: true },
      });

      this.logger.log(
        `PaymentIntent created successfully with amount: ${amount} ${currency}`,
      );

      return paymentIntent;
    } catch (error) {
      this.logger.error('failed to create payment intent', error.stack);
      throw error;
    }
  }

  async cancelPayment(paymentIntentId: string) {
    await this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  async createCheckoutSession(params: {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    metadata: Stripe.MetadataParam;
    successUrl: string;
  }) {
    const { metadata, lineItems, successUrl } = params;

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        metadata,
        success_url: successUrl,
      });

      this.logger.log(
        `Checkout Session created successfully with id: ${session.id}`,
      );

      return session;
    } catch (error) {
      this.logger.error('failed to create checkout session', error.stack);
      throw error;
    }
  }

  async constructWebhookEvent(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '',
    );
  }

  async stripeWebhook(params: { signature: string; rawBody: Buffer }) {
    const { rawBody, signature } = params;

    console.log('parmas', params);

    let event: Stripe.Event;

    try {
      event = await this.constructWebhookEvent(rawBody, signature);
    } catch (error) {
      throw new BadRequestException(`Webhook error:`, error.message);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.reservationService.handlePaymentSuccess(
          event.data.object.id,
        );
        break;
      case 'payment_intent.payment_failed':
        await this.reservationService.handlePaymentFailed(event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  }
}
