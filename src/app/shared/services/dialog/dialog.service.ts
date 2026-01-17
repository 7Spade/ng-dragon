/**
 * Dialog Service
 *
 * 封裝 MatDialog,提供更簡潔的 API
 * 支援 confirm, alert, 自訂對話框
 *
 * @example
 * ```typescript
 * // Confirm dialog
 * const result = await firstValueFrom(
 *   this.dialogService.confirm({
 *     title: '確認刪除',
 *     message: '確定要刪除此項目嗎?',
 *   })
 * );
 *
 * // Alert dialog
 * await firstValueFrom(
 *   this.dialogService.alert({
 *     title: '成功',
 *     message: '操作已完成',
 *   })
 * );
 *
 * // Custom dialog
 * const result = await firstValueFrom(
 *   this.dialogService.open(MyDialogComponent, {
 *     width: '600px',
 *     data: { id: 123 }
 *   })
 * );
 * ```
 */

import { inject, Injectable, ComponentType } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

export interface AlertDialogConfig {
  title: string;
  message: string;
  okText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  /**
   * 打開確認對話框
   *
   * @param config - 對話框配置
   * @returns Observable<boolean> - 使用者是否確認
   */
  confirm(config: ConfirmDialogConfig): Observable<boolean> {
    // TODO: 實作 ConfirmDialogComponent 後取消註解
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: config.title,
    //     message: config.message,
    //     confirmText: config.confirmText || '確認',
    //     cancelText: config.cancelText || '取消',
    //     confirmColor: config.confirmColor || 'primary',
    //   },
    // });
    //
    // return dialogRef.afterClosed().pipe(
    //   map(result => result === true)
    // );

    // Placeholder implementation
    return new Observable<boolean>(observer => {
      const result = window.confirm(`${config.title}\n\n${config.message}`);
      observer.next(result);
      observer.complete();
    });
  }

  /**
   * 打開警告對話框
   *
   * @param config - 對話框配置
   * @returns Observable<void>
   */
  alert(config: AlertDialogConfig): Observable<void> {
    // TODO: 實作 AlertDialogComponent 後取消註解
    // const dialogRef = this.dialog.open(AlertDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: config.title,
    //     message: config.message,
    //     okText: config.okText || '確定',
    //   },
    // });
    //
    // return dialogRef.afterClosed().pipe(
    //   map(() => undefined)
    // );

    // Placeholder implementation
    return new Observable<void>(observer => {
      window.alert(`${config.title}\n\n${config.message}`);
      observer.next();
      observer.complete();
    });
  }

  /**
   * 打開自定義對話框
   *
   * @param component - 對話框組件
   * @param config - MatDialog 配置
   * @returns Observable<R | undefined> - 對話框結果
   */
  open<T, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<any>
  ): Observable<R | undefined> {
    const dialogRef = this.dialog.open<T, any, R>(component, config);
    return dialogRef.afterClosed();
  }

  /**
   * 關閉所有對話框
   */
  closeAll(): void {
    this.dialog.closeAll();
  }

  /**
   * 取得已打開的對話框
   *
   * @returns MatDialogRef[] - 對話框參考陣列
   */
  getOpenDialogs(): MatDialogRef<any>[] {
    return this.dialog.openDialogs;
  }
}
