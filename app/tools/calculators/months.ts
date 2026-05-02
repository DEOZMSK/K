import type { MonthsInput, MonthsResult } from "../types";

export function calculateMonths(_input: MonthsInput): MonthsResult {
  return {
    valid: false,
    warning: "Формула Месяцев не подключена: source repo недоступен в этом контейнере.",
    headers: [],
    expressionRow: [],
    karmaRow: [],
  };
}
