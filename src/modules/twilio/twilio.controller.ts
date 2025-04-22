import { Controller, Post, Body } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { TwilioService } from 'src/modules/twilio/twilio.service';

@Controller('sms')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('send')
  @ApiExcludeEndpoint()
  async sendSms(
    @Body('to') to: string,
    @Body('message') message: string
  ) {
    return this.twilioService.sendSms(to, message);
  }
}