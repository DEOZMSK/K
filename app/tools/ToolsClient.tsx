"use client";

import { useMemo, useState } from "react";
import { calculateExpression } from "./calculators";
import { CalculatorCard } from "./components/CalculatorCard";

export default function ToolsClient() {
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => calculateExpression({ birthDate }), [birthDate]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 text-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <header className="mb-2">
          <h1 className="text-2xl font-bold">JyotishGPT · Инструменты</h1>
          <p className="text-sm text-slate-300">Работает в браузере и в Telegram Mini App.</p>
        </header>

        <CalculatorCard
          title="Экспрессия"
          description="Реализация формулы будет вставлена 1:1 из source-бота после получения доступа к репозиторию." 
        >
          <label className="text-sm text-slate-200" htmlFor="birthDate">
            Дата рождения
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-3 text-base outline-none ring-indigo-400 transition focus:ring-2"
          />
          <div className="mt-4 rounded-xl bg-slate-900/80 p-3 text-sm">
            {!result.valid && <p className="text-amber-300">{result.warning}</p>}
            {result.valid && <p>Экспрессия: {String(result.value)}</p>}
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
