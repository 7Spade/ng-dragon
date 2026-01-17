/**
 * File 相關常數
 * 
 * 定義應用程式中使用的檔案相關常數
 * 
 * @module SharedConstants
 */

/**
 * 檔案大小限制 (位元組)
 */
export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  avatar: 2 * 1024 * 1024, // 2MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  general: 50 * 1024 * 1024, // 50MB
} as const;

/**
 * 允許的圖片格式
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

/**
 * 允許的文件格式
 */
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
] as const;

/**
 * 允許的影片格式
 */
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
] as const;

/**
 * 檔案副檔名映射
 */
export const FILE_EXTENSIONS = {
  // 圖片
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  
  // 文件
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  
  // 影片
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogg'],
} as const;

/**
 * 檔案圖示映射 (Material Icons)
 */
export const FILE_TYPE_ICONS = {
  // 圖片
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  
  // 文件
  'application/pdf': 'picture_as_pdf',
  'application/msword': 'description',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'description',
  'application/vnd.ms-excel': 'table_chart',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'table_chart',
  'text/plain': 'description',
  'text/csv': 'table_chart',
  
  // 影片
  'video/mp4': 'videocam',
  'video/webm': 'videocam',
  'video/ogg': 'videocam',
  
  // 預設
  'default': 'insert_drive_file',
} as const;

/**
 * 檔案大小單位
 */
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * 檔案上傳狀態
 */
export const FILE_UPLOAD_STATUS = {
  pending: 'pending',
  uploading: 'uploading',
  success: 'success',
  error: 'error',
  cancelled: 'cancelled',
} as const;
