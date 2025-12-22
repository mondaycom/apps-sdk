import { ObjectStorage } from '../../lib/object-storage';

// Mock Google Cloud Storage
const mockFile = {
  save: jest.fn(),
  exists: jest.fn(),
  download: jest.fn(),
  getMetadata: jest.fn(),
  delete: jest.fn(),
  getSignedUrl: jest.fn(),
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
    mockFile.getSignedUrl.mockResolvedValue([
      'https://storage.googleapis.com/test-bucket/test-file.txt?signed-url-params',
    ]);

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
      expect(mockBucket.getFiles).toHaveBeenCalledWith({
        maxResults: 100, // default value
      });
    });

    it('should list files with prefix filter', async () => {
      const prefix = 'test-';
      const result = await objectStorage.listFiles({ prefix });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
      expect(mockBucket.getFiles).toHaveBeenCalledWith({
        maxResults: 100,
        prefix: 'test-',
      });
    });

    it('should list files with pagination', async () => {
      const maxResults = 10;
      const result = await objectStorage.listFiles({ maxResults });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
      expect(mockBucket.getFiles).toHaveBeenCalledWith({
        maxResults: 10,
      });
    });

    it('should list files with all options', async () => {
      const options = {
        prefix: 'uploads/',
        maxResults: 5,
        pageToken: 'next-page-token',
      };

      const result = await objectStorage.listFiles(options);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
      expect(mockBucket.getFiles).toHaveBeenCalledWith({
        maxResults: 5,
        prefix: 'uploads/',
        pageToken: 'next-page-token',
      });
    });

    it('should handle next page token in response', async () => {
      // Mock response with next page token
      mockBucket.getFiles.mockResolvedValueOnce([
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
        { nextPageToken: 'page-2-token' }, // API response with next page token
      ]);

      const result = await objectStorage.listFiles({ maxResults: 1 });

      expect(result.success).toBe(true);
      expect(result.nextPageToken).toBe('page-2-token');
    });

    it('should handle list files error', async () => {
      mockBucket.getFiles.mockRejectedValueOnce(new Error('List failed'));

      const result = await objectStorage.listFiles();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to list files');
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

  describe('getPresignedUploadUrl', () => {
    it('should generate a presigned upload URL successfully', async () => {
      const fileName = 'upload-file.txt';
      const expectedUrl = 'https://storage.googleapis.com/test-bucket/upload-file.txt?signed-url-params';

      mockFile.getSignedUrl.mockResolvedValueOnce([expectedUrl]);

      const result = await objectStorage.getPresignedUploadUrl(fileName);

      expect(result.success).toBe(true);
      expect(result.presignedUrl).toBe(expectedUrl);
      expect(result.fileName).toBe(fileName);
      expect(mockFile.getSignedUrl).toHaveBeenCalledWith({
        version: 'v4',
        action: 'write',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expires: expect.any(Date),
        extensionHeaders: {
          'x-goog-content-length-range': '0,52428800', // 50 MB default limit
        },
      });
    });

    it('should generate a presigned upload URL with custom expiration', async () => {
      const fileName = 'upload-file.txt';
      const customExpires = new Date('2024-12-31T23:59:59Z');
      const expectedUrl = 'https://storage.googleapis.com/test-bucket/upload-file.txt?signed-url-params';

      mockFile.getSignedUrl.mockResolvedValueOnce([expectedUrl]);

      const result = await objectStorage.getPresignedUploadUrl(fileName, { expires: customExpires });

      expect(result.success).toBe(true);
      expect(result.presignedUrl).toBe(expectedUrl);
      expect(result.fileName).toBe(fileName);
      expect(mockFile.getSignedUrl).toHaveBeenCalledWith({
        version: 'v4',
        action: 'write',
        expires: customExpires,
        extensionHeaders: {
          'x-goog-content-length-range': '0,52428800', // 50 MB default limit
        },
      });
    });

    it('should generate a presigned upload URL with content type restriction', async () => {
      const fileName = 'upload-file.txt';
      const contentType = 'text/plain';
      const expectedUrl = 'https://storage.googleapis.com/test-bucket/upload-file.txt?signed-url-params';

      mockFile.getSignedUrl.mockResolvedValueOnce([expectedUrl]);

      const result = await objectStorage.getPresignedUploadUrl(fileName, { contentType });

      expect(result.success).toBe(true);
      expect(result.presignedUrl).toBe(expectedUrl);
      expect(result.fileName).toBe(fileName);
      expect(mockFile.getSignedUrl).toHaveBeenCalledWith({
        version: 'v4',
        action: 'write',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expires: expect.any(Date),
        contentType: 'text/plain',
        extensionHeaders: {
          'x-goog-content-length-range': '0,52428800', // 50 MB default limit
        },
      });
    });

    it('should generate a presigned upload URL with all options', async () => {
      const fileName = 'upload-file.txt';
      const customExpires = new Date('2024-12-31T23:59:59Z');
      const contentType = 'application/json';
      const expectedUrl = 'https://storage.googleapis.com/test-bucket/upload-file.txt?signed-url-params';

      mockFile.getSignedUrl.mockResolvedValueOnce([expectedUrl]);

      const result = await objectStorage.getPresignedUploadUrl(fileName, {
        expires: customExpires,
        contentType,
      });

      expect(result.success).toBe(true);
      expect(result.presignedUrl).toBe(expectedUrl);
      expect(result.fileName).toBe(fileName);
      expect(mockFile.getSignedUrl).toHaveBeenCalledWith({
        version: 'v4',
        action: 'write',
        expires: customExpires,
        contentType: 'application/json',
        extensionHeaders: {
          'x-goog-content-length-range': '0,52428800', // 50 MB default limit
        },
      });
    });

    it('should use default expiration when no expires option is provided', async () => {
      const fileName = 'upload-file.txt';
      const expectedUrl = 'https://storage.googleapis.com/test-bucket/upload-file.txt?signed-url-params';

      mockFile.getSignedUrl.mockResolvedValueOnce([expectedUrl]);

      // Mock Date.now to have predictable test results
      const mockNow = new Date('2023-01-01T12:00:00Z').getTime();
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => mockNow);

      const result = await objectStorage.getPresignedUploadUrl(fileName);

      expect(result.success).toBe(true);
      expect(mockFile.getSignedUrl).toHaveBeenCalledWith({
        version: 'v4',
        action: 'write',
        expires: new Date(mockNow + 15 * 60 * 1000), // 15 minutes from mockNow
        extensionHeaders: {
          'x-goog-content-length-range': '0,52428800', // 50 MB default limit
        },
      });

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should handle presigned URL generation failure', async () => {
      const fileName = 'upload-file.txt';

      mockFile.getSignedUrl.mockRejectedValueOnce(new Error('Signing failed'));

      const result = await objectStorage.getPresignedUploadUrl(fileName);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to generate presigned upload URL');
      expect(result.presignedUrl).toBeUndefined();
    });

    it('should handle empty file name gracefully', async () => {
      const fileName = '';

      mockFile.getSignedUrl.mockRejectedValueOnce(new Error('Invalid file name'));

      const result = await objectStorage.getPresignedUploadUrl(fileName);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to generate presigned upload URL');
    });

    it('should enforce 50 MB max file size limit', async () => {
      const fileName = 'large-file.bin';
      const expectedUrl = 'https://storage.googleapis.com/test-bucket/large-file.bin?signed-url-params';
      const fiftyMBInBytes = 50 * 1024 * 1024; // 52,428,800 bytes

      mockFile.getSignedUrl.mockResolvedValueOnce([expectedUrl]);

      const result = await objectStorage.getPresignedUploadUrl(fileName);

      expect(result.success).toBe(true);
      expect(mockFile.getSignedUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          extensionHeaders: {
            'x-goog-content-length-range': `0,${fiftyMBInBytes}`,
          },
        }),
      );
    });
  });
});
