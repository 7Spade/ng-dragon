/**
 * Sort By Pipe
 *
 * Sorts an array by a specified property
 *
 * @example
 * ```html
 * <div *ngFor="let item of items | sortBy:'name'">
 *   {{ item.name }}
 * </div>
 *
 * <div *ngFor="let item of items | sortBy:'name':'desc'">
 *   {{ item.name }}
 * </div>
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { sortBy } from '../../utils/array.utils';

@Pipe({
  name: 'sortBy',
  standalone: true,
  pure: false,
})
export class SortByPipe implements PipeTransform {
  transform<T>(
    items: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
  ): T[] {
    if (!items || !key) {
      return items;
    }

    const sorted = sortBy(items, key);
    return order === 'desc' ? sorted.reverse() : sorted;
  }
}
