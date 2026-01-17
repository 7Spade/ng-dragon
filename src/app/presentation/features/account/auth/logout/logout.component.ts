import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@application/store/auth/stores/auth.store';

@Component({
  selector: 'app-account-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Signing out</h1>
      <p>You will be redirected.</p>
    </div>
  `,
})
export class AccountLogoutComponent {
  private authStore = inject(AuthStore);
  constructor() {
    this.authStore.logout();
  }
}
