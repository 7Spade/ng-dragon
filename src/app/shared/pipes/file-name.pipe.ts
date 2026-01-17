/**
 * File Name Pipe
 *
 * Extracts filename without extension from a file path
 *
 * @example
 * ```html
 * <span>{{ 'path/to/document.pdf' | fileName }}</span>
 * <!-- Output: "document" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { getFileName } from '../../utils/file.utils';

@Pipe({
  name: 'fileName',
  standalone: true,
})
export class FileNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return getFileName(value);
  }
}
