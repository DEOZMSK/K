"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  backgroundImage: string;
  children: ReactNode;
  debugBg?: boolean;
  debugCardBgLabel?: string;
};

export function CalculatorCard({ title, description, backgroundImage, children, debugBg = false, debugCardBgLabel }: Props) {
  return (
    <section
      className={`relative flex h-full w-full flex-col rounded-3xl border border-slate-900/20 p-3 shadow-2xl shadow-amber-950/20 ${debugBg ? "outline outline-2 outline-offset-[-2px] outline-emerald-500" : ""}`}
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(246,239,226,0.08)_55%,rgba(236,225,206,0.1)_100%),url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {debugBg && debugCardBgLabel ? (
        <div className="absolute right-4 top-4 z-20 rounded-md bg-emerald-700/90 px-2 py-1 text-[10px] font-semibold text-white shadow">
          CARD BG: {debugCardBgLabel}
        </div>
      ) : null}
      {title ? <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-slate-700">{description}</p> : null}
      <div className="mt-2 flex-1 min-h-0 overflow-hidden">{children}</div>
    </section>
  );
}
