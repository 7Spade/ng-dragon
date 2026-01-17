/**
 * Safe URL Pipe
 *
 * Bypasses Angular's built-in sanitization for URLs
 * Use with caution - only for trusted content
 *
 * @example
 * ```html
 * <a [href]="dynamicUrl | safeUrl">Link</a>
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeUrl {
    if (!value) {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
