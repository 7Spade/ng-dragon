import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, PageHeaderModule, NzCardModule, NzButtonModule, NzEmptyModule],
  template: `
    <page-header>团队列表</page-header>
    <nz-card>
      <nz-empty
        nzNotFoundContent="暂无团队数据"
        [nzNotFoundFooter]="footerTpl"
      ></nz-empty>
      <ng-template #footerTpl>
        <button nz-button nzType="primary" (click)="createTeam()">创建团队</button>
      </ng-template>
    </nz-card>
  `
})
export class TeamsListComponent {
  createTeam(): void {
    // Navigate to create team page
    window.location.href = '/organizations/default/teams/create';
  }
}
