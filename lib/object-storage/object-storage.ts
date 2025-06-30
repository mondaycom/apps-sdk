import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';

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

    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    this.storage = new Storage({ auth });
    
    this.bucketName = process.env.OBJECT_STORAGE_BUCKET;
    logger.info(`ObjectStorage initialized with bucket: ${this.bucketName}`);
  }

  /**
   * Upload a file to the object storage bucket
   */
  async uploadFile(fileName: string, content: Buffer | string, options: UploadFileOptions = {}): Promise<UploadFileResponse> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);

      const uploadOptions: any = {
        metadata: {
          contentType: options.contentType || 'application/octet-stream',
          metadata: options.metadata || {}
        }
      };

      if (options.public) {
        uploadOptions.predefinedAcl = 'publicRead';
      }

      await file.save(content, uploadOptions);

      const fileUrl = options.public 
        ? `https://storage.googleapis.com/${this.bucketName}/${fileName}`
        : `gs://${this.bucketName}/${fileName}`;

      logger.info(`File uploaded successfully: ${fileName}`);
      
      return {
        success: true,
        fileName,
        fileUrl
      };
    } catch (error: any) {
      logger.error('Failed to upload file:', error);
      return {
        success: false,
        error: `Failed to upload file: ${error.message}`
      };
    }
  }

  /**
   * Download a file from the object storage bucket
   */
  async downloadFile(fileName: string): Promise<DownloadFileResponse> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
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
        contentType: metadata.contentType
      };
    } catch (error: any) {
      logger.error('Failed to download file:', error);
      return {
        success: false,
        error: `Failed to download file: ${error.message}`
      };
    }
  }

  /**
   * Delete a file from the object storage bucket
   */
  async deleteFile(fileName: string): Promise<DeleteFileResponse> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      await file.delete();
      
      logger.info(`File deleted successfully: ${fileName}`);
      
      return {
        success: true
      };
    } catch (error: any) {
      logger.error('Failed to delete file:', error);
      return {
        success: false,
        error: `Failed to delete file: ${error.message}`
      };
    }
  }

  /**
   * List files in the object storage bucket
   */
  async listFiles(options: ListFilesOptions = {}): Promise<ListFilesResponse> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      
      const queryOptions: any = {
        maxResults: options.maxResults || 100
      };
      
      if (options.prefix) {
        queryOptions.prefix = options.prefix;
      }
      
      if (options.pageToken) {
        queryOptions.pageToken = options.pageToken;
      }

      const [files, , metadata] = await bucket.getFiles(queryOptions);
      
      const fileInfos: FileInfo[] = files.map(file => ({
        name: file.name,
        size: parseInt(file.metadata.size) || 0,
        contentType: file.metadata.contentType || 'application/octet-stream',
        lastModified: new Date(file.metadata.updated),
        etag: file.metadata.etag,
        metadata: file.metadata.metadata || {}
      }));

      return {
        success: true,
        files: fileInfos,
        nextPageToken: metadata?.nextPageToken
      };
    } catch (error: any) {
      logger.error('Failed to list files:', error);
      return {
        success: false,
        error: `Failed to list files: ${error.message}`
      };
    }
  }

  /**
   * Get information about a specific file
   */
  async getFileInfo(fileName: string): Promise<GetFileInfoResponse> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
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
        size: parseInt(metadata.size) || 0,
        contentType: metadata.contentType || 'application/octet-stream',
        lastModified: new Date(metadata.updated),
        etag: metadata.etag,
        metadata: metadata.metadata || {}
      };

      return {
        success: true,
        fileInfo
      };
    } catch (error: any) {
      logger.error('Failed to get file info:', error);
      return {
        success: false,
        error: `Failed to get file info: ${error.message}`
      };
    }
  }
  }