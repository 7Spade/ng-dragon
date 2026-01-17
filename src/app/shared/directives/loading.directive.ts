/**
 * Loading Directive
 *
 * Shows/hides loading state on an element
 *
 * @example
 * ```html
 * <button [appLoading]="isLoading" (click)="save()">
 *   Save
 * </button>
 * ```
 */

import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appLoading]',
  standalone: true,
})
export class LoadingDirective implements OnChanges {
  @Input() appLoading: boolean = false;
  @Input() loadingText: string = 'Loading...';

  private originalContent: string = '';
  private originalDisabled: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appLoading']) {
      if (this.appLoading) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    }
  }

  private showLoading(): void {
    const element = this.elementRef.nativeElement;

    // Save original state
    this.originalContent = element.textContent;
    this.originalDisabled = element.disabled;

    // Apply loading state
    this.renderer.setProperty(element, 'textContent', this.loadingText);
    this.renderer.setProperty(element, 'disabled', true);
    this.renderer.addClass(element, 'loading');
  }

  private hideLoading(): void {
    const element = this.elementRef.nativeElement;

    // Restore original state
    this.renderer.setProperty(element, 'textContent', this.originalContent);
    this.renderer.setProperty(element, 'disabled', this.originalDisabled);
    this.renderer.removeClass(element, 'loading');
  }
}
