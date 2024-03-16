import { decodeAddress } from '@polkadot/util-crypto';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import BigNumber from 'bignumber.js';
import { type CastCacheValidatorFragment } from '@/shared/graphql/fragments';
import { type TokenAmount } from '@/shared/utils/index';
import { CHAINFLIP_PREFIX } from '../constants';

export const etherscanUrl = (): string => {
  switch (Number(process.env.NEXT_PUBLIC_ETHEREUM_NETWORK_ID)) {
    case 1:
      return `https://etherscan.io`;
    case 4:
      return `https://rinkeby.etherscan.io`;
    case 5:
      return `https://goerli.etherscan.io`;
    case 11155111:
      return `https://sepolia.etherscan.io`;
    default:
      return `https://etherscan.io`;
  }
};

export type NestedRecord = string | { [key: string]: NestedRecord };

// Recursively unpack/map a string to an object until we reach the leaf node
export function objectStringToValue(nestedObject: NestedRecord, stringKey: string): NestedRecord {
  return stringKey
    .split('.')
    .reduce((acc, key) => (typeof acc === 'object' ? acc?.[key] : acc), nestedObject);
}

type ComparatorArg = string | number | BigNumber | bigint;

export type Comparator = Record<'ASC' | 'DESC', (a: ComparatorArg, b: ComparatorArg) => 1 | 0 | -1>;

const compareAscending = (a: ComparatorArg, b: ComparatorArg): 1 | 0 | -1 => {
  if (BigNumber.isBigNumber(a) && BigNumber.isBigNumber(b)) {
    return (a.comparedTo(b) as 1 | 0 | -1) ?? 0;
  }
  if (a < b) return -1;
  if (a === b) return 0;
  return 1;
};

export const COMPARATORS: Comparator = {
  ASC: compareAscending,
  DESC: (a: ComparatorArg, b: ComparatorArg) => (compareAscending(a, b) * -1) as -1 | 0 | 1,
};

export const copy = (text: string): Promise<boolean> =>
  navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);

// NOT a strict check. Works for ss58 but not for hex. eg: ethereum address will return true
export const isChainflipSs58Address = (text: string): boolean => {
  try {
    decodeAddress(text, false, CHAINFLIP_PREFIX);
  } catch (err) {
    return false;
  }
  return true;
};

export function assert(condition: unknown, message: string): asserts condition {
  if (condition) return;
  const error = new Error(message);
  // Remove the first line of the stack, which is the assert function itself
  if (error.stack) error.stack = error.stack.replace(/\n.+/, '');
  throw error;
}

export const isTruthy = <T>(value: T | null | undefined): value is T => Boolean(value);

export const initSentry = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_SAMPLE_RATE) || undefined,
      allowUrls: [/chainflip\.io/],
      release: process.env.NEXT_PUBLIC_RELEASE_VERSION,
      tunnel: '/sentry',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('failed to initialize sentry:', error);
  }
};

export const sleep = (ms: number, { signal }: { signal?: AbortSignal } = {}): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(Error('aborted'));
      return;
    }

    let handleSignal: () => void;
    const timeout = setTimeout(() => {
      if (signal && handleSignal) {
        signal.removeEventListener('abort', handleSignal);
      }
      resolve();
    }, ms);

    if (signal) {
      handleSignal = () => {
        clearTimeout(timeout);
        reject(Error('aborted'));
        signal.removeEventListener('abort', handleSignal);
      };
      signal.addEventListener('abort', handleSignal);
    }
  });

export const noop = () => {
  // pass
};

// for tests only, do not use in production
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deepReplace = (obj: any, replacements: Record<string, (value: any) => any>): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepReplace(item, replacements)) as any;
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const replacer = replacements[key];

        return [key, replacer ? replacer(value) : deepReplace(value, replacements)];
      }),
    );
  }

  return obj;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const validatorTotalBalance = (validator: CastCacheValidatorFragment): TokenAmount =>
  validator.lockedBalance.add(validator.unlockedBalance);

export const numberToHexString = (amount: bigint | number): `0x${string}` =>
  `0x${amount.toString(16)}`;
