/**
 * Copy to Clipboard Directive
 *
 * Copies text to clipboard on click
 *
 * @example
 * ```html
 * <button appCopyToClipboard="Text to copy" (copied)="onCopied($event)">
 *   Copy
 * </button>
 * ```
 */

import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]',
  standalone: true,
})
export class CopyToClipboardDirective {
  @Input() appCopyToClipboard: string = '';
  @Output() copied = new EventEmitter<boolean>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.copyToClipboard(this.appCopyToClipboard);
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern async clipboard API
        await navigator.clipboard.writeText(text);
        this.copied.emit(true);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        textArea.remove();

        this.copied.emit(successful);
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      this.copied.emit(false);
    }
  }
}
