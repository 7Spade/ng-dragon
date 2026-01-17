/**
 * Format Currency Pipe
 *
 * Formats a number as currency
 *
 * @example
 * ```html
 * <span>{{ 1234.56 | formatCurrency }}</span>
 * <!-- Output: "$1,234.56" -->
 *
 * <span>{{ 1234.56 | formatCurrency:'EUR' }}</span>
 * <!-- Output: "€1,234.56" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '../../utils/number.utils';

@Pipe({
  name: 'formatCurrency',
  standalone: true,
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currency: string = 'USD',
    decimals: number = 2
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    return formatCurrency(value, currency, decimals);
  }
}
