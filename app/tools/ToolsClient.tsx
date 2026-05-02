"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  calculateAhamkara,
  calculateDharma,
  calculateExpression,
  calculateKarma,
  calculatePeriods,
  calculateMonths,
  calculateVarna,
  calculateVyavadana,
} from "./calculators";
import type { PeriodMode } from "./types";
import { parseBirthDate } from "./calculators/shared";

type ToolKey = "karma" | "ahamkara" | "dharma" | "expression" | "vyavadana" | "varna" | "periods" | "help";
type BasicToolKey = Exclude<ToolKey, "periods" | "help">;

const TOOLS: Array<{ key: ToolKey; label: string }> = [
  { key: "karma", label: "Карма" },
  { key: "ahamkara", label: "Ахамкара" },
  { key: "dharma", label: "Дхарма" },
  { key: "expression", label: "Экспрессия" },
  { key: "vyavadana", label: "Вьявадана" },
  { key: "varna", label: "Варны" },
  { key: "periods", label: "Периоды" },
  { key: "help", label: "Справка" },
];

export default function ToolsClient() {
  const [birthDateInput, setBirthDateInput] = useState("");
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const parsedBirthDate = useMemo(() => parseBirthDate(birthDateInput), [birthDateInput]);
  const [periodsMode, setPeriodsMode] = useState<PeriodMode>("±5");
  const [showMonths, setShowMonths] = useState(false);

  const karmaResult = useMemo(() => calculateKarma({ birthDate: birthDateInput }), [birthDateInput]);
  const ahamkaraResult = useMemo(() => calculateAhamkara({ birthDate: birthDateInput }), [birthDateInput]);
  const dharmaResult = useMemo(() => calculateDharma({ birthDate: birthDateInput }), [birthDateInput]);
  const expressionResult = useMemo(() => calculateExpression({ birthDate: birthDateInput }), [birthDateInput]);
  const vyavadanaResult = useMemo(() => calculateVyavadana({ birthDate: birthDateInput }), [birthDateInput]);
  const varnaResult = useMemo(() => calculateVarna({ birthDate: birthDateInput }), [birthDateInput]);
  const periodsResult = useMemo(
    () =>
      calculatePeriods({
        birthDate: birthDateInput,
        mode: periodsMode,
      }),
    [birthDateInput, periodsMode],
  );
  const monthsResult = useMemo(() => calculateMonths({ birthDate: birthDateInput }), [birthDateInput]);

  const isDateValid = Boolean(parsedBirthDate);
  const dateValidationError =
    birthDateInput.trim() && !parsedBirthDate
      ? "Дата не распознана. Используйте форматы: 07.09.1994, 7.9.1994, 07/09/1994, 07-09-1994 или 07091994."
      : null;
  const acceptedDateLabel = parsedBirthDate
    ? `${String(parsedBirthDate.day).padStart(2, "0")}.${String(parsedBirthDate.month).padStart(2, "0")}.${parsedBirthDate.year}`
    : null;

  const basicResults = {
    karma: { title: "Карма", ...karmaResult },
    ahamkara: { title: "Ахамкара", ...ahamkaraResult },
    dharma: { title: "Дхарма", ...dharmaResult },
    expression: { title: "Экспрессия", ...expressionResult },
    vyavadana: { title: "Вьявадана", ...vyavadanaResult },
    varna: { title: "Варны", ...varnaResult, meaning: undefined },
  } as const;

  function renderBasicResult(tool: BasicToolKey) {
    const data = basicResults[tool];
    if (!data.valid) return <p className="text-sm text-amber-300">{data.warning}</p>;

    return (
      <div className="space-y-2 text-sm text-slate-100">
        <p>
          {data.title}: <span className="font-semibold text-white">{String(data.value)}</span>
        </p>
        {data.meaning && (
          <p className="text-slate-200">
            <a href={data.meaning.url} target="_blank" rel="noreferrer" className="underline decoration-indigo-300/70 underline-offset-2 hover:text-white">
              {data.meaning.text}
            </a>
          </p>
        )}
      </div>
    );
  }

  function renderPeriodsResult() {
    if (!periodsResult.valid) return <p className="text-sm text-amber-300">{periodsResult.warning}</p>;
    return (
      <div className="space-y-2 text-sm text-slate-100">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["-10", "+10", "±5"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => { setPeriodsMode(mode); setShowMonths(false); }}
              className={`rounded-lg px-2 py-1 text-xs transition ${
                periodsMode === mode ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-100 hover:bg-slate-700"
              }`}
            >
              {mode} лет
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowMonths((v) => !v)}
            className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-100 transition hover:bg-slate-700"
          >
            📆 Месяцы
          </button>
        </div>
        <p className="text-slate-200">Период: {periodsResult.rangeLabel}</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-slate-300">
                <th className="px-2 py-1 text-left">Год</th><th className="px-2 py-1 text-left">День</th><th className="px-2 py-1 text-left">Суффикс</th><th className="px-2 py-1 text-left">Main</th><th className="px-2 py-1 text-left">Background</th>
              </tr>
            </thead>
            <tbody>
              {periodsResult.rows.map((row) => (
                <tr key={row.year} className={row.marker ? "text-emerald-300" : "text-slate-100"}>
                  <td className="px-2 py-1">{row.year} {row.marker}</td><td className="px-2 py-1">{row.weekday}</td><td className="px-2 py-1">{row.yearSuffix}</td><td className="px-2 py-1">{row.main}</td><td className="px-2 py-1">{row.background}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showMonths && monthsResult.valid && (
          <div className="overflow-x-auto pt-2">
            <p className="mb-2 text-slate-200">📆 Месяцы</p>
            <table className="min-w-full text-xs">
              <tbody>
                <tr>{monthsResult.headers.map((month) => <td key={`m-${month}`} className="px-2 py-1 text-slate-300">{month}</td>)}</tr>
                <tr>{monthsResult.expressionRow.map((v, i) => <td key={`e-${i}`} className="px-2 py-1">{v}</td>)}</tr>
                <tr>{monthsResult.karmaRow.map((v, i) => <td key={`k-${i}`} className="px-2 py-1">{v}</td>)}</tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function renderHelpResult() {
    return (
      <div className="space-y-2 text-sm text-slate-100">
        <p><span className="font-semibold">Карма</span> — базовый вектор уроков и повторяющихся жизненных тем.</p>
        <p><span className="font-semibold">Ахамкара</span> — проявление эго, привычная роль в коммуникации и самоощущении.</p>
        <p><span className="font-semibold">Дхарма</span> — направление предназначения и формат полезной реализации.</p>
        <p><span className="font-semibold">Экспрессия</span> — стиль самовыражения и то, как вы воспринимаетесь со стороны.</p>
        <p><span className="font-semibold">Вьявадана</span> — внутренние фильтры восприятия, ограничения и зоны развития.</p>
        <p><span className="font-semibold">Варны</span> — преобладающий тип социального проявления и естественная роль.</p>
        <p><span className="font-semibold">Периоды</span> — динамика влияний по годам и месяцам в выбранном диапазоне.</p>
      </div>
    );
  }

  const actionMap: Record<ToolKey, () => ReactNode> = {
    karma: () => renderBasicResult("karma"),
    ahamkara: () => renderBasicResult("ahamkara"),
    dharma: () => renderBasicResult("dharma"),
    expression: () => renderBasicResult("expression"),
    vyavadana: () => renderBasicResult("vyavadana"),
    varna: () => renderBasicResult("varna"),
    periods: renderPeriodsResult,
    help: renderHelpResult,
  };

  function resetDate() {
    setBirthDateInput("");
    setActiveTool(null);
  }

  function renderResult() {
    if (!activeTool) return <p className="text-sm text-slate-300">Выберите расчёт.</p>;
    return actionMap[activeTool]();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-3 py-5 text-white sm:px-4">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-slate-900/60 p-4 shadow-xl backdrop-blur sm:p-5">
        <h1 className="text-xl font-bold leading-tight">🔮 Бесплатный расчёт/прогноз</h1>

        <div className="mt-4">
          <label htmlFor="birthDate" className="mb-2 block text-sm text-slate-200">
            Дата рождения
          </label>
          <input
            id="birthDate"
            type="text"
            inputMode="numeric"
            autoComplete="bday"
            value={birthDateInput}
            onChange={(e) => {
              setBirthDateInput(e.target.value);
              setActiveTool(null);
            }}
            className="w-full rounded-xl border border-white/20 bg-slate-950/80 px-3 py-3 text-base outline-none ring-indigo-400 transition focus:ring-2"
          />
          {dateValidationError && <p className="mt-2 text-xs text-amber-300">{dateValidationError}</p>}
          {acceptedDateLabel && (
            <p className="mt-2 rounded-lg border border-emerald-400/30 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-200">
              ✅ Дата принята: <span className="font-semibold">{acceptedDateLabel}</span>
            </p>
          )}
        </div>

        {isDateValid && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.key}
                  type="button"
                  onClick={() => setActiveTool(tool.key)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    activeTool === tool.key
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-600"
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-white/15 bg-slate-950/70 p-3">{renderResult()}</div>

          </>
        )}

        <button
          type="button"
          onClick={resetDate}
          className="mt-4 w-full rounded-xl border border-white/30 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
        >
          Сбросить дату
        </button>
      </section>
    </main>
  );
}
