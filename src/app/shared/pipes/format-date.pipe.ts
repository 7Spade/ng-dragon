/**
 * Format Date Pipe
 *
 * Formats a date according to specified format
 *
 * @example
 * ```html
 * <span>{{ createdAt | formatDate:'short' }}</span>
 * <!-- Output: "1/17/26, 5:23 PM" -->
 *
 * <span>{{ createdAt | formatDate:'medium' }}</span>
 * <!-- Output: "Jan 17, 2026, 5:23:45 PM" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DateFormat } from '../../enums/date-format.enum';
import { formatDate } from '../../utils/date.utils';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(
    value: Date | string | number,
    format: DateFormat | keyof typeof DateFormat = DateFormat.Short
  ): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    return formatDate(date, format as DateFormat);
  }
}
