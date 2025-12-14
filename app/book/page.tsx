import type { Metadata } from "next";

import { BOOKING_SERVICES } from "../../content/booking";
import { BOOKING_TIMEZONE } from "../../lib/booking/config";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "Запись на консультацию JyotishGPT",
  description:
    "Выберите формат консультации, дату и удобный слот. Запись подтверждается сразу через Google Calendar без переписок.",
  alternates: {
    canonical: "/book"
  },
  openGraph: {
    title: "Запись на консультацию JyotishGPT",
    description: "Онлайн-запись в календарь Артемия Ксорос: обучение боту, глубокая сессия или VIP-маршрут.",
    url: "/book",
    images: [
      {
        url: "/kcopoc.jpeg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Запись на консультацию JyotishGPT",
    description: "Онлайн-запись в календарь Артемия Ксорос: обучение боту, глубокая сессия или VIP-маршрут.",
    images: [
      {
        url: "/kcopoc.jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  },
  keywords: ["запись на консультацию", "JyotishGPT", "Артемий Ксорос", "онлайн-бронирование"]
};

export default function BookPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="space-y-4 text-neutral-900">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">Онлайн-запись</p>
        <h1 className="text-3xl font-semibold leading-tight">Выберите услугу и время, я сразу создам событие в календаре</h1>
        <p className="max-w-3xl text-base text-neutral-600">
          Рабочие дни Пн–Пт, время по {BOOKING_TIMEZONE}. Все брони проходят через Google Calendar сервисного аккаунта — без OAuth
          и переписок. Доступные слоты учитывают занятость и длительность выбранной услуги.
        </p>
      </header>

      <div className="mt-10">
        <BookingForm services={BOOKING_SERVICES} timezone={BOOKING_TIMEZONE} />
      </div>
    </main>
  );
}
