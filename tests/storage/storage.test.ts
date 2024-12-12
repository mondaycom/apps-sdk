import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import fetch from 'node-fetch';

import { Storage } from 'lib/storage/storage';

import { InternalServerError } from '../../lib/errors/apps-sdk-error';

jest.mock('node-fetch');

const FAKE_TOKEN = 'fake token';
const expectedOptions = {
  headers: {
    Authorization: FAKE_TOKEN,
    'Content-Type': 'application/json',
    'User-Agent': 'monday-apps-sdk',
  },
  method: 'GET',
};

const term = 'mySearchTerm';
const cursorID = 'myCursorId';

describe('Storage', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Search', () => {
    it.each([
      [term, {}, `https://apps-storage.monday.com/api/v2/items?term=${term}`],
      [term, { cursor: cursorID }, `https://apps-storage.monday.com/api/v2/items?term=${term}&cursor=${cursorID}`],
    ])(
      'Should show correct URL when called with a term and return array for result',
      async (term: string, cursor: object, expectedUrl: string) => {
        // Arrange
        const storage = new Storage(FAKE_TOKEN);

        (fetch as unknown as jest.Mock).mockResolvedValue({
          json: () => ({ records: [{ key: 'aaa', value: 1, backendOnly: false }] }),
          status: StatusCodes.OK,
        });

        // Act
        const results = await storage.search(term, cursor);

        // Assert
        expect(results.success).toEqual(true);
        expect(results.records).toBeInstanceOf(Array);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
      },
    );

    it('Should throw internal server error when an unexpected error occurs', async () => {
      // Arrange
      const storage = new Storage(FAKE_TOKEN);

      (fetch as unknown as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      // Act + Assert
      await expect(async () => await storage.search(term)).rejects.toThrow(InternalServerError);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
