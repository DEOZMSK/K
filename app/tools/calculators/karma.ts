import type { KarmaInput, KarmaResult } from "../types";

export function calculateKarma(_input: KarmaInput): KarmaResult {
  return { valid: false, warning: "Формула Кармы не подключена: source repo недоступен в этом контейнере." };
}
