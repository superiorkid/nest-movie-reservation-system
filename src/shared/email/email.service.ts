import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from 'src/common/interfaces/event-payloads.interface';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  @OnEvent('payment.success')
  async paymentSuccessEmail(data: EventPayloads['payment.success']) {
    const subject = `Payment successfully ${data}`;
    await this.mailerService.sendMail({
      to: data.user.email,
      subject,
      template: './payment-success',
      context: {
        user: data.user,
        showtime: data.showtime,
        seatReservations: data.seatReservations,
      },
    });
  }

  @OnEvent('payment.cancelled')
  async paymentCancelledEmail(data: EventPayloads['payment.cancelled']) {
    const subject = 'Payment failed - Reservation Cancelled';
    await this.mailerService.sendMail({
      to: data.email,
      subject,
      template: './payment-cancelled',
      context: {
        name: data.name,
      },
    });
  }
}
