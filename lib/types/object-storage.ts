export interface UploadFileOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  public?: boolean;
}

export interface UploadFileResponse {
  success: boolean;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

export interface DownloadFileResponse {
  success: boolean;
  content?: Buffer;
  contentType?: string;
  error?: string;
}

export interface DeleteFileResponse {
  success: boolean;
  error?: string;
}

export interface ListFilesOptions {
  prefix?: string;
  maxResults?: number;
  pageToken?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
  metadata?: Record<string, string>;
}

export interface ListFilesResponse {
  success: boolean;
  files?: FileInfo[];
  nextPageToken?: string;
  error?: string;
}

export interface GetFileInfoResponse {
  success: boolean;
  fileInfo?: FileInfo;
  error?: string;
}