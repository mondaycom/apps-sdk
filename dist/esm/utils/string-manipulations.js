var splitCaps = function (str) { return str
    .replace(/([a-z])([A-Z]+)/g, function (_, firstGroup, secondGroup) { return "".concat(firstGroup, " ").concat(secondGroup); })
    .replace(/([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/, function (_, firstGroup, secondGroup, thirdGroup) { return "".concat(firstGroup).concat(secondGroup.toLowerCase()).concat(thirdGroup); })
    .replace(/([A-Z]+)([A-Z][a-z])/g, function (_, firstGroup, secondGroup) { return "".concat(firstGroup.toLowerCase(), " ").concat(secondGroup); }); };
export var snakeCase = function (kebabCase, _a) {
    var _b = _a === void 0 ? {} : _a, upperCase = _b.upperCase;
    return splitCaps(kebabCase)
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(function (word) { return upperCase ? word.toUpperCase() : word.toLowerCase(); })
        .join('_');
};
//# sourceMappingURL=string-manipulations.js.map