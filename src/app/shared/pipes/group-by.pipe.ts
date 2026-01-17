/**
 * Group By Pipe
 *
 * Groups an array by a specified property
 *
 * @example
 * ```html
 * <div *ngFor="let group of items | groupBy:'category' | keyvalue">
 *   <h3>{{ group.key }}</h3>
 *   <div *ngFor="let item of group.value">
 *     {{ item.name }}
 *   </div>
 * </div>
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { groupBy } from '../../utils/array.utils';

@Pipe({
  name: 'groupBy',
  standalone: true,
  pure: false,
})
export class GroupByPipe implements PipeTransform {
  transform<T>(
    items: T[],
    keySelector: (item: T) => string | number
  ): Record<string, T[]> {
    if (!items || !keySelector) {
      return {};
    }

    return groupBy(items, keySelector);
  }
}
