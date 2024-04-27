"use strict";
exports.__esModule = true;
exports.allPropsNotNullOrUndefined = exports.isDefined = void 0;
function isDefined(val) {
    return val !== undefined && val !== null;
}
exports.isDefined = isDefined;
function allPropsNotNullOrUndefined(obj) {
    return Object.values(obj).every(isDefined);
}
exports.allPropsNotNullOrUndefined = allPropsNotNullOrUndefined;
//# sourceMappingURL=guards.js.map