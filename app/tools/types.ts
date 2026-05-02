export type CalculatorResultBase = {
  valid: boolean;
  warning?: string;
};

export type BirthDateInput = {
  birthDate: string;
};

export type KarmaInput = BirthDateInput;
export type AhamkaraInput = BirthDateInput;
export type DharmaInput = BirthDateInput;
export type ExpressionInput = BirthDateInput;
export type VyavadanaInput = BirthDateInput;
export type VarnaInput = BirthDateInput;

export type PeriodMode = "-10" | "+10" | "±5";
export type PeriodsInput = BirthDateInput & {
  mode: PeriodMode;
  currentYear?: number;
};

export type MonthsInput = BirthDateInput;

export type KarmaResult = CalculatorResultBase & { value?: number | string };
export type AhamkaraResult = CalculatorResultBase & { value?: number | string };
export type DharmaResult = CalculatorResultBase & { value?: number | string };
export type ExpressionResult = CalculatorResultBase & { value?: number | string };
export type VyavadanaResult = CalculatorResultBase & { value?: number | string };
export type VarnaResult = CalculatorResultBase & { value?: number | string };

export type PeriodRow = {
  year: number;
  marker: string;
  weekday: string;
  yearSuffix: string;
  main: string;
  background: string;
};

export type PeriodsResult = CalculatorResultBase & {
  rangeLabel?: string;
  rows: PeriodRow[];
};

export type MonthsResult = CalculatorResultBase & {
  headers: string[];
  expressionRow: string[];
  karmaRow: string[];
};
