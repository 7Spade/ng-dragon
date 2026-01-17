/**
 * Media Query Service
 *
 * 提供 Media Query 監聽與查詢
 * 整合 CDK BreakpointObserver 與原生 MediaQuery API
 *
 * @example
 * ```typescript
 * // Subscribe to media query changes
 * this.mediaQueryService.observe('(max-width: 768px)').subscribe(matches => {
 *   console.log('Mobile view:', matches);
 * });
 *
 * // Check current state
 * const isMobile = this.mediaQueryService.matches('(max-width: 768px)');
 *
 * // Use predefined breakpoints
 * this.mediaQueryService.isHandset().subscribe(isHandset => {
 *   console.log('Is handset:', isHandset);
 * });
 * ```
 */

import { inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * 監聽 Media Query 變化
   *
   * @param query - Media Query 字串
   * @returns Observable<boolean> - 是否匹配
   */
  observe(query: string | string[]): Observable<boolean> {
    return this.breakpointObserver
      .observe(query)
      .pipe(map((result) => result.matches));
  }

  /**
   * 檢查 Media Query 是否匹配
   *
   * @param query - Media Query 字串
   * @returns boolean - 是否匹配
   */
  matches(query: string): boolean {
    return this.breakpointObserver.isMatched(query);
  }

  /**
   * 監聽 Handset (手機) 斷點
   *
   * @returns Observable<boolean>
   */
  isHandset(): Observable<boolean> {
    return this.observe(Breakpoints.Handset);
  }

  /**
   * 監聽 Tablet (平板) 斷點
   *
   * @returns Observable<boolean>
   */
  isTablet(): Observable<boolean> {
    return this.observe(Breakpoints.Tablet);
  }

  /**
   * 監聽 Web (桌面) 斷點
   *
   * @returns Observable<boolean>
   */
  isWeb(): Observable<boolean> {
    return this.observe(Breakpoints.Web);
  }

  /**
   * 監聽 HandsetPortrait (直式手機) 斷點
   *
   * @returns Observable<boolean>
   */
  isHandsetPortrait(): Observable<boolean> {
    return this.observe(Breakpoints.HandsetPortrait);
  }

  /**
   * 監聽 HandsetLandscape (橫式手機) 斷點
   *
   * @returns Observable<boolean>
   */
  isHandsetLandscape(): Observable<boolean> {
    return this.observe(Breakpoints.HandsetLandscape);
  }

  /**
   * 監聽 TabletPortrait (直式平板) 斷點
   *
   * @returns Observable<boolean>
   */
  isTabletPortrait(): Observable<boolean> {
    return this.observe(Breakpoints.TabletPortrait);
  }

  /**
   * 監聽 TabletLandscape (橫式平板) 斷點
   *
   * @returns Observable<boolean>
   */
  isTabletLandscape(): Observable<boolean> {
    return this.observe(Breakpoints.TabletLandscape);
  }

  /**
   * 監聽 WebPortrait (直式桌面) 斷點
   *
   * @returns Observable<boolean>
   */
  isWebPortrait(): Observable<boolean> {
    return this.observe(Breakpoints.WebPortrait);
  }

  /**
   * 監聽 WebLandscape (橫式桌面) 斷點
   *
   * @returns Observable<boolean>
   */
  isWebLandscape(): Observable<boolean> {
    return this.observe(Breakpoints.WebLandscape);
  }

  /**
   * 監聽自訂寬度斷點
   *
   * @param minWidth - 最小寬度
   * @param maxWidth - 最大寬度 (選填)
   * @returns Observable<boolean>
   */
  observeWidth(minWidth: number, maxWidth?: number): Observable<boolean> {
    const query = maxWidth
      ? `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`
      : `(min-width: ${minWidth}px)`;
    return this.observe(query);
  }

  /**
   * 檢查是否為手機
   *
   * @returns boolean
   */
  isHandsetMatched(): boolean {
    return this.matches(Breakpoints.Handset);
  }

  /**
   * 檢查是否為平板
   *
   * @returns boolean
   */
  isTabletMatched(): boolean {
    return this.matches(Breakpoints.Tablet);
  }

  /**
   * 檢查是否為桌面
   *
   * @returns boolean
   */
  isWebMatched(): boolean {
    return this.matches(Breakpoints.Web);
  }

  /**
   * 取得當前裝置類型
   *
   * @returns 'handset' | 'tablet' | 'web'
   */
  getDeviceType(): 'handset' | 'tablet' | 'web' {
    if (this.isHandsetMatched()) {
      return 'handset';
    } else if (this.isTabletMatched()) {
      return 'tablet';
    } else {
      return 'web';
    }
  }
}
