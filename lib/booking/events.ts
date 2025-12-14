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
  const requestBody = {
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
  };

  const calendarIdTrimmed = calendarId.trim();
  const eventIdRegex = /^[\w.!~*'()-]{5,1024}$/;

  console.log("calendar.events.insert input", {
    calendarId: {
      value: calendarIdTrimmed,
      original: calendarId,
      len: calendarIdTrimmed.length,
      hasWhitespace: /\s/.test(calendarId)
    },
    eventId: {
      value: eventId,
      len: eventId.length,
      regexOk: eventIdRegex.test(eventId)
    },
    requestBody
  });

  try {
    const response = await calendar.events.insert({
      calendarId: calendarIdTrimmed,
      requestBody,
      sendUpdates: "none"
    });

    return response.data;
  } catch (error) {
    const data = (error as { response?: { data?: unknown; status?: number } } | undefined)?.response?.data;
    const status = (error as { response?: { status?: number } } | undefined)?.response?.status;
    const errorInfo =
      typeof data === "object" && data !== null && "error" in data && typeof (data as { error?: unknown }).error === "object"
        ? ((data as { error: { errors?: Array<Record<string, unknown>> } }).error.errors ?? [])[0]
        : undefined;

    console.error("calendar.events.insert error", {
      status,
      reason: (errorInfo as { reason?: unknown } | undefined)?.reason,
      message: (errorInfo as { message?: unknown } | undefined)?.message,
      location: (errorInfo as { location?: unknown } | undefined)?.location,
      locationType: (errorInfo as { locationType?: unknown } | undefined)?.locationType,
      data
    });

    throw error;
  }
}
