import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TwilioService } from '../twilio/twilio.service';
import { ReservationService } from './reservation.service';
import moment from 'moment';

@Injectable()
export class ReservationReminderService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly reservationService: ReservationService,
  ) {}

  // Run every minute
  @Cron('* * * * *')
  async handleReminder() {
    const now = moment();
    const oneHourFromNow = moment().add(1, 'hour');

    const upcomingReservations = await this.reservationService.findByStartTimeRange(
      now.toDate(),
      oneHourFromNow.toDate(),
    );

    for (const reservation of upcomingReservations) {
      const phone = this.formatPhoneNumber("0650793375");
      const message = `Reminder: Your reservation is at ${moment(reservation.startTime).format('HH:mm')}. See you soon!`;

      try {
        await this.twilioService.sendSms(phone, message);
        console.log(`Reminder sent to ${phone}`);
      } catch (error) {
        console.error(`Failed to send reminder to ${phone}:`, error.message);
      }
    }
  }

  private formatPhoneNumber(phone: string): string {
    if (phone.startsWith('0')) {
      return '+66' + phone.slice(1);
    }
    return phone;
  }
}