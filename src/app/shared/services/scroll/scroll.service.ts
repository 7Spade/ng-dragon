/**
 * Scroll Service
 *
 * 提供滾動相關操作
 * 支援平滑滾動、滾動到頂部/底部、檢測滾動位置
 *
 * @example
 * ```typescript
 * // Scroll to top
 * this.scrollService.scrollToTop();
 *
 * // Scroll to element
 * this.scrollService.scrollToElement('#target');
 *
 * // Check if at bottom
 * const isAtBottom = this.scrollService.isAtBottom();
 * ```
 */

import { Injectable, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

export interface ScrollPosition {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private readonly viewportScroller = inject(ViewportScroller);

  // Scroll position signal
  private readonly scrollPosition$ = fromEvent(window, 'scroll').pipe(
    debounceTime(100),
    map(() => ({
      x: window.scrollX,
      y: window.scrollY,
    }))
  );
  readonly scrollPosition = toSignal(this.scrollPosition$, {
    initialValue: { x: 0, y: 0 },
  });

  // Scroll direction signal
  private previousY = 0;
  private readonly scrollDirection$ = this.scrollPosition$.pipe(
    map(pos => {
      const direction = pos.y > this.previousY ? 'down' : 'up';
      this.previousY = pos.y;
      return direction;
    })
  );
  readonly scrollDirection = toSignal(this.scrollDirection$, {
    initialValue: 'up' as 'up' | 'down',
  });

  /**
   * 滾動到頂部
   *
   * @param smooth - 是否平滑滾動
   */
  scrollToTop(smooth: boolean = true): void {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  /**
   * 滾動到底部
   *
   * @param smooth - 是否平滑滾動
   */
  scrollToBottom(smooth: boolean = true): void {
    const scrollHeight = document.documentElement.scrollHeight;
    if (smooth) {
      window.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, scrollHeight);
    }
  }

  /**
   * 滾動到指定位置
   *
   * @param position - 滾動位置
   * @param smooth - 是否平滑滾動
   */
  scrollToPosition(position: ScrollPosition, smooth: boolean = true): void {
    if (smooth) {
      window.scrollTo({
        top: position.y,
        left: position.x,
        behavior: 'smooth',
      });
    } else {
      this.viewportScroller.scrollToPosition([position.x, position.y]);
    }
  }

  /**
   * 滾動到元素
   *
   * @param selector - CSS 選擇器或 HTMLElement
   * @param smooth - 是否平滑滾動
   * @param offset - 偏移量 (px)
   */
  scrollToElement(
    selector: string | HTMLElement,
    smooth: boolean = true,
    offset: number = 0
  ): void {
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return;
    }

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - offset;

    if (smooth) {
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, scrollTop);
    }
  }

  /**
   * 滾動到錨點
   *
   * @param anchor - 錨點 ID
   */
  scrollToAnchor(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }

  /**
   * 取得當前滾動位置
   *
   * @returns ScrollPosition
   */
  getScrollPosition(): ScrollPosition {
    return {
      x: window.scrollX,
      y: window.scrollY,
    };
  }

  /**
   * 是否在頂部
   *
   * @param threshold - 閾值 (px)
   * @returns boolean
   */
  isAtTop(threshold: number = 10): boolean {
    return window.scrollY <= threshold;
  }

  /**
   * 是否在底部
   *
   * @param threshold - 閾值 (px)
   * @returns boolean
   */
  isAtBottom(threshold: number = 10): boolean {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    return scrollHeight - scrollTop - clientHeight <= threshold;
  }

  /**
   * 取得滾動百分比
   *
   * @returns number (0-100)
   */
  getScrollPercentage(): number {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollHeight === clientHeight) {
      return 0;
    }

    return (scrollTop / (scrollHeight - clientHeight)) * 100;
  }

  /**
   * 啟用滾動
   */
  enableScroll(): void {
    document.body.style.overflow = '';
  }

  /**
   * 禁用滾動
   */
  disableScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  /**
   * 檢查元素是否在視窗內
   *
   * @param element - 元素
   * @param threshold - 可見閾值 (0-1)
   * @returns boolean
   */
  isElementInViewport(element: HTMLElement, threshold: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView =
      rect.top + rect.height * threshold <= windowHeight &&
      rect.bottom - rect.height * threshold >= 0;
    const horInView =
      rect.left + rect.width * threshold <= windowWidth &&
      rect.right - rect.width * threshold >= 0;

    return vertInView && horInView;
  }
}
