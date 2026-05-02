import type { ExpressionInput, ExpressionResult } from "../types";

export function calculateExpression(_input: ExpressionInput): ExpressionResult {
  return { valid: false, warning: "Формула Экспрессии не подключена: формула ещё не перенесена из бота." };
}
