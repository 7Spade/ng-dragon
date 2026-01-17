/**
 * Snackbar Service
 *
 * 封裝 MatSnackBar,提供簡潔的通知 API
 * 支援 success, error, warning, info 通知類型
 *
 * @example
 * ```typescript
 * // Success message
 * this.snackbarService.success('操作成功');
 *
 * // Error message
 * this.snackbarService.error('操作失敗');
 *
 * // Warning message
 * this.snackbarService.warning('請注意');
 *
 * // Info message
 * this.snackbarService.info('提示訊息');
 *
 * // Custom snackbar
 * this.snackbarService.show('自訂訊息', '關閉', {
 *   duration: 5000,
 *   horizontalPosition: 'center',
 *   verticalPosition: 'top'
 * });
 * ```
 */

import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarConfig extends MatSnackBarConfig {
  type?: SnackbarType;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  /**
   * 預設配置
   */
  private readonly defaultConfig: SnackbarConfig = {
    duration: 3000,
    horizontalPosition: 'end' as MatSnackBarHorizontalPosition,
    verticalPosition: 'top' as MatSnackBarVerticalPosition,
  };

  /**
   * 顯示成功訊息
   *
   * @param message - 訊息內容
   * @param action - 動作按鈕文字
   * @param config - 配置選項
   * @returns MatSnackBarRef<TextOnlySnackBar>
   */
  success(
    message: string,
    action: string = '關閉',
    config?: SnackbarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, action, {
      ...config,
      type: 'success',
      panelClass: ['snackbar-success', ...(config?.panelClass || [])],
    });
  }

  /**
   * 顯示錯誤訊息
   *
   * @param message - 訊息內容
   * @param action - 動作按鈕文字
   * @param config - 配置選項
   * @returns MatSnackBarRef<TextOnlySnackBar>
   */
  error(
    message: string,
    action: string = '關閉',
    config?: SnackbarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, action, {
      ...config,
      type: 'error',
      duration: config?.duration || 5000, // 錯誤訊息顯示較久
      panelClass: ['snackbar-error', ...(config?.panelClass || [])],
    });
  }

  /**
   * 顯示警告訊息
   *
   * @param message - 訊息內容
   * @param action - 動作按鈕文字
   * @param config - 配置選項
   * @returns MatSnackBarRef<TextOnlySnackBar>
   */
  warning(
    message: string,
    action: string = '關閉',
    config?: SnackbarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, action, {
      ...config,
      type: 'warning',
      panelClass: ['snackbar-warning', ...(config?.panelClass || [])],
    });
  }

  /**
   * 顯示資訊訊息
   *
   * @param message - 訊息內容
   * @param action - 動作按鈕文字
   * @param config - 配置選項
   * @returns MatSnackBarRef<TextOnlySnackBar>
   */
  info(
    message: string,
    action: string = '關閉',
    config?: SnackbarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, action, {
      ...config,
      type: 'info',
      panelClass: ['snackbar-info', ...(config?.panelClass || [])],
    });
  }

  /**
   * 顯示自訂 Snackbar
   *
   * @param message - 訊息內容
   * @param action - 動作按鈕文字
   * @param config - 配置選項
   * @returns MatSnackBarRef<TextOnlySnackBar>
   */
  show(
    message: string,
    action: string = '關閉',
    config?: SnackbarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    const mergedConfig = {
      ...this.defaultConfig,
      ...config,
    };

    return this.snackBar.open(message, action, mergedConfig);
  }

  /**
   * 關閉當前 Snackbar
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
