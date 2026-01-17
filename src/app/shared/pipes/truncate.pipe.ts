/**
 * Truncate Pipe
 *
 * Truncates a string to a specified length
 *
 * @example
 * ```html
 * <span>{{ longText | truncate:50 }}</span>
 * <!-- Output: "This is a very long text that will be trunca..." -->
 *
 * <span>{{ longText | truncate:50:'---' }}</span>
 * <!-- Output: "This is a very long text that will be trunca---" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { truncate } from '../../utils/string.utils';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 100, suffix: string = '...'): string {
    if (!value) {
      return '';
    }

    return truncate(value, maxLength, suffix);
  }
}
