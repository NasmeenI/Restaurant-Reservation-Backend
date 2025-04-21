import { Module } from "@nestjs/common";
import { TwilioController } from "src/modules/twilio/twilio.controller";
import { TwilioService } from "src/modules/twilio/twilio.service";

@Module({
  imports: [],
  controllers: [TwilioController],
  providers: [TwilioService],
})
export class TwilioModule {}