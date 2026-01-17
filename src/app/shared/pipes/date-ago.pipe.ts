/**
 * Date Ago Pipe
 *
 * Converts a date to relative time (e.g., "2 hours ago", "3 days ago")
 *
 * @example
 * ```html
 * <span>{{ createdAt | dateAgo }}</span>
 * <!-- Output: "2 hours ago" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { getRelativeTime } from '../../utils/date.utils';

@Pipe({
  name: 'dateAgo',
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    return getRelativeTime(date);
  }
}
