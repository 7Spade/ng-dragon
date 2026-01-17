/**
 * MIME Type 列舉
 * 
 * 定義常用的 MIME 類型
 * 
 * @module SharedEnums
 */

/**
 * MIME 類型
 */
export enum MimeType {
  // 圖片
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',
  SVG = 'image/svg+xml',
  
  // 文件
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT = 'text/plain',
  CSV = 'text/csv',
  
  // 影片
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  OGG = 'video/ogg',
  
  // 音訊
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  
  // 壓縮檔
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
  
  // 程式碼
  JSON = 'application/json',
  XML = 'application/xml',
  HTML = 'text/html',
  CSS = 'text/css',
  JAVASCRIPT = 'application/javascript',
  TYPESCRIPT = 'application/typescript',
}

/**
 * MIME 類型分類映射
 */
export const MIME_TYPE_CATEGORIES: Record<string, string> = {
  // 圖片
  [MimeType.JPEG]: 'image',
  [MimeType.PNG]: 'image',
  [MimeType.GIF]: 'image',
  [MimeType.WEBP]: 'image',
  [MimeType.SVG]: 'image',
  
  // 文件
  [MimeType.PDF]: 'document',
  [MimeType.DOC]: 'document',
  [MimeType.DOCX]: 'document',
  [MimeType.XLS]: 'document',
  [MimeType.XLSX]: 'document',
  [MimeType.TXT]: 'document',
  [MimeType.CSV]: 'document',
  
  // 影片
  [MimeType.MP4]: 'video',
  [MimeType.WEBM]: 'video',
  [MimeType.OGG]: 'video',
  
  // 音訊
  [MimeType.MP3]: 'audio',
  [MimeType.WAV]: 'audio',
  
  // 壓縮檔
  [MimeType.ZIP]: 'archive',
  [MimeType.RAR]: 'archive',
  
  // 程式碼
  [MimeType.JSON]: 'code',
  [MimeType.XML]: 'code',
  [MimeType.HTML]: 'code',
  [MimeType.CSS]: 'code',
  [MimeType.JAVASCRIPT]: 'code',
  [MimeType.TYPESCRIPT]: 'code',
};
