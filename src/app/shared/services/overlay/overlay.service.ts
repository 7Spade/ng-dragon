/**
 * Overlay Service
 *
 * 封裝 CDK Overlay,提供彈出層管理
 * 支援 tooltip, popover, dropdown 等
 *
 * @example
 * ```typescript
 * // Create a simple overlay
 * const overlayRef = this.overlayService.create({
 *   positionStrategy: this.overlayService.createPositionStrategy(element, 'bottom'),
 *   hasBackdrop: true,
 *   backdropClass: 'cdk-overlay-transparent-backdrop'
 * });
 *
 * // Attach component
 * const portal = new ComponentPortal(MyComponent);
 * overlayRef.attach(portal);
 *
 * // Close overlay
 * overlayRef.dispose();
 * ```
 */

import { inject, Injectable, ElementRef } from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  PositionStrategy,
  GlobalPositionStrategy,
  FlexibleConnectedPositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

export type OverlayPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private readonly overlay = inject(Overlay);

  /**
   * 建立 Overlay
   *
   * @param config - Overlay 配置
   * @returns OverlayRef
   */
  create(config?: OverlayConfig): OverlayRef {
    return this.overlay.create(config);
  }

  /**
   * 建立位置策略 (相對定位)
   *
   * @param origin - 原點元素
   * @param position - 位置
   * @returns FlexibleConnectedPositionStrategy
   */
  createPositionStrategy(
    origin: ElementRef | HTMLElement,
    position: OverlayPosition = 'bottom'
  ): FlexibleConnectedPositionStrategy {
    const element = origin instanceof ElementRef ? origin.nativeElement : origin;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(element);

    switch (position) {
      case 'top':
        positionStrategy.withPositions([
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
          },
        ]);
        break;
      case 'bottom':
        positionStrategy.withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
          },
        ]);
        break;
      case 'left':
        positionStrategy.withPositions([
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          },
        ]);
        break;
      case 'right':
        positionStrategy.withPositions([
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
        ]);
        break;
    }

    return positionStrategy;
  }

  /**
   * 建立全域位置策略 (絕對定位)
   *
   * @param position - 位置
   * @returns GlobalPositionStrategy
   */
  createGlobalPositionStrategy(position: OverlayPosition = 'center'): GlobalPositionStrategy {
    const positionStrategy = this.overlay.position().global();

    switch (position) {
      case 'top':
        positionStrategy.top('0').centerHorizontally();
        break;
      case 'bottom':
        positionStrategy.bottom('0').centerVertically();
        break;
      case 'left':
        positionStrategy.left('0').centerVertically();
        break;
      case 'right':
        positionStrategy.right('0').centerVertically();
        break;
      case 'center':
        positionStrategy.centerHorizontally().centerVertically();
        break;
    }

    return positionStrategy;
  }

  /**
   * 建立滾動策略
   *
   * @param type - 策略類型
   * @returns ScrollStrategy
   */
  createScrollStrategy(
    type: 'noop' | 'close' | 'block' | 'reposition' = 'reposition'
  ): ScrollStrategy {
    const scrollStrategies = this.overlay.scrollStrategies;

    switch (type) {
      case 'noop':
        return scrollStrategies.noop();
      case 'close':
        return scrollStrategies.close();
      case 'block':
        return scrollStrategies.block();
      case 'reposition':
        return scrollStrategies.reposition();
    }
  }

  /**
   * 建立帶背景的 Overlay 配置
   *
   * @param origin - 原點元素
   * @param position - 位置
   * @returns OverlayConfig
   */
  createConfigWithBackdrop(
    origin: ElementRef | HTMLElement,
    position: OverlayPosition = 'bottom'
  ): OverlayConfig {
    return {
      positionStrategy: this.createPositionStrategy(origin, position),
      scrollStrategy: this.createScrollStrategy('close'),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    };
  }

  /**
   * 建立無背景的 Overlay 配置
   *
   * @param origin - 原點元素
   * @param position - 位置
   * @returns OverlayConfig
   */
  createConfigWithoutBackdrop(
    origin: ElementRef | HTMLElement,
    position: OverlayPosition = 'bottom'
  ): OverlayConfig {
    return {
      positionStrategy: this.createPositionStrategy(origin, position),
      scrollStrategy: this.createScrollStrategy('reposition'),
      hasBackdrop: false,
    };
  }
}
