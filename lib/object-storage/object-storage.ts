import { Bucket, File, Storage } from '@google-cloud/storage';

import { InternalServerError } from 'errors/apps-sdk-error';
import {
  DeleteFileResponse,
  DownloadFileResponse,
  FileInfo,
  GetFileInfoResponse,
  ListFilesOptions,
  ListFilesResponse,
  UploadFileOptions,
  UploadFileResponse
} from 'types/object-storage';
import { Logger } from 'utils/logger';

const logger = new Logger('ObjectStorage', { mondayInternal: true });

export class ObjectStorage {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    if (!process.env.OBJECT_STORAGE_BUCKET) {
      throw new InternalServerError('OBJECT_STORAGE_BUCKET is not set');
    }

    this.storage = new Storage();
    this.bucketName = process.env.OBJECT_STORAGE_BUCKET;
    logger.info(`ObjectStorage initialized with bucket: ${this.bucketName}`);
  }

  private getBucket(): Bucket {
    return this.storage.bucket(this.bucketName);
  }

  private handleError(error: unknown, operation: string): { errorMessage: string; errorObj: Error } {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to ${operation}:`, { error: errorObj });
    return { errorMessage, errorObj };
  }

  async uploadFile(fileName: string, content: Buffer | string, options: UploadFileOptions = {}): Promise<UploadFileResponse> {
    try {
      const bucket = this.getBucket();
      const file: File = bucket.file(fileName);

      const uploadOptions = {
        metadata: {
          contentType: options.contentType || 'application/octet-stream',
          metadata: options.metadata || {}
        }
      };

      await file.save(content, uploadOptions);

      const fileUrl = `gs://${this.bucketName}/${fileName}`;

      logger.info(`File uploaded successfully: ${fileName}`);
      
      return {
        success: true,
        fileName,
        fileUrl
      };
    } catch (error) {
      const { errorMessage } = this.handleError(error, 'upload file');
      return {
        success: false,
        error: `Failed to upload file: ${errorMessage}`
      };
    }
  }

  async downloadFile(fileName: string): Promise<DownloadFileResponse> {
    try {
      const bucket = this.getBucket();
      const file: File = bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      const [content] = await file.download();
      const [metadata] = await file.getMetadata();

      return {
        success: true,
        content,
        contentType: metadata.contentType || 'application/octet-stream'
      };
    } catch (error) {
      const { errorMessage } = this.handleError(error, 'download file');
      return {
        success: false,
        error: `Failed to download file: ${errorMessage}`
      };
    }
  }

  async deleteFile(fileName: string): Promise<DeleteFileResponse> {
    try {
      const bucket = this.getBucket();
      const file: File = bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      await file.delete();
      
      logger.info(`File deleted successfully: ${fileName}`);
      
      return { success: true };
    } catch (error) {
      const { errorMessage } = this.handleError(error, 'delete file');
      return {
        success: false,
        error: `Failed to delete file: ${errorMessage}`
      };
    }
  }

  async listFiles(options: ListFilesOptions = {}): Promise<ListFilesResponse> {
    try {
      const bucket = this.getBucket();
      
      const queryOptions = {
        maxResults: options.maxResults || 100,
        ...(options.prefix && { prefix: options.prefix }),
        ...(options.pageToken && { pageToken: options.pageToken })
      };

      const [files, , apiResponse] = await bucket.getFiles(queryOptions);
      
      const fileInfos: Array<FileInfo> = files.map((file: File) => ({
        name: file.name,
        size: parseInt(String(file.metadata.size || '0'), 10) || 0,
        contentType: file.metadata.contentType || 'application/octet-stream',
        lastModified: new Date(file.metadata.updated || Date.now()),
        etag: file.metadata.etag || '',
        metadata: Object.fromEntries(
          Object.entries(file.metadata.metadata || {}).map(([key, value]) => [
            key,
            String(value || '')
          ])
        )
      }));

      return {
        success: true,
        files: fileInfos,
        nextPageToken: (apiResponse as { nextPageToken?: string })?.nextPageToken
      };
    } catch (error) {
      const { errorMessage } = this.handleError(error, 'list files');
      return {
        success: false,
        error: `Failed to list files: ${errorMessage}`
      };
    }
  }

  async getFileInfo(fileName: string): Promise<GetFileInfoResponse> {
    try {
      const bucket = this.getBucket();
      const file: File = bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      const [metadata] = await file.getMetadata();
      
      const fileInfo: FileInfo = {
        name: file.name,
        size: parseInt(String(metadata.size || '0'), 10) || 0,
        contentType: metadata.contentType || 'application/octet-stream',
        lastModified: new Date(metadata.updated || Date.now()),
        etag: metadata.etag || '',
        metadata: Object.fromEntries(
          Object.entries(metadata.metadata || {}).map(([key, value]) => [
            key,
            String(value || '')
          ])
        )
      };

      return {
        success: true,
        fileInfo
      };
    } catch (error) {
      const { errorMessage } = this.handleError(error, 'get file info');
      return {
        success: false,
        error: `Failed to get file info: ${errorMessage}`
      };
    }
  }
}
