export type UploadFileOptions = {
  contentType?: string;
  metadata?: Record<string, string>;
}

export type UploadFileResponse = {
  success: boolean;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

export type DownloadFileResponse = {
  success: boolean;
  content?: Buffer;
  contentType?: string;
  error?: string;
}

export type DeleteFileResponse = {
  success: boolean;
  error?: string;
}

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

export type ListFilesResponse = {
  success: boolean;
  files?: Array<FileInfo>;
  nextPageToken?: string;
  error?: string;
}

export type GetFileInfoResponse = {
  success: boolean;
  fileInfo?: FileInfo;
  error?: string;
}
