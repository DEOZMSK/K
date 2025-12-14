import { Interval, DateTime } from "luxon";
import type { calendar_v3 } from "googleapis";

import { BOOKING_TIMEZONE, SLOT_INTERVAL_MINUTES, WORKING_DAYS, WORKING_HOURS } from "./config";
import { getCalendarClient, getCalendarId } from "./calendar";
import type { BookingService } from "../../content/booking";

function toDateTime(value?: string | null) {
  if (!value) return null;
  return DateTime.fromISO(value, { setZone: true }).setZone(BOOKING_TIMEZONE);
}

function mapEventToInterval(event: calendar_v3.Schema$Event): Interval | null {
  if (!event.start || !event.end) return null;

  const startDate = event.start.dateTime ?? event.start.date;
  const endDate = event.end.dateTime ?? event.end.date;

  if (!startDate || !endDate) return null;

  const start = toDateTime(startDate);
  const end = toDateTime(endDate);

  if (event.start.date && event.end.date) {
    const allDayStart = DateTime.fromISO(event.start.date, { zone: BOOKING_TIMEZONE }).startOf("day");
    const allDayEnd = DateTime.fromISO(event.end.date, { zone: BOOKING_TIMEZONE }).startOf("day");
    return Interval.fromDateTimes(allDayStart, allDayEnd);
  }

  if (!start || !end) return null;

  return Interval.fromDateTimes(start, end);
}

function getWorkingInterval(day: DateTime) {
  const dayInZone = day.setZone(BOOKING_TIMEZONE);
  const start = dayInZone.set({
    hour: WORKING_HOURS.start.hour,
    minute: WORKING_HOURS.start.minute,
    second: 0,
    millisecond: 0
  });
  const end = dayInZone.set({
    hour: WORKING_HOURS.end.hour,
    minute: WORKING_HOURS.end.minute,
    second: 0,
    millisecond: 0
  });

  return Interval.fromDateTimes(start, end);
}

function isWorkingDay(day: DateTime) {
  return WORKING_DAYS.includes(day.setZone(BOOKING_TIMEZONE).weekday);
}

export async function fetchBusyIntervals(day: DateTime): Promise<Interval[]> {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();
  const dayInZone = day.setZone(BOOKING_TIMEZONE);

  const listParams: calendar_v3.Params$Resource$Events$List = {
    calendarId,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: dayInZone.startOf("day").toISO() ?? undefined,
    timeMax: dayInZone.endOf("day").toISO() ?? undefined,
    timeZone: BOOKING_TIMEZONE
  };

  const response = await calendar.events.list(listParams);

  const events = response.data.items ?? [];
  return events
    .map(mapEventToInterval)
    .filter((interval): interval is Interval => Boolean(interval));
}

function doesOverlap(intervals: Interval[], slot: Interval) {
  return intervals.some((busy) => busy.overlaps(slot));
}

export function buildAvailableSlots(day: DateTime, service: BookingService, busyIntervals: Interval[]) {
  const workingInterval = getWorkingInterval(day);
  const slots: string[] = [];

  const workingStart = workingInterval.start;
  const workingEnd = workingInterval.end;

  if (!workingStart || !workingEnd) {
    return slots;
  }

  if (!isWorkingDay(day)) {
    return slots;
  }

  let cursor = workingStart;
  const duration = service.durationMinutes;

  while (cursor.plus({ minutes: duration }) <= workingEnd) {
    const slotEnd = cursor.plus({ minutes: duration });
    const slotInterval = Interval.fromDateTimes(cursor, slotEnd);

    if (!doesOverlap(busyIntervals, slotInterval)) {
      slots.push(cursor.toISO());
    }

    cursor = cursor.plus({ minutes: SLOT_INTERVAL_MINUTES });
  }

  return slots;
}

export async function listAvailableSlots(dateISO: string, service: BookingService) {
  const day = DateTime.fromISO(dateISO, { zone: BOOKING_TIMEZONE, setZone: true });
  if (!day.isValid) {
    throw new Error("Неверная дата");
  }

  const busy = await fetchBusyIntervals(day);
  return buildAvailableSlots(day, service, busy);
}

export async function assertSlotIsFree(startISO: string, service: BookingService) {
  const start = DateTime.fromISO(startISO, { setZone: true }).setZone(BOOKING_TIMEZONE);

  if (!start.isValid) {
    throw new Error("Неверный формат времени слота");
  }

  if (!isWorkingDay(start)) {
    throw new Error("Запись доступна только в рабочие дни Пн–Пт");
  }

  const workingInterval = getWorkingInterval(start);
  const workingStart = workingInterval.start;
  const workingEnd = workingInterval.end;

  if (!workingStart || !workingEnd) {
    throw new Error("Не удалось вычислить границы рабочего дня");
  }
  const end = start.plus({ minutes: service.durationMinutes });
  const slotInterval = Interval.fromDateTimes(start, end);

  if (!workingInterval.contains(start) || end > workingEnd) {
    throw new Error("Слот выходит за рамки рабочего времени");
  }

  const busy = await fetchBusyIntervals(start);

  if (doesOverlap(busy, slotInterval)) {
    throw new Error("Слот уже занят, выберите другое время");
  }

  return { start, end };
}
