// eslint-disable-next-line max-classes-per-file
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { type ChainflipAsset } from '@/shared/utils/chainflip';
import { chainflipAssetMap } from '@/shared/utils/env';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TokenCast<T, U> =
  // if the value to cast is an empty array, return an empty array
  T extends []
    ? []
    : // recursively cast array items
    T extends [infer A, ...infer B]
    ? [TokenCast<A, U>, ...TokenCast<B, U>]
    : // recursively cast object values
    T extends Record<string, any>
    ? { [K in keyof T]: K extends U ? TokenAmount : TokenCast<T[K], U> }
    : T;
/* eslint-enable @typescript-eslint/no-explicit-any */

type InputValue = TokenAmount | BigNumber.Value | bigint;

const ROUNDING_MODE = {
  ROUND_UP: 0,
  ROUND_DOWN: 1,
  ROUND_CEIL: 2,
  ROUND_FLOOR: 3,
  ROUND_HALF_UP: 4,
  ROUND_HALF_DOWN: 5,
  ROUND_HALF_EVEN: 6,
  ROUND_HALF_CEIL: 7,
  ROUND_HALF_FLOOR: 8,
} as const;

type RoundingMode = keyof typeof ROUNDING_MODE;

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const DEFAULT_DECIMAL_PLACES: number = 18;

const STRINGIFIED_TOKEN_AMOUNT_FLAG = '_isStringifiedTokenAmount';
export default class TokenAmount {
  protected static readonly defaultDecimalPlaces = DEFAULT_DECIMAL_PLACES;

  static readonly ZERO = new this(0, this.defaultDecimalPlaces);

  static castObject<T, const K extends readonly string[]>(
    obj: T,
    keys: K,
  ): TokenCast<T, K[number]> {
    if (Array.isArray(obj)) {
      return obj.map((item) => TokenAmount.castObject(item, keys)) as TokenCast<T, K[number]>;
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (keys.includes(key) && typeof value === 'string') {
            return [key, new this(value)];
          }
          return [key, TokenAmount.castObject(value, keys)];
        }),
      ) as TokenCast<T, K[number]>;
    }

    return obj as TokenCast<T, K[number]>;
  }

  static from(value: BigNumber.Value | null | undefined): TokenAmount | null {
    if (value === null || value === undefined) return null;

    try {
      return new this(value);
    } catch {
      return null;
    }
  }

  static fromAsset(value: bigint, asset: ChainflipAsset): TokenAmount;
  static fromAsset(value: BigNumber.Value, asset: ChainflipAsset): TokenAmount;
  static fromAsset(value: null | undefined, asset: ChainflipAsset): null;
  static fromAsset(
    value: BigNumber.Value | bigint | null | undefined,
    asset: ChainflipAsset,
  ): TokenAmount | null;
  static fromAsset(
    value: BigNumber.Value | bigint | null | undefined,
    asset: ChainflipAsset,
  ): TokenAmount | null {
    if (value === null || value === undefined) return null;

    try {
      return new this(value, chainflipAssetMap[asset].decimals);
    } catch {
      return null;
    }
  }

  static fromWholeUnits(
    value: BigNumber.Value,
    decimalPlaces = this.defaultDecimalPlaces,
  ): TokenAmount {
    return new TokenAmount(new BigNumber(value).shiftedBy(decimalPlaces), decimalPlaces);
  }

  static sum(amounts: BigNumber.Value[], decimalPlaces?: number): TokenAmount {
    return new this(BigNumber.sum(...amounts), decimalPlaces ?? this.defaultDecimalPlaces);
  }

  static clone({ decimalPlaces }: { decimalPlaces: number }): typeof TokenAmount {
    return class extends TokenAmount {
      protected static readonly defaultDecimalPlaces = decimalPlaces;

      static readonly ZERO = new this(0);

      constructor(value: InputValue) {
        super(value, decimalPlaces);
      }
    };
  }

  static areEqual(a: TokenAmount | undefined, b: TokenAmount | undefined): boolean {
    return a?.eq(b) ?? false;
  }

  private bigNumber: BigNumber | undefined;

  private formattedString: string | undefined;

  readonly value: BigNumber;

  readonly decimalPlaces;

  constructor(value: InputValue, decimalPlaces?: number) {
    this.decimalPlaces = decimalPlaces ?? this.Class.defaultDecimalPlaces;
    if (value instanceof TokenAmount) {
      this.value = value.value;
    } else {
      const coerced = typeof value === 'bigint' ? value.toString() : value;
      this.value = new (BigNumber.clone({
        DECIMAL_PLACES: this.decimalPlaces,
      }))(coerced);
    }
    this.value = this.value.decimalPlaces(0, BigNumber.ROUND_DOWN);
  }

  private get Class(): typeof TokenAmount {
    return this.constructor as typeof TokenAmount;
  }

  add(amount: TokenAmount | BigNumber.Value): TokenAmount {
    if (amount instanceof TokenAmount) {
      return new this.Class(this.value.plus(amount.value), this.decimalPlaces);
    }

    return new this.Class(this.value.plus(amount), this.decimalPlaces);
  }

  sub(amount: TokenAmount | BigNumber.Value): TokenAmount {
    if (amount instanceof TokenAmount) {
      return new this.Class(this.value.minus(amount.value), this.decimalPlaces);
    }

    return new this.Class(this.value.minus(amount), this.decimalPlaces);
  }

  saturatingSub(amount: TokenAmount | BigNumber.Value): TokenAmount {
    return this.sub(amount).max(this.Class.ZERO);
  }

  /**
   * @deprecated
   * Division of token amounts is not supported. If you are looking to divide
   * token amounts, there is probably a different operation you want to perform.
   *
   * If we do actually have a use case for dividing token amounts, it should
   * only be valid for BigNumber.Value types and not other TokenAmounts.
   */
  // eslint-disable-next-line class-methods-use-this
  private div(_amount: BigNumber.Value): never {
    throw new Error('Method not implemented.');
  }

  difference(amount: TokenAmount): BigNumber {
    return new BigNumber(this.value).minus(amount.value).div(amount.value).multipliedBy(100);
  }

  mul(amount: BigNumber.Value): TokenAmount {
    return new this.Class(this.value.times(amount), this.decimalPlaces);
  }

  eq(amount: TokenAmount | BigNumber.Value | null | undefined): boolean {
    if (amount === null || amount === undefined) return false;
    if (amount instanceof TokenAmount) {
      return this.decimalPlaces === amount.decimalPlaces && this.value.eq(amount.value);
    }
    return this.value.eq(amount);
  }

  cmp(amount: TokenAmount | BigNumber.Value): -1 | 0 | 1 {
    if (amount instanceof TokenAmount)
      return (this.value.comparedTo(amount.value) ?? 0) as -1 | 0 | 1;
    return (this.value.comparedTo(amount) ?? 0) as -1 | 0 | 1;
  }

  lt(amount: TokenAmount | BigNumber.Value): boolean {
    if (amount instanceof TokenAmount) return this.value.lt(amount.value);
    return this.value.lt(amount);
  }

  lte(amount: TokenAmount | BigNumber.Value): boolean {
    if (amount instanceof TokenAmount) return this.value.lte(amount.value);
    return this.value.lte(amount);
  }

  gt(amount: TokenAmount | BigNumber.Value): boolean {
    if (amount instanceof TokenAmount) return this.value.gt(amount.value);
    return this.value.gt(amount);
  }

  abs(): TokenAmount {
    return new this.Class(this.value.abs(), this.decimalPlaces);
  }

  max(other: TokenAmount): TokenAmount {
    return this.gt(other) ? this : other;
  }

  /**
   * @returns a ratio of this amount to the given amount, e.g. if this amount
   *          is 1 and the given amount is 2, the ratio will be 0.5.
   */
  ratio(amount: TokenAmount): BigNumber {
    return new BigNumber(this.toFixed()).div(amount.toFixed());
  }

  toNumber(): number {
    return this.toBigNumber().toNumber();
  }

  toBigNumber(): BigNumber {
    this.bigNumber ??= this.value.shiftedBy(-this.decimalPlaces);
    return this.bigNumber;
  }

  toBigInt(): bigint {
    return BigInt(this.toString());
  }

  /**
   * @returns the token amount as its "whole" unit with as many decimal places
   *          as required, e.g. for Ether it will return the amount in Ether,
   *          not in Wei.
   */
  toFixed(decimals?: number, roundingMode: RoundingMode = 'ROUND_HALF_UP'): string {
    return decimals === undefined
      ? this.toBigNumber().toFixed()
      : this.toBigNumber().toFixed(decimals, ROUNDING_MODE[roundingMode]);
  }

  /**
   * @returns returns the token amount without trailing 0s (or 2 trailing 0s if whole number)
   */
  toFixedDisplay(roundingMode: RoundingMode = 'ROUND_HALF_UP'): string {
    const number = new BigNumber(this.toFixed(Math.min(this.decimalPlaces, 8), roundingMode));
    const dp = number.dp();
    return typeof dp === 'number' && dp < 2 ? number.toFixed(2) : number.toFixed();
  }

  toPreciseFixedDisplay(): string {
    return this.toFixedDisplay('ROUND_DOWN');
  }

  toPreciseFormattedString(decimalPlaces = 8, roundingMode: RoundingMode = 'ROUND_DOWN'): string {
    const bigNumber = this.toBigNumber();

    if (bigNumber.isZero()) return '0.00';
    if (bigNumber.lt(1e-8)) return '<0.00000001';

    const string = bigNumber.toFormat(
      decimalPlaces ?? this.decimalPlaces,
      ROUNDING_MODE[roundingMode],
    );

    try {
      return string.replace(/(?<=\.\d\d\d*)0+$/, '');
    } catch {
      // all major browsers now support positive lookbehind, but Safari only
      // shipped support Jan 2023
      return string;
    }
  }

  toFormattedString(): string {
    if (this.formattedString) return this.formattedString;

    const bigNumber = this.toBigNumber();
    if (bigNumber.isZero()) {
      this.formattedString = '0';
    } else if (bigNumber.isLessThan(1e-2)) {
      this.formattedString = '<0.01'; // bug in numeral.js, numbers less than 1e-7 aren't formatted correctly (NaN)
    } else {
      this.formattedString = numeral(bigNumber.toString())
        .format(bigNumber.isGreaterThan(100000) ? '0,0.[00]a' : '0,0.[00]')
        .replace('m', 'M');
    }
    return this.formattedString;
  }

  /**
   * @returns the token amount as its base unit, e.g. for Ether it will return
   *          the amount in wei. You probably don't want this one
   */
  toString(): string {
    return this.value.toFixed();
  }

  toJSON() {
    return {
      [STRINGIFIED_TOKEN_AMOUNT_FLAG]: true,
      value: this.value.toString(),
      decimalPlaces: this.decimalPlaces,
    };
  }

  isNaN(): boolean {
    return this.value.isNaN();
  }

  negated(): TokenAmount {
    return new this.Class(this.value.negated(), this.decimalPlaces);
  }
}

export const stringifiedTokenAmountReviver = (_key: string, value: unknown) => {
  const isObject = value && typeof value === 'object';
  if (isObject && STRINGIFIED_TOKEN_AMOUNT_FLAG in value) {
    const { value: tokenAmountValue, decimalPlaces } = value as unknown as ReturnType<
      TokenAmount['toJSON']
    >;

    return new TokenAmount(tokenAmountValue, decimalPlaces);
  }
  return value;
};
