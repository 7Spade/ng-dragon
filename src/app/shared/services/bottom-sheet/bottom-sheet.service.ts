/**
 * Bottom Sheet Service
 *
 * 封裝 MatBottomSheet,提供底部彈出層 API
 *
 * @example
 * ```typescript
 * // Open bottom sheet
 * const result = await firstValueFrom(
 *   this.bottomSheetService.open(MyBottomSheetComponent, {
 *     data: { id: 123 }
 *   })
 * );
 * ```
 */

import { inject, Injectable, ComponentType } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private readonly bottomSheet = inject(MatBottomSheet);

  /**
   * 打開底部彈出層
   *
   * @param component - 組件
   * @param config - 配置選項
   * @returns Observable<R | undefined> - 結果
   */
  open<T, R = any>(
    component: ComponentType<T>,
    config?: MatBottomSheetConfig
  ): Observable<R | undefined> {
    const sheetRef = this.bottomSheet.open<T, any, R>(component, config);
    return sheetRef.afterDismissed();
  }

  /**
   * 關閉當前底部彈出層
   */
  dismiss(): void {
    this.bottomSheet.dismiss();
  }

  /**
   * 取得當前打開的底部彈出層
   *
   * @returns MatBottomSheetRef | undefined
   */
  getOpenSheet(): MatBottomSheetRef | undefined {
    return this.bottomSheet._openedBottomSheetRef || undefined;
  }
}
