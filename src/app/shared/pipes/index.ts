/**
 * Shared Pipes
 *
 * Export all pipes for easy importing
 *
 * @example
 * ```typescript
 * import { DateAgoPipe, FormatFileSizePipe } from '@shared/pipes';
 * ```
 */

// Date pipes
export * from './date-ago.pipe';
export * from './format-date.pipe';

// Number pipes
export * from './format-number.pipe';
export * from './format-currency.pipe';
export * from './format-percentage.pipe';

// File pipes
export * from './format-file-size.pipe';
export * from './file-extension.pipe';
export * from './file-name.pipe';

// String pipes
export * from './truncate.pipe';
export * from './capitalize.pipe';
export * from './slugify.pipe';

// Array pipes
export * from './filter.pipe';
export * from './sort-by.pipe';
export * from './group-by.pipe';

// Safe pipes
export * from './safe-html.pipe';
export * from './safe-url.pipe';
