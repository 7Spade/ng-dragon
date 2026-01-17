/**
 * Safe HTML Pipe
 *
 * Bypasses Angular's built-in sanitization for HTML content
 * Use with caution - only for trusted content
 *
 * @example
 * ```html
 * <div [innerHTML]="htmlContent | safeHtml"></div>
 * ```
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
