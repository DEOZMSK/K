import { createHash } from "crypto";

import type { BookingService } from "../../content/booking";
import { BOOKING_TIMEZONE } from "./config";
import { getCalendarClient, getCalendarId } from "./calendar";

function buildEventId(startISO: string, serviceId: string) {
  const hash = createHash("sha256")
    .update(`${serviceId}-${startISO}`)
    .digest("hex")
    .slice(0, 24);

  return `booking-${hash}`;
}

interface CreateBookingPayload {
  startISO: string;
  endISO: string;
  service: BookingService;
  name: string;
  contact: string;
  comment?: string;
}

export async function createCalendarBooking({
  startISO,
  endISO,
  service,
  name,
  contact,
  comment
}: CreateBookingPayload) {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();
  const bookingKey = `${service.id}-${startISO}`;
  const descriptionLines = [
    `Контакт: ${contact}`,
    `Услуга: ${service.title}`,
    `Длительность: ${service.durationMinutes} минут`,
    `Стоимость: ${service.price}`
  ];

  if (comment) {
    descriptionLines.push(`Комментарий: ${comment}`);
  }

  const eventId = buildEventId(startISO, service.id);

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      id: eventId,
      summary: `${service.title} — ${name}`,
      description: descriptionLines.join("\n"),
      start: {
        dateTime: startISO,
        timeZone: BOOKING_TIMEZONE
      },
      end: {
        dateTime: endISO,
        timeZone: BOOKING_TIMEZONE
      },
      extendedProperties: {
        private: {
          bookingKey
        }
      }
    },
    sendUpdates: "none"
  });

  return response.data;
}
