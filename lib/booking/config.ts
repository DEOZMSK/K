export const BOOKING_TIMEZONE = process.env.BOOKING_TZ ?? "Europe/Moscow";

export const WORKING_HOURS = {
  start: { hour: 10, minute: 0 },
  end: { hour: 18, minute: 0 }
};

export const SLOT_INTERVAL_MINUTES = 30;

export const WORKING_DAYS: readonly number[] = [1, 2, 3, 4, 5];
