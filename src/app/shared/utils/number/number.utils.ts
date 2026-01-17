/**
 * Number Utility Functions
 */

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function round(num: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function average(numbers: number[]): number {
  return numbers.length > 0 ? sum(numbers) / numbers.length : 0;
}
