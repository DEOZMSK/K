"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function CalculatorCard({ title, description, children }: Props) {
  return (
    <section className="rounded-2xl border border-white/15 bg-black/20 p-4 shadow-lg shadow-black/20">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-300">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
