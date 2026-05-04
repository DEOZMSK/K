"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  backgroundVariant?: "clean" | "hint";
  children: ReactNode;
};

export function CalculatorCard({ title, description, backgroundVariant = "clean", children }: Props) {
  const backgroundUrl = backgroundVariant === "hint" ? "/bg-tools2.webp" : "/bg-tools.webp";
  return (
    <section
      className="flex h-full w-full flex-col rounded-3xl border border-slate-900/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(246,239,226,0.92)_55%,rgba(236,225,206,0.94)_100%)] bg-cover bg-top bg-no-repeat p-3 shadow-2xl shadow-amber-950/20"
      style={{ backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(246,239,226,0.92)_55%,rgba(236,225,206,0.94)_100%),url('${backgroundUrl}')` }}
    >
      {title ? <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-slate-700">{description}</p> : null}
      <div className="mt-2 flex-1 min-h-0 overflow-hidden">{children}</div>
    </section>
  );
}
