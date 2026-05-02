"use client";

import { useMemo, useState } from "react";
import {
  calculateAhamkara,
  calculateDharma,
  calculateExpression,
  calculateKarma,
  calculateMonths,
  calculatePeriods,
  calculateVarna,
  calculateVyavadana,
} from "./calculators";
import { CalculatorCard } from "./components/CalculatorCard";
import type { PeriodMode } from "./types";

type Action = "karma" | "ahamkara" | "dharma" | "expression" | "vyavadhana" | "varna" | "periods" | "help";

export default function ToolsClient() {
  const [birthDate, setBirthDate] = useState("");
  const [active, setActive] = useState<Action>("help");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("±5");

  const karma = useMemo(() => calculateKarma({ birthDate }), [birthDate]);
  const ahamkara = useMemo(() => calculateAhamkara({ birthDate }), [birthDate]);
  const dharma = useMemo(() => calculateDharma({ birthDate }), [birthDate]);
  const expression = useMemo(() => calculateExpression({ birthDate }), [birthDate]);
  const vyavadhana = useMemo(() => calculateVyavadana({ birthDate }), [birthDate]);
  const varna = useMemo(() => calculateVarna({ birthDate }), [birthDate]);
  const periods = useMemo(() => calculatePeriods({ birthDate, mode: periodMode }), [birthDate, periodMode]);
  const months = useMemo(() => calculateMonths({ birthDate }), [birthDate]);

  const isDateValid = karma.valid;

  const renderMeaning = (title: string, num: number, text?: string, link?: string) => (
    <div className="space-y-3 text-slate-100">
      <p className="text-xl font-semibold">{title}: {num}</p>
      <p className="text-slate-200">{text}</p>
      {link && (
        <a className="inline-block rounded-xl bg-indigo-500 px-4 py-2 font-medium" href={link} target="_blank" rel="noreferrer">
          📖 Открыть разбор в Telegram
        </a>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 text-white">
      <div className="mx-auto w-full max-w-md">
        <CalculatorCard title="🔮 Бесплатный расчёт/прогноз">
          <label className="text-sm text-slate-200" htmlFor="birthDate">Дата рождения</label>
          <input
            id="birthDate"
            type="text"
            placeholder="07.09.1994"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-3 text-base"
          />
          {!isDateValid && birthDate.trim() && <p className="mt-2 text-rose-300">{karma.warning}</p>}
          {isDateValid && <p className="mt-2 rounded-lg bg-emerald-950/50 p-2 text-emerald-300">✅ Дата принята</p>}

          {isDateValid && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setActive("karma")} className="rounded-xl bg-slate-800 p-3">♾ Карма</button>
                <button onClick={() => setActive("ahamkara")} className="rounded-xl bg-slate-800 p-3">🌟 Ахамкара</button>
                <button onClick={() => setActive("dharma")} className="rounded-xl bg-slate-800 p-3">🔥 Дхарма</button>
                <button onClick={() => setActive("expression")} className="rounded-xl bg-slate-800 p-3">⚡ Экспрессия</button>
                <button onClick={() => setActive("vyavadhana")} className="rounded-xl bg-slate-800 p-3">🚧 Вьявадана</button>
                <button onClick={() => setActive("varna")} className="rounded-xl bg-slate-800 p-3">Варны</button>
                <button onClick={() => setActive("periods")} className="rounded-xl bg-slate-800 p-3">🗓 Периоды</button>
                <button onClick={() => setActive("help")} className="rounded-xl bg-indigo-600 p-3">ℹ️ Справка</button>
              </div>

              <div className="mt-4 rounded-xl bg-slate-950/80 p-4">
                {active === "karma" && renderMeaning("♾ Карма", Number(karma.value), karma.meaning?.text, karma.meaning?.url)}
                {active === "ahamkara" && renderMeaning("🌟 Ахамкара", Number(ahamkara.value), ahamkara.meaning?.text, ahamkara.meaning?.url)}
                {active === "dharma" && renderMeaning("🔥 Дхарма", Number(dharma.value), dharma.meaning?.text, dharma.meaning?.url)}
                {active === "expression" && renderMeaning("⚡ Экспрессия", Number(expression.value), expression.meaning?.text, expression.meaning?.url)}
                {active === "vyavadhana" && renderMeaning("🚧 Вьявадана", Number(vyavadhana.value), vyavadhana.meaning?.text, vyavadhana.meaning?.url)}
                {active === "varna" && <p>Варны: {String(varna.value)}</p>}
                {active === "periods" && periods.valid && (
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <button onClick={() => setPeriodMode("-10")} className="rounded-lg bg-slate-800 px-3 py-1">−10 лет</button>
                      <button onClick={() => setPeriodMode("+10")} className="rounded-lg bg-slate-800 px-3 py-1">+10 лет</button>
                      <button onClick={() => setPeriodMode("±5")} className="rounded-lg bg-slate-800 px-3 py-1">±5 лет</button>
                    </div>
                    <p className="mb-2">Период: {periods.rangeLabel}</p>
                    <div className="overflow-x-auto text-sm">
                      <table>
                        <thead><tr><th className="pr-3">Год</th><th className="pr-3">День</th><th className="pr-3">Суффикс</th><th className="pr-3">Main</th><th>Background</th></tr></thead>
                        <tbody>{periods.rows.map((r) => <tr key={r.year}><td>{r.year}</td><td>{r.weekday}</td><td>{r.yearSuffix}</td><td>{r.main}</td><td>{r.background}</td></tr>)}</tbody>
                      </table>
                    </div>

                    {months.valid && (
                      <div className="mt-4 overflow-x-auto text-sm">
                        <p className="mb-2 font-medium">📆 Месяцы</p>
                        <table>
                          <thead>
                            <tr>
                              <th className="pr-3">Месяц</th>
                              {months.headers.map((h) => <th className="pr-2" key={h}>{h}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="pr-3">Экспрессия</td>
                              {months.expressionRow.map((v, i) => <td className="pr-2" key={`e-${i}`}>{v}</td>)}
                            </tr>
                            <tr>
                              <td className="pr-3">Карма</td>
                              {months.karmaRow.map((v, i) => <td className="pr-2" key={`k-${i}`}>{v}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {active === "help" && (
                  <div className="space-y-3">
                    <p>Выберите расчёт. В справке — быстрые ссылки и объяснения.</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://t.me/JyotishGPT/52?src=bot" target="_blank" rel="noreferrer">♾ Карма</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://t.me/JyotishGPT/98?src=bot" target="_blank" rel="noreferrer">🌟 Ахамкара</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://t.me/JyotishGPT/99?src=bot" target="_blank" rel="noreferrer">🔥 Дхарма</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://teletype.in/@jyotishgpt/dharma" target="_blank" rel="noreferrer">⚡ Экспрессия</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://teletype.in/@jyotishgpt/viavadana" target="_blank" rel="noreferrer">🚧 Вьявадана — обсудить</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://teletype.in/@jyotishgpt/period" target="_blank" rel="noreferrer">🗓 Периоды</a>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <button onClick={() => { setBirthDate(""); setActive("help"); }} className="mt-4 w-full rounded-xl border border-white/20 p-3">Сбросить дату</button>
        </CalculatorCard>
      </div>
    </main>
  );
}
