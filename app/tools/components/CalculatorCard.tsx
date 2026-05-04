"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  backgroundImage: string;
  children: ReactNode;
};

export function CalculatorCard({ title, description, backgroundImage, children }: Props) {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-900/20 p-3 shadow-2xl shadow-amber-950/20">
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-amber-50/10" aria-hidden="true" />
      <div className="relative z-10 flex h-full w-full flex-col">
        {title ? <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{title}</h2> : null}
        {description ? <p className="mt-1 text-sm text-slate-700">{description}</p> : null}
        <div className="mt-2 min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </section>
  );
}
