/**
 * Auto Focus Directive
 *
 * Automatically focuses an element when it's rendered
 *
 * @example
 * ```html
 * <input appAutoFocus />
 * <input [appAutoFocus]="shouldFocus" />
 * ```
 */

import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() appAutoFocus: boolean = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.appAutoFocus) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      }, 0);
    }
  }
}
