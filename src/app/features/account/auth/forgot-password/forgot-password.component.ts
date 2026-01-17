import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../../../core/auth/stores/auth.store';

@Component({
  selector: 'app-account-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h1>Reset password</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email <input type="email" formControlName="email" required /></label>
        <button type="submit" [disabled]="form.invalid || authStore.isLoading()">Send reset link</button>
      </form>
      <div class="links">
        <a routerLink="/login">Back to login</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 420px; margin: 0 auto; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
    form { display: flex; flex-direction: column; gap: 12px; }
    input { padding: 8px; border-radius: 8px; border: 1px solid #e0e0e0; }
    button { padding: 10px 12px; border: none; border-radius: 10px; background: #4f46e5; color: #fff; cursor: pointer; }
  `],
})
export class AccountForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authStore = inject(AuthStore);
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.authStore.resetPassword(this.form.value).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
