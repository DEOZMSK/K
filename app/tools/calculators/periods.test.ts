import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateMonths } from './months';
import { calculatePeriods } from './periods';
import { parseBirthDate, reduceToDigit } from './shared';

test('parseBirthDate supports valid formats and rejects invalid dates', () => {
  assert.deepEqual(parseBirthDate('27.01.1989'), { day: 27, month: 1, year: 1989, ddmmyyyy: '27011989' });
  assert.deepEqual(parseBirthDate('27/01/1989'), { day: 27, month: 1, year: 1989, ddmmyyyy: '27011989' });
  assert.deepEqual(parseBirthDate('27-1-1989'), { day: 27, month: 1, year: 1989, ddmmyyyy: '27011989' });
  assert.deepEqual(parseBirthDate('27011989'), { day: 27, month: 1, year: 1989, ddmmyyyy: '27011989' });

  assert.equal(parseBirthDate('31.02.2020'), null);
  assert.equal(parseBirthDate('29.02.2023'), null);
  assert.equal(parseBirthDate('00.01.2020'), null);
  assert.equal(parseBirthDate('2020-01-01'), null);
});

test('leap-day fallback for non-leap years uses 01.03', () => {
  const result = calculatePeriods({ birthDate: '29.02.2000', mode: '±5', currentYear: 2024 });
  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.deepEqual(result.rows.filter((r) => [2023, 2024, 2025].includes(r.year)), [
    { year: 2023, marker: '', weekday: '5', yearSuffix: '23', main: '5', background: '4' },
    { year: 2024, marker: '●', weekday: '3', yearSuffix: '24', main: '4', background: '5' },
    { year: 2025, marker: '', weekday: '8', yearSuffix: '25', main: '1', background: '6' },
  ]);
});

test('period rows follow weekday/year_suffix/main/background formulas', () => {
  const birthDate = '10.02.1991';
  const result = calculatePeriods({ birthDate, mode: '±5', currentYear: 2024 });
  assert.equal(result.valid, true);
  if (!result.valid) return;

  const weekdayMap = [2, 9, 5, 3, 6, 8, 1] as const;
  const expressionNum = reduceToDigit(10 + 2);
  const destinyNum = reduceToDigit(10 + 2 + 1991);

  for (const row of result.rows) {
    const anniversary = new Date(Date.UTC(row.year, 1, 10));
    const pyWeekday = (anniversary.getUTCDay() + 6) % 7;
    const expectedWeekday = String(weekdayMap[pyWeekday]);
    const expectedYearSuffix = String(row.year).slice(-2);
    const expectedMain = String(reduceToDigit(Number(expectedWeekday) + Number(expectedYearSuffix) + expressionNum));
    const expectedBackground = String(reduceToDigit(destinyNum + reduceToDigit(String(row.year).split('').reduce((a, d) => a + Number(d), 0))));

    assert.equal(row.weekday, expectedWeekday);
    assert.equal(row.yearSuffix, expectedYearSuffix);
    assert.equal(row.main, expectedMain);
    assert.equal(row.background, expectedBackground);
  }
});

test('range modes -10, +10, ±5 produce expected windows with birth-year clamp', () => {
  const backward = calculatePeriods({ birthDate: '11.12.2018', mode: '-10', currentYear: 2025 });
  const forward = calculatePeriods({ birthDate: '01.01.2000', mode: '+10', currentYear: 2025 });
  const balanced = calculatePeriods({ birthDate: '07.06.1990', mode: '±5', currentYear: 2025 });

  assert.equal(backward.valid, true);
  assert.equal(forward.valid, true);
  assert.equal(balanced.valid, true);
  if (!backward.valid || !forward.valid || !balanced.valid) return;

  assert.deepEqual(backward.rows.map((r) => r.year), [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]);
  assert.deepEqual(forward.rows.map((r) => r.year), [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]);
  assert.deepEqual(balanced.rows.map((r) => r.year), [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]);
});

test('months row values match expected numerology progression', () => {
  const result = calculateMonths({ birthDate: '27.01.1989' });
  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.deepEqual(result.headers, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  assert.deepEqual(result.expressionRow, ['2', '3', '4', '5', '6', '7', '8', '9', '1', '2', '3', '4']);
  assert.deepEqual(result.karmaRow, ['2', '3', '4', '5', '6', '7', '8', '9', '1', '2', '3', '4']);
});

test('reduceToDigit edge case: 0 -> 9', () => {
  assert.equal(reduceToDigit(0), 9);
});
