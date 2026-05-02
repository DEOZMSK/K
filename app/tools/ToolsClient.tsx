"use client";

import { useMemo, useState } from "react";
import { calculateExpression, calculatePeriods } from "./calculators";
import { CalculatorCard } from "./components/CalculatorCard";
import type { PeriodMode } from "./types";

export default function ToolsClient() {
  const [birthDate, setBirthDate] = useState("");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("±5");
  const [periodYear, setPeriodYear] = useState(String(new Date().getUTCFullYear()));

  const expressionResult = useMemo(() => calculateExpression({ birthDate }), [birthDate]);
  const periodsResult = useMemo(
    () =>
      calculatePeriods({
        birthDate,
        mode: periodMode,
        currentYear: Number(periodYear),
      }),
    [birthDate, periodMode, periodYear],
  );

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
            {!expressionResult.valid && <p className="text-amber-300">{expressionResult.warning}</p>}
            {expressionResult.valid && <p>Экспрессия: {String(expressionResult.value)}</p>}
          </div>
        </CalculatorCard>

        <CalculatorCard title="Периоды" description="Диапазон лет, день недели, main/background по логике бота.">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-slate-200">
              Режим
              <select
                value={periodMode}
                onChange={(e) => setPeriodMode(e.target.value as PeriodMode)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-base"
              >
                <option value="-10">-10</option>
                <option value="±5">±5</option>
                <option value="+10">+10</option>
              </select>
            </label>
            <label className="text-sm text-slate-200">
              Текущий год
              <input
                type="number"
                value={periodYear}
                onChange={(e) => setPeriodYear(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-base"
              />
            </label>
          </div>

          <div className="mt-4 rounded-xl bg-slate-900/80 p-3 text-sm">
            {!periodsResult.valid && <p className="text-amber-300">{periodsResult.warning}</p>}
            {periodsResult.valid && (
              <>
                <p className="mb-2 text-slate-200">Период: {periodsResult.rangeLabel}</p>
                <ul className="space-y-1 text-xs leading-5 text-slate-100">
                  {periodsResult.rows.map((row) => (
                    <li key={row.year}>
                      {row.marker ? "● " : ""}
                      {row.year}: день {row.weekday}, суффикс {row.yearSuffix}, main {row.main}, background {row.background}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
