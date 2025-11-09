"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "jyotishgpt-cookie-consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "acknowledged");
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-[min(94vw,520px)] -translate-x-1/2 rounded-2xl border border-[#cda15e]/40 bg-[rgba(255,244,223,0.95)] px-5 py-4 text-sm text-neutral-700 shadow-[0_18px_48px_rgba(125,84,25,0.18)] backdrop-blur">
      <p className="leading-relaxed">
        Сайт использует cookies и аналитические сервисы для улучшения работы. Продолжая использование сайта, вы соглашаетесь с
        <span className="whitespace-nowrap"> </span>
        <Link href="/privacy" className="text-accent hover:text-accent-hover underline-offset-4 hover:underline">
          Политикой конфиденциальности
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Link
          href="/privacy"
          className="text-sm font-medium text-accent transition hover:text-accent-hover"
          aria-label="Подробнее о политике конфиденциальности"
        >
          Подробнее
        </Link>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-full border border-[#cda15e]/40 bg-white/80 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-[#cda15e]/60 hover:text-neutral-900"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
