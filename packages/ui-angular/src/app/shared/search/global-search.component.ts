import { Component, Input, Output, EventEmitter, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SearchService } from './search.service';
import { SearchResult, SearchEntityType } from '../../../../../core-engine/src/queries/search-query';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzAutocompleteModule,
    NzInputModule,
    NzIconModule,
    NzSpinModule
  ],
  template: `
    <nz-input-group [nzSuffix]="suffixIconSearch" class="global-search">
      <input
        nz-input
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchChange($event)"
        [nzAutocomplete]="auto"
        [placeholder]="placeholder()"
        class="search-input"
      />
    </nz-input-group>

    <ng-template #suffixIconSearch>
      <nz-spin *ngIf="loading()" nzSimple [nzSize]="'small'"></nz-spin>
      <span *ngIf="!loading()" nz-icon nzType="search" class="search-icon"></span>
    </ng-template>

    <nz-autocomplete
      #auto
      [nzBackfill]="true"
      (selectionChange)="onSelect($event)"
    >
      <nz-auto-optgroup *ngFor="let group of groupedResults()" [nzLabel]="group.label">
        <nz-auto-option
          *ngFor="let result of group.results"
          [nzValue]="result"
          [nzLabel]="result.name"
        >
          <div class="search-result-item">
            <img
              *ngIf="result.avatarUrl"
              [src]="result.avatarUrl"
              class="result-avatar"
              alt=""
            />
            <div class="result-info">
              <div class="result-name">{{ result.name }}</div>
              <div class="result-description" *ngIf="result.description">
                {{ result.description | slice:0:50 }}{{ result.description.length > 50 ? '...' : '' }}
              </div>
            </div>
            <span class="result-type">{{ getTypeLabel(result.type) }}</span>
          </div>
        </nz-auto-option>
      </nz-auto-optgroup>

      <nz-auto-option *ngIf="results().length === 0 && !loading() && searchTerm" [nzDisabled]="true">
        <span nz-icon nzType="frown" class="empty-icon"></span>
        暂无结果
      </nz-auto-option>
    </nz-autocomplete>
  `,
  styles: [`
    .global-search {
      width: 100%;
      max-width: 500px;
    }

    .search-input {
      font-size: 14px;
    }

    .search-icon {
      color: rgba(0, 0, 0, 0.45);
    }

    .search-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    .result-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .result-info {
      flex: 1;
      min-width: 0;
    }

    .result-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-description {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-type {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      padding: 2px 8px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }

    .empty-icon {
      margin-right: 8px;
    }
  `]
})
export class GlobalSearchComponent {
  @Input() entityTypes: SearchEntityType[] = ['user', 'organization', 'project'];
  @Input() maxResults: number = 20;
  @Output() onSelectResult = new EventEmitter<SearchResult>();

  searchTerm = '';
  loading = signal(false);
  results = signal<SearchResult[]>([]);

  private searchSubject = new Subject<string>();

  placeholder = computed(() => {
    const types = this.entityTypes.map(t => this.getTypeLabel(t)).join('、');
    return `搜索${types}...`;
  });

  groupedResults = computed(() => {
    const groups: { label: string; results: SearchResult[] }[] = [];
    const resultsByType = new Map<SearchEntityType, SearchResult[]>();

    // Group results by type
    this.results().forEach(result => {
      if (!resultsByType.has(result.type)) {
        resultsByType.set(result.type, []);
      }
      resultsByType.get(result.type)!.push(result);
    });

    // Convert to array format
    this.entityTypes.forEach(type => {
      const typeResults = resultsByType.get(type);
      if (typeResults && typeResults.length > 0) {
        groups.push({
          label: this.getTypeLabel(type),
          results: typeResults
        });
      }
    });

    return groups;
  });

  constructor(private searchService: SearchService) {
    // Debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => this.performSearch(term));
  }

  onSearchChange(term: string): void {
    if (term && term.trim().length >= 2) {
      this.searchSubject.next(term.trim());
    } else {
      this.results.set([]);
    }
  }

  async performSearch(term: string): Promise<void> {
    this.loading.set(true);

    try {
      const response = await this.searchService.search(
        term,
        this.entityTypes,
        this.maxResults
      );
      this.results.set(response.results);
    } catch (error) {
      console.error('Search error:', error);
      this.results.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  onSelect(result: SearchResult): void {
    this.onSelectResult.emit(result);
  }

  getTypeLabel(type: SearchEntityType): string {
    switch (type) {
      case 'user':
        return '用户';
      case 'organization':
        return '组织';
      case 'project':
        return '项目';
      default:
        return '';
    }
  }
}
