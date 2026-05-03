"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function CalculatorCard({ title, description, children }: Props) {
  return (
    <section className="flex h-full w-full flex-col rounded-3xl border border-white/[0.12] bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.34)_55%,rgba(0,0,0,0.48)_100%),url('/bg-tools2.webp')] bg-cover bg-top bg-no-repeat p-3 shadow-2xl shadow-black/40">
      {title ? <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-slate-300">{description}</p> : null}
      <div className="mt-2 flex-1 min-h-0 overflow-hidden">{children}</div>
    </section>
  );
}
