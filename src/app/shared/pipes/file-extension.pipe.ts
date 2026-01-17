/**
 * File Extension Pipe
 *
 * Extracts file extension from a filename
 *
 * @example
 * ```html
 * <span>{{ 'document.pdf' | fileExtension }}</span>
 * <!-- Output: "pdf" -->
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { getFileExtension } from '../../utils/file.utils';

@Pipe({
  name: 'fileExtension',
  standalone: true,
})
export class FileExtensionPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return getFileExtension(value);
  }
}
