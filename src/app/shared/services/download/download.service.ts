/**
 * Download Service
 *
 * 提供檔案下載功能
 * 支援 Blob, URL, Base64 下載
 *
 * @example
 * ```typescript
 * // Download blob
 * this.downloadService.downloadBlob(blob, 'report.pdf');
 *
 * // Download URL
 * this.downloadService.downloadURL('https://example.com/file.pdf', 'file.pdf');
 *
 * // Download text as file
 * this.downloadService.downloadText('Hello World', 'hello.txt', 'text/plain');
 * ```
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private readonly http = inject(HttpClient);

  /**
   * 下載 Blob
   *
   * @param blob - Blob 資料
   * @param filename - 檔案名稱
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    this.downloadURL(url, filename);
    URL.revokeObjectURL(url);
  }

  /**
   * 下載 URL
   *
   * @param url - 檔案 URL
   * @param filename - 檔案名稱
   */
  downloadURL(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 下載文字為檔案
   *
   * @param text - 文字內容
   * @param filename - 檔案名稱
   * @param type - MIME type
   */
  downloadText(text: string, filename: string, type: string = 'text/plain'): void {
    const blob = new Blob([text], { type });
    this.downloadBlob(blob, filename);
  }

  /**
   * 下載 JSON 為檔案
   *
   * @param data - JSON 資料
   * @param filename - 檔案名稱
   */
  downloadJSON(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadText(json, filename, 'application/json');
  }

  /**
   * 下載 Base64 為檔案
   *
   * @param base64 - Base64 字串
   * @param filename - 檔案名稱
   * @param type - MIME type
   */
  downloadBase64(base64: string, filename: string, type: string): void {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type });

    this.downloadBlob(blob, filename);
  }

  /**
   * 下載遠端檔案
   *
   * @param url - 檔案 URL
   * @param filename - 檔案名稱
   * @returns Promise<void>
   */
  async downloadRemoteFile(url: string, filename: string): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.http.get(url, { responseType: 'blob' })
      );
      this.downloadBlob(blob, filename);
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  /**
   * 下載 Canvas 為圖片
   *
   * @param canvas - Canvas 元素
   * @param filename - 檔案名稱
   * @param type - 圖片類型
   * @param quality - 品質 (0-1)
   */
  downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string,
    type: string = 'image/png',
    quality: number = 1.0
  ): void {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          this.downloadBlob(blob, filename);
        }
      },
      type,
      quality
    );
  }

  /**
   * 下載 SVG 為圖片
   *
   * @param svg - SVG 元素
   * @param filename - 檔案名稱
   * @param width - 寬度
   * @param height - 高度
   */
  async downloadSVG(
    svg: SVGElement,
    filename: string,
    width?: number,
    height?: number
  ): Promise<void> {
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    if (!width || !height) {
      // Download as SVG
      this.downloadBlob(svgBlob, filename);
      URL.revokeObjectURL(url);
      return;
    }

    // Convert to PNG
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            this.downloadBlob(blob, filename);
          }
          URL.revokeObjectURL(url);
        });
      }
    };

    img.src = url;
  }

  /**
   * 批量下載檔案為 ZIP
   * 注意：需要額外的 ZIP 函式庫 (如 JSZip)
   *
   * @param files - 檔案陣列 { name: string, content: Blob | string }[]
   * @param zipFilename - ZIP 檔案名稱
   */
  async downloadAsZip(
    files: Array<{ name: string; content: Blob | string }>,
    zipFilename: string
  ): Promise<void> {
    // TODO: 實作需要 JSZip 函式庫
    // import JSZip from 'jszip';
    //
    // const zip = new JSZip();
    //
    // files.forEach(file => {
    //   zip.file(file.name, file.content);
    // });
    //
    // const blob = await zip.generateAsync({ type: 'blob' });
    // this.downloadBlob(blob, zipFilename);

    console.warn('downloadAsZip requires JSZip library');
    throw new Error('Not implemented: requires JSZip library');
  }
}
