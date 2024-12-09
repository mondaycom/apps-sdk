import { Storage } from 'lib/storage/storage';

const FAKE_TOKEN = 'fake token';

describe('Storage', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Search', () => {
    it.each([
      [
        [
          {
            key: 'aaa',
            value: 1,
            backendOnly: false,
          },
        ],
      ],
      [
        [
          {
            key: 'aaab',
            value: 2,
            backendOnly: false,
          },
          {
            key: 'aaac',
            value: 3,
            backendOnly: false,
          },
        ],
      ],
    ])('Should return records matching the searched term', async records => {
      // Arrange
      const storage = new Storage(FAKE_TOKEN);
      const term = 'aaa';

      //overriding protected method only in tests
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jest.spyOn(storage, 'storageFetchV2').mockResolvedValue({ records, term, accountId: 1 });

      // Act
      const results = await storage.search(term);

      // Assert
      expect(results).toEqual({ success: true, records });
    });
  });
});
