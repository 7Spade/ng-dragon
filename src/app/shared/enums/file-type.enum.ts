/**
 * File Type 列舉
 * 
 * 定義檔案類型分類
 * 
 * @module SharedEnums
 */

/**
 * 檔案類型
 */
export enum FileType {
  Image = 'image',
  Document = 'document',
  Video = 'video',
  Audio = 'audio',
  Archive = 'archive',
  Code = 'code',
  Other = 'other',
}

/**
 * 檔案類型顯示名稱
 */
export const FILE_TYPE_LABELS: Record<FileType, string> = {
  [FileType.Image]: '圖片',
  [FileType.Document]: '文件',
  [FileType.Video]: '影片',
  [FileType.Audio]: '音訊',
  [FileType.Archive]: '壓縮檔',
  [FileType.Code]: '程式碼',
  [FileType.Other]: '其他',
};

/**
 * 檔案類型圖示
 */
export const FILE_TYPE_ICONS_MAP: Record<FileType, string> = {
  [FileType.Image]: 'image',
  [FileType.Document]: 'description',
  [FileType.Video]: 'videocam',
  [FileType.Audio]: 'audiotrack',
  [FileType.Archive]: 'archive',
  [FileType.Code]: 'code',
  [FileType.Other]: 'insert_drive_file',
};
