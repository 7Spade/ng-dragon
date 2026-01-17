/**
 * Slugify Pipe
 *
 * Converts a string to URL-friendly slug format
 *
 * @example
 * ```html
 * <span>{{ 'Hello World!' | slugify }}</span>
 * <!-- Output: "hello-world" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { slugify } from '../../utils/string.utils';

@Pipe({
  name: 'slugify',
  standalone: true,
})
export class SlugifyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return slugify(value);
  }
}
