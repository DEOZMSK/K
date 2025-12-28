"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

import type { BookingService } from "../../content/booking";

interface BookingFormProps {
  services: BookingService[];
  timezone: string;
}

interface SlotResponse {
  slots: string[];
  error?: string;
}

export function BookingForm({ services, timezone }: BookingFormProps) {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const minimumBookingDate = useMemo(() => DateTime.now().setZone(timezone).plus({ days: 14 }), [timezone]);
  const minimumBookingDateISO = minimumBookingDate.toISODate() ?? "";
  const [date, setDate] = useState(minimumBookingDateISO);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const currentService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0],
    [selectedServiceId, services]
  );

  const loadSlots = useCallback(
    async (signal?: AbortSignal) => {
      if (!selectedServiceId || !date) {
        setSlots([]);
        return;
      }

      setLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);

      try {
        const response = await fetch(
          `/api/book/slots?serviceId=${encodeURIComponent(selectedServiceId)}&date=${encodeURIComponent(date)}`,
          { signal }
        );

        const data: SlotResponse = await response.json();

        if (!response.ok) {
          setSlotsError(data.error ?? "Не удалось загрузить время");
          setSlots([]);
          return;
        }

        setSlots(data.slots);
      } catch (error) {
        if (signal?.aborted) return;
        setSlotsError("Не удалось загрузить время");
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [date, selectedServiceId]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadSlots(controller.signal);

    return () => controller.abort();
  }, [loadSlots]);

  useEffect(() => {
    if (minimumBookingDateISO && date < minimumBookingDateISO) {
      setDate(minimumBookingDateISO);
    }
  }, [date, minimumBookingDateISO]);

  const formatSlot = (slot: string) => {
    const dateTime = DateTime.fromISO(slot).setZone(timezone);
    return dateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSuccess(false);
    setCreatedEventId(null);

    if (!selectedSlot) {
      setSubmitError("Выберите время для записи");
      return;
    }

    if (!name.trim() || !contact.trim()) {
      setSubmitError("Заполните имя и контакт");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          slot: selectedSlot,
          name,
          contact,
          comment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error ?? "Не удалось записаться. Попробуйте ещё раз");
        return;
      }

      setIsSuccess(true);
      setCreatedEventId(data.eventId ?? null);
      setName("");
      setContact("");
      setComment("");
      setSelectedSlot(null);
      await loadSlots();
    } catch (error) {
      setSubmitError("Сейчас недоступно. Попробуйте ещё раз чуть позже");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Услуга</p>
            <h2 className="text-xl font-semibold text-neutral-900">Выберите формат консультации</h2>
          </div>
          <p className="text-sm text-neutral-500">Время показывается по {timezone}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => {
            const isActive = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedServiceId(service.id)}
                className={`flex h-full flex-col gap-2 rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-accent bg-surface shadow-[0_12px_32px_rgba(110,75,31,0.12)]"
                    : "border-outline/70 hover:border-accent/70 hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-900">{service.title}</p>
                    <p className="text-sm text-neutral-600">{service.description}</p>
                  </div>
                  <span className="rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                    {service.price}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Длительность: {service.durationMinutes} минут</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Дата и время</h3>
          <div className="grid gap-3 sm:grid-cols-[220px,1fr] sm:items-center">
            <label className="space-y-2 text-sm text-neutral-700">
              <span className="block font-medium text-neutral-900">День</span>
              <input
                type="date"
                value={date}
                min={minimumBookingDateISO || undefined}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-outline bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>
            <div className="rounded-xl border border-outline bg-surface/60 p-3">
              {loadingSlots && <p className="text-sm text-neutral-500">Ищем свободное время…</p>}
              {!loadingSlots && slotsError && <p className="text-sm text-red-600">{slotsError}</p>}
              {!loadingSlots && !slotsError && slots.length === 0 && (
                <p className="text-sm text-neutral-500">Нет свободных слотов на выбранный день</p>
              )}
              {!loadingSlots && !slotsError && slots.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          isSelected
                            ? "border-accent bg-accent text-white"
                            : "border-outline bg-white hover:border-accent"
                        }`}
                      >
                        {formatSlot(slot)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-neutral-500">Рабочие дни: Пн–Пт, 10:00–18:00 ({timezone})</p>
          <p className="text-xs text-neutral-500">
            Запись доступна начиная с {minimumBookingDate.toLocaleString(DateTime.DATE_FULL)} (Мск)
          </p>
          {currentService && (
            <p className="text-xs text-neutral-500">Длительность выбранной услуги: {currentService.durationMinutes} минут</p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Контакты</h3>
          <label className="space-y-1 text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">Имя</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Как к вам обращаться"
              required
              className="w-full rounded-xl border border-outline bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <label className="space-y-1 text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">Контакт</span>
            <input
              type="text"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Телеграм @username или email"
              required
              className="w-full rounded-xl border border-outline bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <label className="space-y-1 text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">Комментарий (необязательно)</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Кратко о запросе"
              className="w-full rounded-xl border border-outline bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition enabled:hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isSubmitting ? "Отправляем в календарь…" : "Записаться"}
          </button>
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          {isSuccess && (
            <div className="rounded-xl border border-green-500/40 bg-green-50 p-3 text-sm text-green-800">
              <p className="font-semibold">Запись создана!</p>
              <p>Мы получили вашу заявку. Событие появится в календаре, я свяжусь с вами по указанному контакту.</p>
              {createdEventId && <p className="text-xs text-green-700">ID события: {createdEventId}</p>}
            </div>
          )}
        </div>
      </section>
    </form>
  );
}
