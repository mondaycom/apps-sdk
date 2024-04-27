export function isDefined(val) {
    return val !== undefined && val !== null;
}
export function allPropsNotNullOrUndefined(obj) {
    return Object.values(obj).every(isDefined);
}
//# sourceMappingURL=guards.js.map