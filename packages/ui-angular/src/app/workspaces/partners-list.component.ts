import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-partners-list',
  standalone: true,
  imports: [CommonModule, PageHeaderModule, NzCardModule, NzButtonModule, NzEmptyModule],
  template: `
    <page-header>合作伙伴列表</page-header>
    <nz-card>
      <nz-empty
        nzNotFoundContent="暂无合作伙伴数据"
        [nzNotFoundFooter]="footerTpl"
      ></nz-empty>
      <ng-template #footerTpl>
        <button nz-button nzType="primary" (click)="createPartner()">添加合作伙伴</button>
      </ng-template>
    </nz-card>
  `
})
export class PartnersListComponent {
  createPartner(): void {
    // Navigate to create partner page
    window.location.href = '/organizations/default/partners/create';
  }
}
