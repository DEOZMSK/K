import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePeriods } from './periods';
import { parseBirthDate, reduceToDigit } from './shared';

test('parse birth date formats', () => {
  assert.ok(parseBirthDate('07.09.1994'));
  assert.ok(parseBirthDate('7.9.1994'));
  assert.ok(parseBirthDate('07/09/1994'));
  assert.ok(parseBirthDate('07091994'));
  assert.equal(parseBirthDate('31.02.1994'), null);
});

test('reduceToDigit zero to nine', () => {
  assert.equal(reduceToDigit(0), 9);
});

test('periods leap day fallback row exists', () => {
  const res = calculatePeriods({ birthDate: '29.02.2000', mode: '±5', currentYear: 2001 });
  assert.equal(res.valid, true);
  assert.ok(res.rows.length > 0);
});
