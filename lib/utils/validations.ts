export const isObject = <T>(value: T): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
