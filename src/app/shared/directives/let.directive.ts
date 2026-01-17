/**
 * Let Directive
 *
 * Allows creating local template variables
 *
 * @example
 * ```html
 * <div *appLet="user$ | async as user">
 *   {{ user.name }}
 * </div>
 * ```
 */

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLet]',
  standalone: true,
})
export class LetDirective<T> {
  @Input()
  set appLet(value: T) {
    this.context.$implicit = value;
    this.context.appLet = value;
  }

  private context: {
    $implicit: T | null;
    appLet: T | null;
  } = {
    $implicit: null,
    appLet: null,
  };

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }
}
