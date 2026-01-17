/**
 * Click Outside Directive
 *
 * Emits an event when a click occurs outside the element
 *
 * @example
 * ```html
 * <div (appClickOutside)="onClickOutside()">
 *   Content
 * </div>
 * ```
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
