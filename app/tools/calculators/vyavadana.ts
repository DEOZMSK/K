import type { VyavadanaInput, VyavadanaResult } from "../types";

export function calculateVyavadana(_input: VyavadanaInput): VyavadanaResult {
  return { valid: false, warning: "Формула Вьяваданы не подключена: формула ещё не перенесена из бота." };
}
