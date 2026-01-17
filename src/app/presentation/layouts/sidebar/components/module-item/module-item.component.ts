import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkspaceModuleDescriptor } from '@domain/modules/entities/workspace-module.entity';

@Component({
  selector: 'app-module-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './module-item.component.html',
  styleUrl: './module-item.component.scss',
})
export class ModuleItemComponent {
  @Input({ required: true }) module!: WorkspaceModuleDescriptor;
  @Input({ required: true }) expanded!: boolean;
  @Input({ required: true }) workspaceId!: string;

  @Output() navigate = new EventEmitter<void>();

  protected routePath = computed(() => `/workspace/${this.workspaceId}/${this.module.route}`);

  protected hasBadge = computed(() => false);

  protected badgeCount = computed(() => 0);

  protected handleClick(): void {
    this.navigate.emit();
  }
}
