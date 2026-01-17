/**
 * Clipboard Service
 *
 * 封裝 CDK Clipboard,提供剪貼簿操作 API
 *
 * @example
 * ```typescript
 * // Copy text
 * const success = this.clipboardService.copy('Hello World');
 *
 * // Async copy with callback
 * await this.clipboardService.copyAsync('Hello World');
 * ```
 */

import { inject, Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private readonly clipboard = inject(Clipboard);

  /**
   * 複製文字到剪貼簿 (同步)
   *
   * @param text - 要複製的文字
   * @returns boolean - 是否成功
   */
  copy(text: string): boolean {
    return this.clipboard.copy(text);
  }

  /**
   * 複製文字到剪貼簿 (異步,支援回調)
   *
   * @param text - 要複製的文字
   * @returns Promise<boolean> - 是否成功
   */
  async copyAsync(text: string): Promise<boolean> {
    try {
      const success = this.clipboard.copy(text);
      return success;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  /**
   * 使用 Clipboard API 複製文字 (瀏覽器原生)
   *
   * @param text - 要複製的文字
   * @returns Promise<boolean> - 是否成功
   */
  async copyToClipboard(text: string): Promise<boolean> {
    if (!navigator.clipboard) {
      // Fallback to CDK clipboard
      return this.copyAsync(text);
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  /**
   * 從剪貼簿讀取文字
   *
   * @returns Promise<string> - 剪貼簿內容
   */
  async readText(): Promise<string> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported');
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      throw error;
    }
  }

  /**
   * 檢查剪貼簿 API 是否可用
   *
   * @returns boolean - 是否支援
   */
  isSupported(): boolean {
    return !!navigator.clipboard;
  }
}
