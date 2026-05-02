import type { DharmaInput, DharmaResult } from "../types";

export function calculateDharma(_input: DharmaInput): DharmaResult {
  return { valid: false, warning: "Формула Дхармы не подключена: формула ещё не перенесена из бота." };
}
