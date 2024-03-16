import { isNullish } from './guards';

type KeysOfUnion<T> = T extends T ? keyof T : never;
export const keys = Object.keys as <T>(obj: T) => KeysOfUnion<T>[];

type EntriesOfUnion<T> = T extends T ? { [K in keyof T]: [K, T[K]] }[keyof T][] : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CombineArrayUntion<T extends any[]> = T[number];

// this isn't really type safe per se. it combines all possible entries of a
// union type but it makes dealing with our asset maps easier, because we just
// care about all possible combinations of the keys, not which ones are actually
// present
export const entries = Object.entries as <T>(obj: T) => CombineArrayUntion<EntriesOfUnion<T>>[];

export const sortByValues = <T extends object>(obj: T, desc = true): T =>
  Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => (desc ? b - a : a - b))) as T;

type NonNullish<T> = {
  [P in keyof T]-?: NonNullish<NonNullable<T[P]>>;
};

export const stripNullish = <T extends object>(obj: T): NonNullish<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => !isNullish(value)),
  ) as NonNullish<T>;
