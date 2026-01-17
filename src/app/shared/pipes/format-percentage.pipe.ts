/**
 * Format Percentage Pipe
 *
 * Formats a number as a percentage
 *
 * @example
 * ```html
 * <span>{{ 0.1234 | formatPercentage }}</span>
 * <!-- Output: "12.34%" -->
 *
 * <span>{{ 0.1234 | formatPercentage:0 }}</span>
 * <!-- Output: "12%" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { formatPercentage } from '../../utils/number.utils';

@Pipe({
  name: 'formatPercentage',
  standalone: true,
})
export class FormatPercentagePipe implements PipeTransform {
  transform(value: number, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '';
    }

    return formatPercentage(value, decimals);
  }
}
