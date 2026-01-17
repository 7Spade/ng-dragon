/**
 * File Utility Functions
 */

import { FileType, MimeType } from '../../enums';
import { FILE_SIZE_LIMITS } from '../../constants';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

export function getFileName(path: string): string {
  return path.split('/').pop() || path;
}

export function getMimeType(extension: string): string {
  const mimeMap: Record<string, string> = {
    'jpg': MimeType.JPEG,
    'jpeg': MimeType.JPEG,
    'png': MimeType.PNG,
    'gif': MimeType.GIF,
    'pdf': MimeType.PDF,
    'doc': MimeType.DOC,
    'docx': MimeType.DOCX,
    'xls': MimeType.XLS,
    'xlsx': MimeType.XLSX,
    'txt': MimeType.TXT,
    'zip': MimeType.ZIP
  };
  return mimeMap[extension.toLowerCase()] || 'application/octet-stream';
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isDocument(mimeType: string): boolean {
  const docTypes = [MimeType.PDF, MimeType.DOC, MimeType.DOCX, MimeType.XLS, MimeType.XLSX];
  return docTypes.includes(mimeType as MimeType);
}

export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export function isAudio(mimeType: string): boolean {
  return mimeType.startsWith('audio/');
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSize: number = FILE_SIZE_LIMITS.general): boolean {
  return file.size <= maxSize;
}
