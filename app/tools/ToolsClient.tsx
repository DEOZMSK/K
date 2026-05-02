"use client";

import { useMemo, useState } from "react";
import {
  calculateAhamkara,
  calculateDharma,
  calculateExpression,
  calculateKarma,
  calculatePeriods,
  calculateVarna,
  calculateVyavadana,
} from "./calculators";

type ToolKey = "karma" | "ahamkara" | "dharma" | "expression" | "vyavadana" | "varna" | "periods" | "help";

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
        mode: "±5",
        currentYear: new Date().getUTCFullYear(),
      }),
    [birthDateInput],
  );

  const isDateValid = karmaResult.valid;

  function resetDate() {
    setBirthDateInput("");
    setActiveTool(null);
  }

  function renderResult() {
    if (!activeTool) return <p className="text-sm text-slate-300">Выберите расчёт.</p>;

    if (activeTool === "help") {
      return (
        <div className="space-y-2 text-sm text-slate-100">
          <p>Введите дату в формате ДД.ММ.ГГГГ, ДД/ММ/ГГГГ, ДД-ММ-ГГГГ или DDMMYYYY.</p>
          <p>После выбора кнопки расчёт выполняется сразу, без перезагрузки страницы.</p>
        </div>
      );
    }

    const resultMap = {
      karma: { title: "Карма", value: karmaResult.value, warning: karmaResult.warning, valid: karmaResult.valid },
      ahamkara: { title: "Ахамкара", value: ahamkaraResult.value, warning: ahamkaraResult.warning, valid: ahamkaraResult.valid },
      dharma: { title: "Дхарма", value: dharmaResult.value, warning: dharmaResult.warning, valid: dharmaResult.valid },
      expression: { title: "Экспрессия", value: expressionResult.value, warning: expressionResult.warning, valid: expressionResult.valid },
      vyavadana: { title: "Вьявадана", value: vyavadanaResult.value, warning: vyavadanaResult.warning, valid: vyavadanaResult.valid },
      varna: { title: "Варны", value: varnaResult.value, warning: varnaResult.warning, valid: varnaResult.valid },
    } as const;

    if (activeTool === "periods") {
      if (!periodsResult.valid) return <p className="text-sm text-amber-300">{periodsResult.warning}</p>;
      return (
        <div className="space-y-2 text-sm text-slate-100">
          <p className="text-slate-200">Период: {periodsResult.rangeLabel}</p>
          <ul className="space-y-1 text-xs leading-5">
            {periodsResult.rows.map((row) => (
              <li key={row.year}>
                {row.marker ? "● " : ""}
                {row.year}: день {row.weekday}, суффикс {row.yearSuffix}, main {row.main}, background {row.background}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const data = resultMap[activeTool];
    if (!data.valid) return <p className="text-sm text-amber-300">{data.warning}</p>;

    return (
      <p className="text-sm text-slate-100">
        {data.title}: <span className="font-semibold text-white">{String(data.value)}</span>
      </p>
    );
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
          {!isDateValid && birthDateInput.trim() && <p className="mt-2 text-xs text-amber-300">{karmaResult.warning}</p>}
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

            <button
              type="button"
              onClick={resetDate}
              className="mt-4 w-full rounded-xl border border-white/30 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
            >
              Изменить/сбросить дату
            </button>
          </>
        )}
      </section>
    </main>
  );
}
