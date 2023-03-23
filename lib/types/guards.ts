export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

export function allPropsNotNullOrUndefined<T extends object>(obj: T): obj is Required<T> {
  return Object.values(obj).every(isDefined);
}
