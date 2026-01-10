import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzCardModule } from 'ng-zorro-antd/card';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-context-placeholder',
  standalone: true,
  imports: [...SHARED_IMPORTS, NzCardModule],
  templateUrl: './context-placeholder.component.html',
  styleUrl: './context-placeholder.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = toSignal(
    this.route.data.pipe(map(data => (data['title'] as string) ?? 'Coming soon')),
    { initialValue: 'Coming soon' }
  );

  readonly contextId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id'))),
    { initialValue: null }
  );

  readonly breadcrumb = computed(() => [
    { title: 'Home', link: '/dashboard' },
    { title: this.title() }
  ]);

  readonly message = computed(() => {
    const id = this.contextId();
    return id ? `Context: ${id}. This page will be wired to backend flows.` : 'This page will be wired to backend flows.';
  });
}
