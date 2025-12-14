export interface BookingService {
  id: string;
  title: string;
  durationMinutes: number;
  price: string;
  description: string;
}

export const BOOKING_SERVICES: BookingService[] = [
  {
    id: "bot-training",
    title: "⚡️ Обучение боту (для самоанализа)",
    durationMinutes: 30,
    price: "2500 ₽",
    description: "Быстрое погружение в логику бота и работу с самоанализом."
  },
  {
    id: "deep-session",
    title: "🧠 Глубокая сессия (мой анализ, вас)",
    durationMinutes: 60,
    price: "11500 ₽",
    description: "Личный разбор с моими выводами и рекомендациями."
  },
  {
    id: "vip-route",
    title: "🗺 Маршрут жизненного периода (VIP)",
    durationMinutes: 120,
    price: "27000 ₽",
    description: "Большая стратегическая сессия с проработкой периода."
  }
];

export function getBookingService(id: string): BookingService | undefined {
  return BOOKING_SERVICES.find((service) => service.id === id);
}
