import { ObjectStorage } from '../../lib/object-storage';

// Mock Google Cloud Storage
const mockFile = {
  save: jest.fn(),
  exists: jest.fn(),
  download: jest.fn(),
  getMetadata: jest.fn(),
  delete: jest.fn(),
  name: 'test-file.txt',
};

const mockBucket = {
  file: jest.fn((fileName: string) => ({
    ...mockFile,
    name: fileName,
    getMetadata: jest.fn().mockResolvedValue([
      {
        name: fileName,
        size: '100',
        contentType: 'text/plain',
        updated: '2023-01-01T00:00:00.000Z',
        etag: 'test-etag',
        metadata: { 'test-key': 'test-value' },
      },
    ]),
  })),
  getFiles: jest.fn(),
};

const mockStorage = {
  bucket: jest.fn(() => mockBucket),
};

jest.mock('@google-cloud/storage', () => ({
  Storage: jest.fn(() => mockStorage),
}));

describe('ObjectStorage', () => {
  let objectStorage: ObjectStorage;
  const originalEnv = process.env;

  beforeEach(() => {
    // Set up test environment
    process.env = {
      ...originalEnv,
      OBJECT_STORAGE_BUCKET: 'test-bucket-object-storage',
    };

    // Reset all mocks
    jest.clearAllMocks();

    // Set up default mock responses
    mockFile.save.mockResolvedValue(undefined);
    mockFile.exists.mockResolvedValue([true]);
    mockFile.download.mockResolvedValue([Buffer.from('file content')]);
    mockFile.getMetadata.mockResolvedValue([
      {
        name: 'test-file.txt',
        size: '100',
        contentType: 'text/plain',
        updated: '2023-01-01T00:00:00.000Z',
        etag: 'test-etag',
        metadata: { 'test-key': 'test-value' },
      },
    ]);
    mockFile.delete.mockResolvedValue(undefined);

    mockBucket.getFiles.mockResolvedValue([
      [
        {
          name: 'test-file.txt',
          metadata: {
            name: 'test-file.txt',
            size: '100',
            contentType: 'text/plain',
            updated: '2023-01-01T00:00:00.000Z',
            etag: 'test-etag',
            metadata: { 'test-key': 'test-value' },
          },
        },
      ],
      {},
      {},
    ]);

    objectStorage = new ObjectStorage();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const fileName = 'test-file.txt';
      const content = 'Hello, World!';

      const result = await objectStorage.uploadFile(fileName, content, {
        contentType: 'text/plain',
        metadata: { 'uploaded-by': 'test' },
      });

      expect(result.success).toBe(true);
      expect(result.fileName).toBe(fileName);
      expect(result.fileUrl).toContain(fileName);
    });

    it('should handle upload failure gracefully', async () => {
      const fileName = '';
      const content = 'Hello, World!';

      // Mock file save to throw an error
      mockFile.save.mockRejectedValueOnce(new Error('Upload failed'));

      const result = await objectStorage.uploadFile(fileName, content);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('downloadFile', () => {
    it('should download an existing file', async () => {
      const fileName = 'existing-file.txt';

      const result = await objectStorage.downloadFile(fileName);

      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      expect(result.contentType).toBeDefined();
    });

    it('should handle file not found', async () => {
      const fileName = 'non-existent-file.txt';

      // Mock file doesn't exist
      mockFile.exists.mockResolvedValueOnce([false]);

      const result = await objectStorage.downloadFile(fileName);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');
    });
  });

  describe('listFiles', () => {
    it('should list files with default options', async () => {
      const result = await objectStorage.listFiles();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
    });

    it('should list files with prefix filter', async () => {
      const result = await objectStorage.listFiles({ prefix: 'test-' });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
    });

    it('should list files with pagination', async () => {
      const result = await objectStorage.listFiles({ maxResults: 10 });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
    });
  });

  describe('deleteFile', () => {
    it('should delete an existing file', async () => {
      const fileName = 'file-to-delete.txt';

      const result = await objectStorage.deleteFile(fileName);

      expect(result.success).toBe(true);
    });

    it('should handle file not found during deletion', async () => {
      const fileName = 'non-existent-file.txt';

      // Mock file doesn't exist
      mockFile.exists.mockResolvedValueOnce([false]);

      const result = await objectStorage.deleteFile(fileName);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');
    });
  });

  describe('getFileInfo', () => {
    it('should return file information', async () => {
      const fileName = 'info-file.txt';

      const result = await objectStorage.getFileInfo(fileName);

      expect(result.success).toBe(true);
      expect(result.fileInfo).toBeDefined();
      expect(result.fileInfo?.name).toBe(fileName);
      expect(typeof result.fileInfo?.size).toBe('number');
      expect(result.fileInfo?.contentType).toBeDefined();
      expect(result.fileInfo?.lastModified).toBeInstanceOf(Date);
    });

    it('should handle file not found', async () => {
      const fileName = 'non-existent-file.txt';

      // Mock file doesn't exist
      mockFile.exists.mockResolvedValueOnce([false]);

      const result = await objectStorage.getFileInfo(fileName);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');
    });
  });
});
