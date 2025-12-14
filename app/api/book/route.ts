import { NextResponse } from "next/server";

import { assertSlotIsFree } from "../../../lib/booking/availability";
import { createCalendarBooking } from "../../../lib/booking/events";
import { getBookingService } from "../../../content/booking";

interface BookingPayload {
  serviceId?: string;
  slot?: string;
  name?: string;
  contact?: string;
  comment?: string;
}

export async function POST(request: Request) {
  let payload: BookingPayload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const service = payload.serviceId ? getBookingService(payload.serviceId) : null;
  const slot = payload.slot ?? "";
  const name = (payload.name ?? "").trim();
  const contact = (payload.contact ?? "").trim();
  const comment = (payload.comment ?? "").trim();

  if (!service) {
    return NextResponse.json({ error: "Услуга не найдена" }, { status: 404 });
  }

  if (!slot || !name || !contact) {
    return NextResponse.json({ error: "Укажите имя, контакт и выберите слот" }, { status: 400 });
  }

  try {
    const { start, end } = await assertSlotIsFree(slot, service);

    const event = await createCalendarBooking({
      startISO: start.toISO(),
      endISO: end.toISO(),
      service,
      name,
      contact,
      comment: comment || undefined
    });

    return NextResponse.json({ ok: true, eventId: event.id });
  } catch (error: unknown) {
    console.error("Booking creation failed", error);
    const message = error instanceof Error ? error.message : "Не удалось создать бронь";
    const userErrorPrefixes = [
      "Неверный формат времени слота",
      "Запись доступна только",
      "Слот выходит",
      "Слот уже занят",
      "Неверная дата"
    ];
    const isUserError =
      error instanceof Error && userErrorPrefixes.some((prefix) => error.message.startsWith(prefix));

    if (typeof error === "object" && error && "code" in error && (error as { code?: number }).code === 409) {
      return NextResponse.json({ error: "Этот слот уже занят" }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: isUserError ? 400 : 500 });
  }
}
