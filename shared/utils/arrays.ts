export const cloneObjects = <T extends NonNullable<unknown>>(objects: T[]): T[] =>
  objects.map((o) => ({ ...o }));
