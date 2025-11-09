"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "jyotishgpt-cookie-consent";

const isConsentStored = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const localValue = window.localStorage.getItem(STORAGE_KEY);
    if (localValue === "accepted") {
      return true;
    }
  } catch (error) {
    // Игнорируем ошибки доступа к localStorage
  }

  try {
    return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${STORAGE_KEY}=`));
  } catch (error) {
    return false;
  }
};

export function CookieConsent() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!isConsentStored()) {
      setShouldShow(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldShow) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldShow]);

  const handleAccept = () => {
    if (!isChecked) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (error) {
      // Игнорируем невозможность записи
    }

    try {
      const maxAge = 60 * 60 * 24 * 180; // 180 дней
      document.cookie = `${STORAGE_KEY}=accepted; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch (error) {
      // Игнорируем невозможность записи
    }

    setShouldShow(false);
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/95 p-6 text-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h2 className="text-lg font-semibold text-neutral-900">Использование файлов cookie</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Сайт <span className="font-medium">JyotishGPT.ru</span> использует обязательные и аналитические cookie, сервисы аналитики
          (Google Analytics, Яндекс.Метрика), Telegram-бота <span className="whitespace-nowrap">@artemiy_ksoros_bot</span> и API
          искусственного интеллекта, чтобы обрабатывать запросы и улучшать консультации. Подробнее см. в документах:
          {" "}
          <Link href="/privacy" className="text-accent hover:text-accent-hover">Политика конфиденциальности</Link>,{" "}
          <Link href="/user-agreement" className="text-accent hover:text-accent-hover">Пользовательское соглашение</Link> и{" "}
          <Link href="/telegram-disclaimer" className="text-accent hover:text-accent-hover">Дисклеймер о Telegram</Link>.
        </p>
        <label className="mt-4 flex items-start gap-3 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
            className="mt-1 h-4 w-4 flex-shrink-0 rounded border-neutral-400 text-accent focus:ring-accent"
          />
          <span>
            Согласен(на) с использованием cookie, аналитических сервисов и обработкой персональных данных согласно документам.
          </span>
        </label>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleAccept}
            disabled={!isChecked}
            className="w-full rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition enabled:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:w-auto"
          >
            Согласен(на)
          </button>
        </div>
      </div>
    </div>
  );
}
