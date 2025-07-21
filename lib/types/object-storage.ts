export type BaseResponse = {
  success: boolean;
  error?: string;
}

export type UploadFileOptions = {
  contentType?: string;
  metadata?: Record<string, string>;
}

export type UploadFileResponse = BaseResponse & {
  fileName?: string;
  fileUrl?: string;
}

export type DownloadFileResponse = BaseResponse & {
  content?: Buffer;
  contentType?: string;
}

export type DeleteFileResponse = BaseResponse;

export type ListFilesOptions = {
  prefix?: string;
  maxResults?: number;
  pageToken?: string;
}

export type FileInfo = {
  name: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
  metadata: Record<string, string>;
}

export type ListFilesResponse = BaseResponse & {
  files?: Array<FileInfo>;
  nextPageToken?: string;
}

export type GetFileInfoResponse = BaseResponse & {
  fileInfo?: FileInfo;
}
