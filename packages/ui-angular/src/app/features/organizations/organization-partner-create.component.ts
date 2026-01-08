import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { OrganizationSessionFacade } from '../../core/session/organization-session.facade';

@Component({
  selector: 'page-organization-partner-create',
  template: `
    <nz-result
      nzStatus="info"
      nzTitle="Create partner"
      nzSubTitle="A placeholder flow to invite a partner to the selected organization."
      nzExtra>
      <button nz-button nzType="primary" (click)="invite()">Invite partner</button>
      <a nz-button routerLink="/dashboard">Back to dashboard</a>
    </nz-result>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzResultModule, NzButtonModule, RouterLink]
})
export class OrganizationPartnerCreateComponent {
  private readonly organizationFacade = inject(OrganizationSessionFacade);

  invite(): void {
    void this.organizationFacade.createPartner();
  }
}
