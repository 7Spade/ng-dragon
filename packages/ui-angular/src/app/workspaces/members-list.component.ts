import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, PageHeaderModule, NzCardModule, NzButtonModule, NzEmptyModule],
  template: `
    <page-header>成员列表</page-header>
    <nz-card>
      <nz-empty
        nzNotFoundContent="暂无成员数据"
        [nzNotFoundFooter]="footerTpl"
      ></nz-empty>
      <ng-template #footerTpl>
        <button nz-button nzType="primary">邀请成员</button>
      </ng-template>
    </nz-card>
  `
})
export class MembersListComponent {
}
