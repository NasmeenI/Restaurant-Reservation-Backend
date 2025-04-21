import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TwilioService } from '../twilio/twilio.service';
import { ReservationService } from './reservation.service';
import { UserService } from 'src/modules/user/user.service';
import { RestaurantService } from "src/modules/restaurant/restaurant.service";
import moment from 'moment';

@Injectable()
export class ReservationReminderService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly reservationService: ReservationService,
    private readonly userService: UserService,
    private readonly restaurantService: RestaurantService,
  ) {}

  // Run every minute
  @Cron('* * * * *')
  async handleReminder() {

    const now = moment();
    const oneHourFromNow = moment().add(1, 'hours');
    console.log(`Checking reservation reminders from ${now.format('HH:mm')} to ${oneHourFromNow.format('HH:mm')}`);
    const upcomingReservations = await this.reservationService.findByStartTimeRange(
      now.toDate(),
      oneHourFromNow.toDate(),
    );
    console.log(`Reservation upcoming: ${upcomingReservations.length}`);

    for (const reservation of upcomingReservations) {
      const user = await this.userService.getById(reservation.userId);
      const restaurant = await this.restaurantService.getRestaurantById(reservation.restaurantId);

      const phone = this.formatPhoneNumber(user.phone);
      const message = `Hi ${user.username}, just a reminder of your reservation at ${restaurant.name} in 1 hours. See you soon!`;
      
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