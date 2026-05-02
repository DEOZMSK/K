export type CalculatorResultBase = {
  valid: boolean;
  warning?: string;
};

export type DigitProfileInput = {
  birthDate: string;
};

export type DigitProfileResult = CalculatorResultBase & {
  lifePath?: number;
  expression?: number;
};
