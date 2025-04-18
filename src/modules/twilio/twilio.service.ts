import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.client = new twilio.Twilio(accountSid, authToken);
  }

  async sendSms(to: string, message: string): Promise<any> {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    try {
      const result = await this.client.messages.create({
        body: message,
        from,
        to,
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}