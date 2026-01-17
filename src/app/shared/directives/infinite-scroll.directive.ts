/**
 * Infinite Scroll Directive
 *
 * Triggers an event when the user scrolls near the bottom of an element
 *
 * @example
 * ```html
 * <div appInfiniteScroll
 *      [scrollThreshold]="200"
 *      (scrolled)="loadMore()">
 *   <!-- Content -->
 * </div>
 * ```
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective {
  @Input() scrollThreshold = 200;
  @Output() scrolled = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(): void {
    const element = this.elementRef.nativeElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;

    if (scrollHeight - scrollPosition <= this.scrollThreshold) {
      this.scrolled.emit();
    }
  }
}
