import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@application/store/auth/stores/auth.store';

@Component({
  selector: 'app-account-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Email verification</h1>
      <p>Send a verification email to your current address.</p>
      <button (click)="send()" class="primary">Send verification</button>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
    .primary { background: #4f46e5; color: #fff; border: none; padding: 10px 12px; border-radius: 10px; cursor: pointer; }
  `],
})
export class AccountVerifyEmailComponent {
  private authStore = inject(AuthStore);
  send(): void {
    this.authStore.verifyEmail();
  }
}
