import type { AhamkaraInput, AhamkaraResult } from "../types";

export function calculateAhamkara(_input: AhamkaraInput): AhamkaraResult {
  return { valid: false, warning: "Формула Ахамкары не подключена: source repo недоступен в этом контейнере." };
}
