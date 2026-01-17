/**
 * Breakpoint Service
 *
 * 封裝 CDK BreakpointObserver,提供響應式斷點檢測
 * 支援 Material Design 標準斷點
 *
 * @example
 * ```typescript
 * // Check if handset
 * this.breakpointService.isHandset$.subscribe(isHandset => {
 *   console.log('Is handset:', isHandset);
 * });
 *
 * // Check specific breakpoint
 * this.breakpointService.observe('(max-width: 600px)').subscribe(matches => {
 *   console.log('Matches:', matches);
 * });
 *
 * // Get current breakpoint
 * const current = this.breakpointService.getCurrentBreakpoint();
 * ```
 */

import { Injectable, signal, computed } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export type Breakpoint =
  | 'XSmall'
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'XLarge'
  | 'Handset'
  | 'Tablet'
  | 'Web';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Handset (手機)
   */
  readonly isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isHandset = toSignal(this.isHandset$, { initialValue: false });

  /**
   * Tablet (平板)
   */
  readonly isTablet$ = this.breakpointObserver
    .observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isTablet = toSignal(this.isTablet$, { initialValue: false });

  /**
   * Web (桌面)
   */
  readonly isWeb$ = this.breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isWeb = toSignal(this.isWeb$, { initialValue: false });

  /**
   * XSmall (< 600px)
   */
  readonly isXSmall$ = this.breakpointObserver
    .observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isXSmall = toSignal(this.isXSmall$, { initialValue: false });

  /**
   * Small (600px - 959px)
   */
  readonly isSmall$ = this.breakpointObserver
    .observe(Breakpoints.Small)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isSmall = toSignal(this.isSmall$, { initialValue: false });

  /**
   * Medium (960px - 1279px)
   */
  readonly isMedium$ = this.breakpointObserver
    .observe(Breakpoints.Medium)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isMedium = toSignal(this.isMedium$, { initialValue: false });

  /**
   * Large (1280px - 1919px)
   */
  readonly isLarge$ = this.breakpointObserver
    .observe(Breakpoints.Large)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isLarge = toSignal(this.isLarge$, { initialValue: false });

  /**
   * XLarge (>= 1920px)
   */
  readonly isXLarge$ = this.breakpointObserver
    .observe(Breakpoints.XLarge)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  readonly isXLarge = toSignal(this.isXLarge$, { initialValue: false });

  /**
   * 當前斷點 (computed signal)
   */
  readonly currentBreakpoint = computed<Breakpoint>(() => {
    if (this.isXSmall()) return 'XSmall';
    if (this.isSmall()) return 'Small';
    if (this.isMedium()) return 'Medium';
    if (this.isLarge()) return 'Large';
    if (this.isXLarge()) return 'XLarge';
    if (this.isHandset()) return 'Handset';
    if (this.isTablet()) return 'Tablet';
    if (this.isWeb()) return 'Web';
    return 'Medium'; // Default
  });

  /**
   * 是否為移動裝置 (Handset or Tablet Portrait)
   */
  readonly isMobile = computed(() => this.isHandset() || this.isTablet());

  /**
   * 觀察自訂斷點
   *
   * @param query - CSS media query
   * @returns Observable<boolean>
   */
  observe(query: string | string[]): Observable<boolean> {
    return this.breakpointObserver
      .observe(query)
      .pipe(map(result => result.matches));
  }

  /**
   * 檢查是否符合斷點
   *
   * @param query - CSS media query
   * @returns boolean
   */
  isMatched(query: string | string[]): boolean {
    return this.breakpointObserver.isMatched(query);
  }

  /**
   * 取得當前斷點
   *
   * @returns Breakpoint
   */
  getCurrentBreakpoint(): Breakpoint {
    return this.currentBreakpoint();
  }
}
