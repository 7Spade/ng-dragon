/**
 * Platform Service
 *
 * 封裝 CDK Platform,提供平台檢測 API
 * 檢測瀏覽器、作業系統、裝置類型
 *
 * @example
 * ```typescript
 * // Check platform
 * const isAndroid = this.platformService.isAndroid();
 * const isIOS = this.platformService.isIOS();
 * const isMobile = this.platformService.isMobile();
 *
 * // Get browser info
 * const browser = this.platformService.getBrowser();
 * ```
 */

import { Injectable, signal } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { inject } from '@angular/core';

export type BrowserType = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'IE' | 'Opera' | 'Unknown';
export type OSType = 'Windows' | 'MacOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly platform = inject(Platform);

  // Signals for reactive platform state
  readonly isAndroid = signal(this.platform.ANDROID);
  readonly isIOS = signal(this.platform.IOS);
  readonly isBrowser = signal(this.platform.isBrowser);

  /**
   * 是否為 Android
   */
  isAndroidPlatform(): boolean {
    return this.platform.ANDROID;
  }

  /**
   * 是否為 iOS
   */
  isIOSPlatform(): boolean {
    return this.platform.IOS;
  }

  /**
   * 是否為 Safari
   */
  isSafari(): boolean {
    return this.platform.SAFARI;
  }

  /**
   * 是否為 Firefox
   */
  isFirefox(): boolean {
    return this.platform.FIREFOX;
  }

  /**
   * 是否為 Edge
   */
  isEdge(): boolean {
    return this.platform.EDGE;
  }

  /**
   * 是否為 WebKit
   */
  isWebKit(): boolean {
    return this.platform.WEBKIT;
  }

  /**
   * 是否為移動裝置
   */
  isMobile(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  /**
   * 是否為平板
   */
  isTablet(): boolean {
    // 簡單判斷: iPad 或 Android 平板
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes('ipad') ||
      (this.platform.ANDROID && !ua.includes('mobile'))
    );
  }

  /**
   * 是否為桌面
   */
  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  /**
   * 是否為瀏覽器環境
   */
  isBrowserPlatform(): boolean {
    return this.platform.isBrowser;
  }

  /**
   * 取得瀏覽器類型
   */
  getBrowser(): BrowserType {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes('edg/')) return 'Edge';
    if (ua.includes('chrome/')) return 'Chrome';
    if (ua.includes('firefox/')) return 'Firefox';
    if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
    if (ua.includes('msie') || ua.includes('trident/')) return 'IE';
    if (ua.includes('opera/') || ua.includes('opr/')) return 'Opera';

    return 'Unknown';
  }

  /**
   * 取得作業系統
   */
  getOS(): OSType {
    const ua = navigator.userAgent.toLowerCase();

    if (this.platform.ANDROID) return 'Android';
    if (this.platform.IOS) return 'iOS';
    if (ua.includes('win')) return 'Windows';
    if (ua.includes('mac')) return 'MacOS';
    if (ua.includes('linux')) return 'Linux';

    return 'Unknown';
  }

  /**
   * 取得瀏覽器版本
   */
  getBrowserVersion(): string {
    const ua = navigator.userAgent;
    const browser = this.getBrowser();

    let match: RegExpMatchArray | null = null;

    switch (browser) {
      case 'Chrome':
        match = ua.match(/Chrome\/(\d+)/);
        break;
      case 'Firefox':
        match = ua.match(/Firefox\/(\d+)/);
        break;
      case 'Safari':
        match = ua.match(/Version\/(\d+)/);
        break;
      case 'Edge':
        match = ua.match(/Edg\/(\d+)/);
        break;
      case 'IE':
        match = ua.match(/MSIE (\d+)/) || ua.match(/rv:(\d+)/);
        break;
      case 'Opera':
        match = ua.match(/Opera\/(\d+)/) || ua.match(/OPR\/(\d+)/);
        break;
    }

    return match ? match[1] : 'Unknown';
  }

  /**
   * 是否支援 Touch
   */
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * 取得螢幕方向
   */
  getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  /**
   * 取得裝置資訊
   */
  getDeviceInfo(): {
    browser: BrowserType;
    browserVersion: string;
    os: OSType;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouchDevice: boolean;
    orientation: 'portrait' | 'landscape';
  } {
    return {
      browser: this.getBrowser(),
      browserVersion: this.getBrowserVersion(),
      os: this.getOS(),
      isMobile: this.isMobile(),
      isTablet: this.isTablet(),
      isDesktop: this.isDesktop(),
      isTouchDevice: this.isTouchDevice(),
      orientation: this.getOrientation(),
    };
  }
}
