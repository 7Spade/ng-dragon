/**
 * Intersection Observer Directive
 *
 * Triggers an event when element enters or exits the viewport
 *
 * @example
 * ```html
 * <div appIntersectionObserver
 *      [threshold]="0.5"
 *      (visibilityChange)="onVisibilityChange($event)">
 *   <!-- Content -->
 * </div>
 * ```
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true,
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() threshold = 0.5;
  @Input() rootMargin = '0px';
  @Output() visibilityChange = new EventEmitter<boolean>();

  private observer: IntersectionObserver | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.createObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private createObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.visibilityChange.emit(entry.isIntersecting);
      });
    }, options);

    this.observer.observe(this.elementRef.nativeElement);
  }
}
