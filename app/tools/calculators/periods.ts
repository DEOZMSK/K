import type { PeriodsInput, PeriodsResult } from "../types";

export function calculatePeriods(_input: PeriodsInput): PeriodsResult {
  return {
    valid: false,
    warning: "Формула Периодов не подключена: source repo недоступен в этом контейнере.",
    rows: [],
  };
}
