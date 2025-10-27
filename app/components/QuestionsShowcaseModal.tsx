"use client";

import { useEffect, useRef, useState } from "react";

import { QuestionsShowcase } from "./QuestionsShowcase";

export function QuestionsShowcaseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <div className="mt-6 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-[#cda15e]/40 bg-[#fff3dc]/90 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-[#b78945]/50 hover:bg-[#fde7c9]/90 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#cda15e]/60 sm:self-end"
      >
        <span aria-hidden className="text-lg leading-none transition group-hover:scale-110">✨</span>
        <span className="text-base">Что можно спросить?</span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 sm:px-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            aria-hidden
            className="absolute inset-0 h-full w-full cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/85 text-neutral-600 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
            <div className="relative max-h-[90vh] overflow-y-auto rounded-[32px] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
              <QuestionsShowcase className="mt-0" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

