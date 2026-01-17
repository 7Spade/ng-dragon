/**
 * Filter Pipe
 *
 * Filters an array based on a predicate function
 *
 * @example
 * ```html
 * <div *ngFor="let item of items | filter:filterFn">
 *   {{ item.name }}
 * </div>
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
  pure: false, // Impure pipe to detect array changes
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], predicate: (item: T) => boolean): T[] {
    if (!items || !predicate) {
      return items;
    }

    return items.filter(predicate);
  }
}
