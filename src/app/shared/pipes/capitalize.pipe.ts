/**
 * Capitalize Pipe
 *
 * Capitalizes the first letter of a string
 *
 * @example
 * ```html
 * <span>{{ 'hello world' | capitalize }}</span>
 * <!-- Output: "Hello world" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { capitalize } from '../../utils/string.utils';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return capitalize(value);
  }
}
