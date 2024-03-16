import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { isNullish } from './guards';
import { ALL_ZEROS, LEADING_ZEROS, PERIOD_WITH_TRAILING_ZEROS, TRAILING_ZEROS } from './regex';

export const clamp = (value: number | string, min: number, max: number) => {
  const startingValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  return Number.isNaN(startingValue) ? min : Math.min(Math.max(startingValue, min), max);
};

export function formatWithCommas(value: string | number): string;
export function formatWithCommas(value: string | number | null): string | null;
export function formatWithCommas(value: string | number | undefined): string | undefined;
export function formatWithCommas(
  value: string | number | null | undefined,
): string | null | undefined;
export function formatWithCommas(
  value: string | number | null | undefined,
): string | null | undefined {
  return value == null ? value : new BigNumber(value).toFormat();
}

export function formatWithNumeral(value: string | number, mandatoryDecimals?: boolean): string;
export function formatWithNumeral(
  value: null | undefined,
  mandatoryDecimals?: boolean,
): null | undefined;
export function formatWithNumeral(
  value: number | null | undefined,
  mandatoryDecimals?: boolean,
): string | null | undefined;
export function formatWithNumeral(
  value: string | number | null | undefined,
  mandatoryDecimals = false,
): string | number | null | undefined {
  if (isNullish(value) || Number.isNaN(value)) return value;

  if (value.toString().split('.')[0].length > 7) {
    return mandatoryDecimals
      ? numeral(value).format('0,0.00a')
      : numeral(value).format('0,0.[00]a');
  }

  return mandatoryDecimals ? numeral(value).format('0,0.00') : numeral(value).format('0,0.[00]');
}

export const normalizeZeros = (string: string): string =>
  string
    .replace(PERIOD_WITH_TRAILING_ZEROS, '')
    .replace(ALL_ZEROS, '')
    .replace(LEADING_ZEROS, '')
    .replace(TRAILING_ZEROS, '$1');

export const safeParseInt = (value: string | null | undefined, radix = 10): number | null => {
  if (isNullish(value)) return null;
  const parsed = Number.parseInt(value, radix);
  return Number.isNaN(parsed) ? null : parsed;
};

export const parseIntOrThrow = (value: string | number) => {
  if (typeof value === 'number') return value;
  const n = Number.parseInt(value, 10);
  if (Number.isSafeInteger(n)) return n;
  throw new Error('Failed to safely parse integer');
};
