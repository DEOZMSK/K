"use client";

import { useMemo, useState } from "react";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit, sumDigits } from "./calculators/shared";
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

  const activeButtonClass = (name: Action) =>
    `min-w-0 rounded-2xl border px-2 py-2 text-xs font-medium leading-tight transition-all sm:text-sm ${active === name ? "border-white/35 bg-white/20 text-white" : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"}`;

  const varnaDetails = useMemo(() => {
    const parsed = parseBirthDate(birthDate) ?? parseIsoBirthDate(birthDate);
    if (!parsed) return null;

    const labels: Record<number, "Кшатрий" | "Брахман" | "Вайшья" | "Шудра"> = {
      1: "Кшатрий",
      9: "Кшатрий",
      3: "Брахман",
      6: "Брахман",
      2: "Вайшья",
      5: "Вайшья",
      4: "Шудра",
      7: "Шудра",
      8: "Шудра",
    };

    const dayDigit = reduceToDigit(sumDigits(parsed.day));
    const monthDigit = parsed.month >= 10 ? reduceToDigit(sumDigits(parsed.month)) : parsed.month;
    const yearDigit = reduceToDigit(sumDigits(parsed.year));
    const fateDigit = reduceToDigit(parsed.ddmmyyyy.split("").reduce((a, c) => a + Number(c), 0));

    const totals = { Кшатрий: 0, Брахман: 0, Вайшья: 0, Шудра: 0 };
    totals[labels[dayDigit]] += 40;
    totals[labels[monthDigit]] += 10;
    totals[labels[yearDigit]] += 10;
    totals[labels[fateDigit]] += 40;

    return {
      formattedDate: `${parsed.ddmmyyyy.slice(0, 2)}.${parsed.ddmmyyyy.slice(2, 4)}.${parsed.ddmmyyyy.slice(4)}`,
      rows: [
        { digit: dayDigit, percent: 40, label: labels[dayDigit] },
        { digit: monthDigit, percent: 10, label: labels[monthDigit] },
        { digit: yearDigit, percent: 10, label: labels[yearDigit] },
        { digit: fateDigit, percent: 40, label: labels[fateDigit] },
      ],
      totals,
    };
  }, [birthDate]);

  const renderMeaning = (title: string, num: number, text?: string, link?: string) => (
    <div className="space-y-3 text-slate-100">
      <p className="text-xl font-semibold">{title}: {num}</p>
      <p className="text-slate-200">{text}</p>
      {link && (
        <a className="inline-block rounded-xl bg-indigo-500 px-4 py-2 font-medium" href={link} target="_blank" rel="noreferrer">
          Открыть разбор в Telegram
        </a>
      )}
    </div>
  );

  return (
    <main className="page-glow page-glow-indigo h-dvh overflow-hidden bg-cover bg-center bg-no-repeat px-3 py-3 text-white" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/fon.jpg')" }}>
      <div className="mx-auto flex h-full w-full max-w-md">
        <CalculatorCard title="">
          <div className={isDateValid ? "pt-12" : "flex h-full flex-col justify-center"}>
            <input
              id="birthDate"
              type="text"
              placeholder="07.09.1994"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-3 text-base"
            />
            {!isDateValid && birthDate.trim() && <p className="mt-2 text-rose-300">{karma.warning}</p>}

            {isDateValid && (
              <>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <button onClick={() => setActive("karma")} className={activeButtonClass("karma")}>Карма</button>
                <button onClick={() => setActive("ahamkara")} className={activeButtonClass("ahamkara")}>Ахамкара</button>
                <button onClick={() => setActive("dharma")} className={activeButtonClass("dharma")}>Дхарма</button>
                <button onClick={() => setActive("expression")} className={activeButtonClass("expression")}>Экспрессия</button>
                <button onClick={() => setActive("vyavadhana")} className={activeButtonClass("vyavadhana")}>Вьявадана</button>
                <button onClick={() => setActive("varna")} className={activeButtonClass("varna")}>Варна</button>
                <button onClick={() => setActive("periods")} className={activeButtonClass("periods")}>Периоды</button>
                <button onClick={() => setActive("help")} className={activeButtonClass("help")}>Справка</button>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/45 p-3 text-sm">
                {active === "karma" && renderMeaning("Карма", Number(karma.value), karma.meaning?.text, karma.meaning?.url)}
                {active === "ahamkara" && renderMeaning("Ахамкара", Number(ahamkara.value), ahamkara.meaning?.text, ahamkara.meaning?.url)}
                {active === "dharma" && renderMeaning("Дхарма", Number(dharma.value), dharma.meaning?.text, dharma.meaning?.url)}
                {active === "expression" && renderMeaning("Экспрессия", Number(expression.value), expression.meaning?.text, expression.meaning?.url)}
                {active === "vyavadhana" && renderMeaning("Вьявадана", Number(vyavadhana.value), vyavadhana.meaning?.text, vyavadhana.meaning?.url)}
                {active === "varna" && varnaDetails && (
                  <div className="space-y-3 text-slate-100">
                    <p>Варны: {String(varna.value)}</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p>{varnaDetails.formattedDate}:</p>
                        {varnaDetails.rows.map((row, i) => (
                          <p key={`varna-row-${i}`}>{row.digit} ({row.percent}%) {row.label}</p>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p>Итого:</p>
                        <div className="flex items-center justify-between gap-2"><span>Кшатрий — {varnaDetails.totals.Кшатрий}%</span><a className="rounded-md bg-slate-300 px-2 py-1 text-[11px] text-slate-900" href="https://t.me/JyotishGPT/178" target="_blank" rel="noreferrer">Кнопка</a></div>
                        <div className="flex items-center justify-between gap-2"><span>Брахман — {varnaDetails.totals.Брахман}%</span><a className="rounded-md bg-slate-300 px-2 py-1 text-[11px] text-slate-900" href="https://t.me/JyotishGPT/177" target="_blank" rel="noreferrer">Кнопка</a></div>
                        <div className="flex items-center justify-between gap-2"><span>Вайшья — {varnaDetails.totals.Вайшья}%</span><a className="rounded-md bg-slate-300 px-2 py-1 text-[11px] text-slate-900" href="https://t.me/JyotishGPT/179" target="_blank" rel="noreferrer">Кнопка</a></div>
                        <div className="flex items-center justify-between gap-2"><span>Шудра — {varnaDetails.totals.Шудра}%</span><a className="rounded-md bg-slate-300 px-2 py-1 text-[11px] text-slate-900" href="https://t.me/JyotishGPT/180" target="_blank" rel="noreferrer">Кнопка</a></div>
                      </div>
                    </div>
                  </div>
                )}
                {active === "periods" && periods.valid && (
                  <div className="space-y-3">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <button onClick={() => setPeriodMode("-10")} className="rounded-lg bg-slate-300 px-3 py-1 text-slate-900">−10 лет</button>
                      <button onClick={() => setPeriodMode("+10")} className="rounded-lg bg-slate-300 px-3 py-1 text-slate-900">+10 лет</button>
                      <button onClick={() => setPeriodMode("±5")} className="rounded-lg bg-slate-300 px-3 py-1 text-slate-900">±5 лет</button>
                    </div>
                    <p className="mb-2">Период: {periods.rangeLabel}</p>
                    <div className="space-y-2 overflow-x-auto text-sm">
                      <div className="min-w-max">
                        <p className="mb-1 text-xs text-slate-300">Годы</p>
                        <div className="grid grid-flow-col gap-2">
                          {periods.rows.map((r) => (
                            <div key={r.year} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs">
                              <p className="font-semibold">{r.year}</p>
                              <p>{r.main}</p>
                              <p>{r.background}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {months.valid && (
                        <div className="min-w-max">
                          <p className="mb-1 text-xs text-slate-300">Месяцы</p>
                          <div className="grid grid-flow-col gap-2">
                            {months.headers.map((month, i) => (
                              <div key={month} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs">
                                <p className="font-semibold">{month}</p>
                                <p>{months.expressionRow[i]}</p>
                                <p>{months.karmaRow[i]}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {active === "help" && (
                  <div className="space-y-3">
                    <p>Ссылки на посты в моём Telegram-канале: там подробнее разобраны названия, которые вы видите на кнопках.</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://t.me/JyotishGPT/52?src=bot" target="_blank" rel="noreferrer">Карма</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://t.me/JyotishGPT/98?src=bot" target="_blank" rel="noreferrer">Ахамкара</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://t.me/JyotishGPT/99?src=bot" target="_blank" rel="noreferrer">Дхарма</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://teletype.in/@jyotishgpt/dharma" target="_blank" rel="noreferrer">Экспрессия</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://teletype.in/@jyotishgpt/viavadana" target="_blank" rel="noreferrer">Вьявадана — обсудить</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100" href="https://teletype.in/@jyotishgpt/period" target="_blank" rel="noreferrer">Периоды</a>
                    </div>
                  </div>
                )}
              </div>
              </>
            )}
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
