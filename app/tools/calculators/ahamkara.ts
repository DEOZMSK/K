import type { AhamkaraInput, AhamkaraResult } from "../types";

export function calculateAhamkara(_input: AhamkaraInput): AhamkaraResult {
  return { valid: false, warning: "Формула Ахамкары не подключена: формула ещё не перенесена из бота." };
}
