import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSms(to: string, message: string): Promise<any> {
    const phone = this.formatPhoneNumber(to);
    return await this.client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  }

  private formatPhoneNumber(phone: string): string {
    if (phone.startsWith('0')) {
      return '+66' + phone.slice(1);
    }
    return phone;
  }
}