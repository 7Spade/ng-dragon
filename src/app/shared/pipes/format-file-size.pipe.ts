/**
 * Format File Size Pipe
 *
 * Formats a file size in bytes to human-readable format
 *
 * @example
 * ```html
 * <span>{{ 1234567 | formatFileSize }}</span>
 * <!-- Output: "1.18 MB" -->
 *
 * <span>{{ 1234567 | formatFileSize:0 }}</span>
 * <!-- Output: "1 MB" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { formatFileSize } from '../../utils/file.utils';

@Pipe({
  name: 'formatFileSize',
  standalone: true,
})
export class FormatFileSizePipe implements PipeTransform {
  transform(value: number, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '';
    }

    return formatFileSize(value, decimals);
  }
}
