/**
 * File Service
 *
 * 提供檔案處理相關操作
 * 支援檔案上傳、驗證、讀取、轉換
 *
 * @example
 * ```typescript
 * // Validate file
 * const isValid = await this.fileService.validateFile(file, {
 *   maxSize: 5 * 1024 * 1024,
 *   allowedTypes: ['image/png', 'image/jpeg']
 * });
 *
 * // Read file as data URL
 * const dataUrl = await this.fileService.readAsDataURL(file);
 *
 * // Read file as text
 * const text = await this.fileService.readAsText(file);
 * ```
 */

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface FileValidationOptions {
  maxSize?: number; // bytes
  minSize?: number; // bytes
  allowedTypes?: string[]; // MIME types
  allowedExtensions?: string[]; // file extensions
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /**
   * 驗證檔案
   *
   * @param file - 檔案
   * @param options - 驗證選項
   * @returns Promise<FileValidationResult>
   */
  async validateFile(
    file: File,
    options: FileValidationOptions = {}
  ): Promise<FileValidationResult> {
    const errors: string[] = [];

    // Size validation
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`檔案大小超過限制 (最大 ${this.formatBytes(options.maxSize)})`);
    }

    if (options.minSize && file.size < options.minSize) {
      errors.push(`檔案大小不足 (最小 ${this.formatBytes(options.minSize)})`);
    }

    // Type validation
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`不支援的檔案類型: ${file.type}`);
    }

    // Extension validation
    if (options.allowedExtensions) {
      const extension = this.getFileExtension(file.name);
      if (!options.allowedExtensions.includes(extension)) {
        errors.push(`不支援的檔案副檔名: ${extension}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 讀取檔案為 Data URL
   *
   * @param file - 檔案
   * @returns Promise<string>
   */
  readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * 讀取檔案為文字
   *
   * @param file - 檔案
   * @param encoding - 編碼
   * @returns Promise<string>
   */
  readAsText(file: File, encoding: string = 'UTF-8'): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file, encoding);
    });
  }

  /**
   * 讀取檔案為 ArrayBuffer
   *
   * @param file - 檔案
   * @returns Promise<ArrayBuffer>
   */
  readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 讀取檔案為 Base64
   *
   * @param file - 檔案
   * @returns Promise<string>
   */
  async readAsBase64(file: File): Promise<string> {
    const dataUrl = await this.readAsDataURL(file);
    // Remove data URL prefix
    return dataUrl.split(',')[1];
  }

  /**
   * 取得檔案副檔名
   *
   * @param filename - 檔案名稱
   * @returns string
   */
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * 取得檔案名稱 (不含副檔名)
   *
   * @param filename - 檔案名稱
   * @returns string
   */
  getFileName(filename: string): string {
    const parts = filename.split('.');
    if (parts.length > 1) {
      return parts.slice(0, -1).join('.');
    }
    return filename;
  }

  /**
   * 格式化檔案大小
   *
   * @param bytes - 位元組數
   * @param decimals - 小數位數
   * @returns string
   */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }

  /**
   * 檢查是否為圖片
   *
   * @param file - 檔案
   * @returns boolean
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * 檢查是否為影片
   *
   * @param file - 檔案
   * @returns boolean
   */
  isVideo(file: File): boolean {
    return file.type.startsWith('video/');
  }

  /**
   * 檢查是否為音訊
   *
   * @param file - 檔案
   * @returns boolean
   */
  isAudio(file: File): boolean {
    return file.type.startsWith('audio/');
  }

  /**
   * 檢查是否為 PDF
   *
   * @param file - 檔案
   * @returns boolean
   */
  isPDF(file: File): boolean {
    return file.type === 'application/pdf';
  }

  /**
   * 建立檔案下載連結
   *
   * @param blob - Blob 資料
   * @param filename - 檔案名稱
   * @returns string - Data URL
   */
  createDownloadLink(blob: Blob, filename: string): string {
    return URL.createObjectURL(blob);
  }

  /**
   * 釋放下載連結
   *
   * @param url - Data URL
   */
  revokeDownloadLink(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * 壓縮圖片
   *
   * @param file - 圖片檔案
   * @param maxWidth - 最大寬度
   * @param maxHeight - 最大高度
   * @param quality - 品質 (0-1)
   * @returns Promise<Blob>
   */
  async compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.9
  ): Promise<Blob> {
    if (!this.isImage(file)) {
      throw new Error('File is not an image');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality
          );
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * 將 Blob 轉為 File
   *
   * @param blob - Blob 資料
   * @param filename - 檔案名稱
   * @param type - MIME type
   * @returns File
   */
  blobToFile(blob: Blob, filename: string, type?: string): File {
    return new File([blob], filename, { type: type || blob.type });
  }
}
