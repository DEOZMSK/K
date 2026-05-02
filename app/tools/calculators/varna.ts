import type { VarnaInput, VarnaResult } from "../types";

export function calculateVarna(_input: VarnaInput): VarnaResult {
  return { valid: false, warning: "Формула Варн не подключена: формула ещё не перенесена из бота." };
}
