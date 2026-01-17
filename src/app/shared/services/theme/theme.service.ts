/**
 * Theme Service
 *
 * 管理應用主題 (Light/Dark Mode)
 * 支援自動檢測系統主題、手動切換、持久化
 *
 * @example
 * ```typescript
 * // Initialize theme
 * this.themeService.initialize();
 *
 * // Toggle theme
 * this.themeService.toggleTheme();
 *
 * // Set specific theme
 * this.themeService.setTheme('dark');
 *
 * // Get current theme
 * const isDark = this.themeService.isDarkMode();
 *
 * // Watch theme changes
 * this.themeService.theme$.subscribe(theme => {
 *   console.log('Theme changed:', theme);
 * });
 * ```
 */

import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'app-theme';
const DARK_MODE_CLASS = 'dark-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  // Signal-based state
  private readonly themeSignal = signal<Theme>('auto');
  private readonly systemPrefersDark = signal<boolean>(false);

  // Computed signals
  readonly theme = computed(() => this.themeSignal());
  readonly isDark = computed(() => {
    const theme = this.themeSignal();
    if (theme === 'auto') {
      return this.systemPrefersDark();
    }
    return theme === 'dark';
  });

  // Observable for compatibility
  private readonly themeSubject = new BehaviorSubject<Theme>('auto');
  readonly theme$ = this.themeSubject.asObservable();

  private mediaQueryList?: MediaQueryList;

  constructor() {
    // Effect to sync theme changes
    effect(() => {
      const theme = this.themeSignal();
      this.themeSubject.next(theme);
      this.applyTheme();
    });

    // Effect to apply dark mode class
    effect(() => {
      const isDark = this.isDark();
      this.updateDarkModeClass(isDark);
    });
  }

  /**
   * 初始化主題
   * 從 localStorage 讀取儲存的主題或使用系統偏好
   */
  initialize(): void {
    // 設置系統偏好檢測
    this.setupSystemPreferenceDetection();

    // 從 localStorage 讀取主題
    const savedTheme = this.loadThemeFromStorage();
    if (savedTheme) {
      this.themeSignal.set(savedTheme);
    } else {
      // 使用系統偏好
      this.themeSignal.set('auto');
    }
  }

  /**
   * 設置主題
   *
   * @param theme - 主題類型
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    this.saveThemeToStorage(theme);
  }

  /**
   * 切換主題
   */
  toggleTheme(): void {
    const current = this.themeSignal();
    if (current === 'auto') {
      // auto -> light or dark (based on system preference)
      this.setTheme(this.systemPrefersDark() ? 'light' : 'dark');
    } else if (current === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  /**
   * 是否為深色模式
   *
   * @returns boolean
   */
  isDarkMode(): boolean {
    return this.isDark();
  }

  /**
   * 取得當前主題
   *
   * @returns Theme
   */
  getCurrentTheme(): Theme {
    return this.themeSignal();
  }

  /**
   * 設置系統偏好檢測
   */
  private setupSystemPreferenceDetection(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    // 初始值
    this.systemPrefersDark.set(this.mediaQueryList.matches);

    // 監聽變更
    const listener = (e: MediaQueryListEvent) => {
      this.systemPrefersDark.set(e.matches);
    };

    // Modern browsers
    if (this.mediaQueryList.addEventListener) {
      this.mediaQueryList.addEventListener('change', listener);
    } else {
      // Legacy browsers
      this.mediaQueryList.addListener(listener);
    }
  }

  /**
   * 套用主題到 DOM
   */
  private applyTheme(): void {
    const theme = this.themeSignal();
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * 更新 dark mode class
   */
  private updateDarkModeClass(isDark: boolean): void {
    if (isDark) {
      this.document.body.classList.add(DARK_MODE_CLASS);
    } else {
      this.document.body.classList.remove(DARK_MODE_CLASS);
    }
  }

  /**
   * 從 localStorage 讀取主題
   */
  private loadThemeFromStorage(): Theme | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
        return saved as Theme;
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    }

    return null;
  }

  /**
   * 儲存主題到 localStorage
   */
  private saveThemeToStorage(theme: Theme): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  }

  /**
   * 清理資源
   */
  destroy(): void {
    if (this.mediaQueryList) {
      // Clean up listener if needed
      // Note: In Angular services with providedIn: 'root', this rarely gets called
    }
  }
}
