import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { PaymentService } from './payment.service';

@Controller('webhook')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Public()
  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const signature = req.headers['stripe-signature'] as string;
    return this.paymentService.stripeWebhook({
      signature,
      rawBody: req['rawBody'],
    });
  }
}
