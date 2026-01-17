/**
 * Format Number Pipe
 *
 * Formats a number with thousands separators and decimal places
 *
 * @example
 * ```html
 * <span>{{ 1234567.89 | formatNumber }}</span>
 * <!-- Output: "1,234,567.89" -->
 *
 * <span>{{ 1234567.89 | formatNumber:0 }}</span>
 * <!-- Output: "1,234,568" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '../../utils/number.utils';

@Pipe({
  name: 'formatNumber',
  standalone: true,
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '';
    }

    return formatNumber(value, decimals);
  }
}
