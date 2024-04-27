export declare function isDefined<T>(val: T | undefined | null): val is T;
export declare function allPropsNotNullOrUndefined<T extends object>(obj: T): obj is Required<T>;
