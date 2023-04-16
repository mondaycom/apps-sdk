/** @type {import('ts-jest').JestConfigWithTsJest} */
function makeModuleNameMapper(srcPath, tsconfigPath) {
  // Get paths from tsconfig
  const tsConfig = require(tsconfigPath);
  const { paths } = tsConfig.compilerOptions;

  const aliases = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach(item => {
    const key = `^${item.replace('/*', '/(.*)')}$`;
    const path = paths[item][0].replace('./lib/', '').replace('*', '$1');
    aliases[key] = srcPath + '/' + path;
  });
  return aliases;
}

const TS_CONFIG_PATH = './tsconfig.json';
const SRC_PATH = '<rootDir>/lib';

module.exports = {
  moduleNameMapper: makeModuleNameMapper(SRC_PATH, TS_CONFIG_PATH),
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.general.json',
    },
  },
};
