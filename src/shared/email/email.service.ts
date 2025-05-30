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
      to: 'email_target',
      subject,
      template: './payment-success',
      context: {
        something: 'heelow',
      },
    });
  }

  async paymentCancelEmail() {}
}
