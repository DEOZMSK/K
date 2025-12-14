import { NextResponse } from "next/server";

import { BOOKING_TIMEZONE } from "../../../../lib/booking/config";
import { listAvailableSlots } from "../../../../lib/booking/availability";
import { getBookingService } from "../../../../content/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json({ error: "serviceId и date обязательны" }, { status: 400 });
  }

  const service = getBookingService(serviceId);

  if (!service) {
    return NextResponse.json({ error: "Услуга не найдена" }, { status: 404 });
  }

  try {
    const slots = await listAvailableSlots(date, service);
    return NextResponse.json({ slots, timezone: BOOKING_TIMEZONE });
  } catch (error) {
    console.error("Failed to fetch slots", error);
    return NextResponse.json({ error: "Не удалось получить слоты" }, { status: 500 });
  }
}
