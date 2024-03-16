export const isNullish = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

export const isNotNullish = <T>(value: T | null | undefined): value is T => !isNullish(value);

export const isFullfilled = <T>(
  value: PromiseSettledResult<T>,
): value is PromiseFulfilledResult<T> => value.status === 'fulfilled';

export const isRejected = <T>(value: PromiseSettledResult<T>): value is PromiseRejectedResult =>
  value.status === 'rejected';

export function unreachable(value: never, message: string): never {
  throw new Error(message);
}
