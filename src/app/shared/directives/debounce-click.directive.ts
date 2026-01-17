/**
 * Debounce Click Directive
 *
 * Debounces click events to prevent rapid successive clicks
 *
 * @example
 * ```html
 * <button (appDebounceClick)="onSave()" [debounceTime]="500">
 *   Save
 * </button>
 * ```
 */

import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UI } from '../../constants/ui.constants';

@Directive({
  selector: '[appDebounceClick]',
  standalone: true,
})
export class DebounceClickDirective implements OnDestroy {
  @Input() debounceTime = UI.DEBOUNCE_TIME;
  @Output() appDebounceClick = new EventEmitter<MouseEvent>();

  private clicks = new Subject<MouseEvent>();
  private subscription = this.clicks
    .pipe(debounceTime(this.debounceTime))
    .subscribe((event) => this.appDebounceClick.emit(event));

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
