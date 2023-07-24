const splitCaps = (str: string) => str
  .replace(/([a-z])([A-Z]+)/g, (_, firstGroup: string, secondGroup: string) => `${firstGroup} ${secondGroup}`)
  .replace(/([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/, (_, firstGroup: string, secondGroup: string, thirdGroup: string) => `${firstGroup}${secondGroup.toLowerCase()}${thirdGroup}`)
  .replace(/([A-Z]+)([A-Z][a-z])/g,
    (_, firstGroup: string, secondGroup: string) => `${firstGroup.toLowerCase()} ${secondGroup}`);

export const snakeCase = (kebabCase: string, { upperCase }: { upperCase?: boolean } = {}) =>
  splitCaps(kebabCase)
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => upperCase ? word.toUpperCase() : word.toLowerCase())
    .join('_');
