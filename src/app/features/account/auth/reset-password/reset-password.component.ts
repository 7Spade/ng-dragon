import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../../core/auth/stores/auth.store';

@Component({
  selector: 'app-account-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h1>Reset password</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email <input type="email" formControlName="email" required /></label>
        <button type="submit" [disabled]="form.invalid || authStore.isLoading()">Send link</button>
      </form>
      <div class="links">
        <a routerLink="/account/auth/login">Back to login</a>
      </div>
    </div>
  `,
})
export class AccountResetPasswordComponent {
  private fb = inject(FormBuilder);
  public authStore = inject(AuthStore);
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.authStore.resetPassword(this.form.value);
    }
  }
}
