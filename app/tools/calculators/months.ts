import type { MonthsInput, MonthsResult } from "../types";

export function calculateMonths(_input: MonthsInput): MonthsResult {
  return {
    valid: false,
    warning: "Формула Месяцев не подключена: формула ещё не перенесена из бота.",
    headers: [],
    expressionRow: [],
    karmaRow: [],
  };
}
