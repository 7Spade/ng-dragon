/**
 * Animation 相關常數
 * 
 * 定義應用程式中使用的動畫相關常數
 * 
 * @module SharedConstants
 */

/**
 * 動畫曲線 (Easing)
 */
export const ANIMATION_CURVES = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  deceleration: 'cubic-bezier(0, 0, 0.2, 1)',
  acceleration: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

/**
 * 動畫持續時間 (毫秒)
 */
export const ANIMATION_DURATIONS = {
  instant: 0,
  veryFast: 100,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

/**
 * 淡入淡出動畫
 */
export const FADE_ANIMATION = {
  in: {
    opacity: ['0', '1'],
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_CURVES.easeOut,
  },
  out: {
    opacity: ['1', '0'],
    duration: ANIMATION_DURATIONS.fast,
    easing: ANIMATION_CURVES.easeIn,
  },
} as const;

/**
 * 滑動動畫
 */
export const SLIDE_ANIMATION = {
  inLeft: {
    transform: ['translateX(-100%)', 'translateX(0)'],
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_CURVES.easeOut,
  },
  inRight: {
    transform: ['translateX(100%)', 'translateX(0)'],
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_CURVES.easeOut,
  },
  inTop: {
    transform: ['translateY(-100%)', 'translateY(0)'],
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_CURVES.easeOut,
  },
  inBottom: {
    transform: ['translateY(100%)', 'translateY(0)'],
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_CURVES.easeOut,
  },
} as const;

/**
 * 縮放動畫
 */
export const SCALE_ANIMATION = {
  in: {
    transform: ['scale(0)', 'scale(1)'],
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_CURVES.easeOut,
  },
  out: {
    transform: ['scale(1)', 'scale(0)'],
    duration: ANIMATION_DURATIONS.fast,
    easing: ANIMATION_CURVES.easeIn,
  },
} as const;

/**
 * 旋轉動畫
 */
export const ROTATE_ANIMATION = {
  in: {
    transform: ['rotate(0deg)', 'rotate(360deg)'],
    duration: ANIMATION_DURATIONS.slow,
    easing: ANIMATION_CURVES.linear,
  },
} as const;
