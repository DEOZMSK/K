"use client";

import { useMemo, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
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

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export default function ToolsClient() {
  const monthShortLabels = ["Янв.", "Фев.", "Мар.", "Апр.", "Май.", "Июн.", "Июл.", "Авг.", "Сен.", "Окт.", "Ноя.", "Дек."];
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
  const secondScreenTopZoneClass = "pt-[max(96px,calc(env(safe-area-inset-top)+72px))] sm:pt-[max(108px,calc(env(safe-area-inset-top)+78px))]";

  const handleReset = () => {
    setBirthDate("");
    setActive("help");
  };

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



  const renderImageResult = (title: string, folder: string, prefix: string, num: number, link?: string, fallbackText?: string) => {
    const safeNum = Number.isInteger(num) && num >= 1 && num <= 9 ? num : null;
    if (!safeNum) {
      return renderMeaning(title, num, fallbackText, link);
    }

    const image = (
      <img
        src={`/${folder}/${prefix}${safeNum}.jpg`}
        alt={`${title} ${safeNum}`}
        className="block h-auto w-full max-w-full rounded-[20px] border border-white/15 object-contain shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
      />
    );

    return (
      <div className="mx-auto w-full max-w-[360px]">
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" aria-label={`Открыть разбор ${title} ${safeNum} в Telegram`}>
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    );
  };

  const renderKarmaResult = (num: number, link?: string) => {
    const safeNum = Number.isInteger(num) && num >= 1 && num <= 9 ? num : null;
    if (!safeNum) {
      return renderMeaning("Карма", num, karma.meaning?.text, link);
    }

    const image = (
      <img
        src={`/Karma/karma${safeNum}.jpg`}
        alt={`Карма ${safeNum}`}
        className="block h-auto w-full max-w-full rounded-[20px] border border-white/15 object-contain shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
      />
    );

    return (
      <div className="mx-auto w-full max-w-[360px]">
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" aria-label={`Открыть разбор Кармы ${safeNum} в Telegram`}>
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    );
  };

  return (
    <main className="min-h-[100svh] h-[100dvh] overflow-hidden bg-[url('/bg-tools.webp')] bg-cover bg-top bg-no-repeat px-3 py-3 text-white">
      <div className="mx-auto flex h-full w-full max-w-md">
        <CalculatorCard title="">
          <div className={isDateValid ? secondScreenTopZoneClass : "flex h-full flex-col justify-center"}>
            {!isDateValid && (
              <>
                <div className="mx-auto mb-4 w-full max-w-[320px] px-2 text-center text-[19px] leading-[1.18] text-[#f7f2e9]/92 drop-shadow-[0_2px_12px_rgba(255,229,182,0.16)] sm:mb-5 sm:max-w-[360px] sm:text-[21px]">
                  <p className={cormorantGaramond.className}>Если вы родились после полуночи и до 02:00 ночи — попробуйте посмотреть обе даты 🌙</p>
                  <p className={`${cormorantGaramond.className} mt-2`}>Например:</p>
                  <p className={`${cormorantGaramond.className} mt-1`}>07.09.1994 в 01:30</p>
                  <p className={`${cormorantGaramond.className}`}>→ попробуйте и 07.09.1994, и 06.09.1994.</p>
                  <p className={`${cormorantGaramond.className} mt-2`}>Иногда работает одна дата.</p>
                  <p className={cormorantGaramond.className}>Иногда — обе.</p>
                  <p className={cormorantGaramond.className}>А иногда разница ощущается очень сильно.</p>
                </div>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="tel"
                  placeholder="07.09.1994"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  inputMode="numeric"
                  enterKeyHint="done"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  pattern="[0-9.]*"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mx-auto mt-2 h-9 w-full max-w-[230px] rounded-xl border border-white/20 bg-[rgba(6,18,48,0.82)] px-3 text-center text-[15px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-8px_20px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.03)] outline-none placeholder:text-slate-400 focus:border-[#e2be81] focus:ring-2 focus:ring-[#cfad73]/20"
                />
                {birthDate.trim() && <p className="mx-auto mt-2 w-full max-w-[230px] text-center text-rose-300">{karma.warning}</p>}
              </>
            )}

            {isDateValid && (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mx-auto mb-5 flex h-8 items-center justify-center rounded-full border border-amber-300/50 bg-black/35 px-5 text-xs font-medium text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.14)] backdrop-blur-sm active:scale-[0.98]"
                >
                  Сброс
                </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => setActive("karma")} className={activeButtonClass("karma")}>Карма</button>
                <button onClick={() => setActive("ahamkara")} className={activeButtonClass("ahamkara")}>Ахамкара</button>
                <button onClick={() => setActive("dharma")} className={activeButtonClass("dharma")}>Дхарма</button>
                <button onClick={() => setActive("expression")} className={activeButtonClass("expression")}>Экспрессия</button>
                <button onClick={() => setActive("vyavadhana")} className={activeButtonClass("vyavadhana")}>Вьявадана</button>
                <button onClick={() => setActive("varna")} className={activeButtonClass("varna")}>Варна</button>
                <button onClick={() => setActive("periods")} className={activeButtonClass("periods")}>Периоды</button>
                <button onClick={() => setActive("help")} className={activeButtonClass("help")}>Справка</button>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/[0.12] bg-black/45 p-3 text-sm backdrop-blur-[6px]">
                {active === "karma" && renderKarmaResult(Number(karma.value), karma.meaning?.url)}
                {active === "ahamkara" && renderImageResult("Ахамкара", "ego", "ego", Number(ahamkara.value), ahamkara.meaning?.url, ahamkara.meaning?.text)}
                {active === "dharma" && renderImageResult("Дхарма", "dh", "dh", Number(dharma.value), dharma.meaning?.url, dharma.meaning?.text)}
                {active === "expression" && renderImageResult("Экспрессия", "exp", "exp", Number(expression.value), expression.meaning?.url, expression.meaning?.text)}
                {active === "vyavadhana" && renderImageResult("Вьявадана", "vya", "vya", Number(vyavadhana.value), vyavadhana.meaning?.url, vyavadhana.meaning?.text)}
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
                                <p className="font-semibold">{monthShortLabels[i] ?? month}</p>
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
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal" href="https://t.me/JyotishGPT/52?src=bot" target="_blank" rel="noreferrer">Карма — пинки за прошлое, как есть</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal" href="https://t.me/JyotishGPT/98?src=bot" target="_blank" rel="noreferrer">Ахамкара — как видят посторонние, тебя</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal" href="https://t.me/JyotishGPT/99?src=bot" target="_blank" rel="noreferrer">Дхарма — как надо жить, таким как ты</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal" href="https://teletype.in/@jyotishgpt/dharma" target="_blank" rel="noreferrer">Экспрессия — как видят близкие, тебя</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal" href="https://teletype.in/@jyotishgpt/viavadana" target="_blank" rel="noreferrer">Вьявадана — эта планета тебе не рада</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal" href="https://teletype.in/@jyotishgpt/varna" target="_blank" rel="noreferrer">Варна — какой ты априори, порода</a>
                      <a className="rounded-lg bg-slate-800 px-3 py-2 text-sm leading-snug text-slate-100 whitespace-normal sm:col-span-2" href="https://teletype.in/@jyotishgpt/period" target="_blank" rel="noreferrer">Периоды — сам не поймёшь, пиши..</a>
                    </div>
                  </div>
                )}
              </div>

              {active !== "help" && (
                <a
                  className="mx-auto mt-4 flex h-8 w-full max-w-[140px] items-center justify-center rounded-full border border-amber-300/50 bg-black/35 px-5 text-xs font-medium text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.14)] backdrop-blur-sm active:scale-[0.98]"
                  href="tel:+79919797119"
                >
                  Связаться
                </a>
              )}
              </>
            )}
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
