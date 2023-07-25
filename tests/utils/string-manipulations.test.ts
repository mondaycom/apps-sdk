import { snakeCase } from 'utils/string-manipulations';

describe('StringManipulations', () => {
  describe('snakeCase', () => {
    describe('lower case', () => {
      it('should convert kebab case to snake case', () => {
        const result = snakeCase('kebab-case');
        expect(result).toEqual('kebab_case');
      });

      it('should convert camel case to snake case', () => {
        const result = snakeCase('camelCase');
        expect(result).toEqual('camel_case');
      });

      it('should convert pascal case to snake case', () => {
        const result = snakeCase('PascalCase');
        expect(result).toEqual('pascal_case');
      });

      it('should convert snake case to snake case', () => {
        const result = snakeCase('snake_case');
        expect(result).toEqual('snake_case');
      });

      it('should return empty string for empty string', () => {
        const result = snakeCase('');
        expect(result).toEqual('');
      });
    });

    describe('upper case', () => {
      it('should convert kebab case to snake case', () => {
        const result = snakeCase('kebab-case', { upperCase: true });
        expect(result).toEqual('KEBAB_CASE');
      });

      it('should convert camel case to snake case', () => {
        const result = snakeCase('camelCase', { upperCase: true });
        expect(result).toEqual('CAMEL_CASE');
      });

      it('should convert pascal case to snake case', () => {
        const result = snakeCase('PascalCase', { upperCase: true });
        expect(result).toEqual('PASCAL_CASE');
      });

      it('should convert snake case to snake case', () => {
        const result = snakeCase('snake_case', { upperCase: true });
        expect(result).toEqual('SNAKE_CASE');
      });

      it('should return empty string for empty string', () => {
        const result = snakeCase('', { upperCase: true });
        expect(result).toEqual('');
      });

      it('should convert mixed letters to snake case', () => {
        const result = snakeCase('aAaA', { upperCase: true });
        expect(result).toEqual('A_AA_A');
      });
    });
  });
});
