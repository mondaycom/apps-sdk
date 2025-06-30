import { ObjectStorage } from 'lib/object-storage';

describe('ObjectStorage', () => {
  let objectStorage: ObjectStorage;

  beforeEach(() => {
    objectStorage = new ObjectStorage();
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

      const result = await objectStorage.getFileInfo(fileName);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');
    });
  });
});
