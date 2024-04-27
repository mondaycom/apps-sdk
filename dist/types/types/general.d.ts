export type JsonValue = string | number | boolean | null | Array<JsonValue> | {
    [key: string]: JsonValue;
};
