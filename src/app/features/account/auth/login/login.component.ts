import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../../../core/auth/stores/auth.store';

@Component({
  selector: 'app-account-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h1>Welcome back</h1>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label>
          Email
          <input type="email" formControlName="email" required />
        </label>
        <label>
          Password
          <input type="password" formControlName="password" required />
        </label>
        <button type="submit" [disabled]="loginForm.invalid || authStore.isLoading()">Login</button>
      </form>
      <div class="links">
        <a routerLink="/account/auth/forgot-password">Forgot password?</a>
        <a routerLink="/account/auth/register">Create account</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 420px; margin: 0 auto; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
    form { display: flex; flex-direction: column; gap: 12px; }
    input { padding: 8px; border-radius: 8px; border: 1px solid #e0e0e0; }
    button { padding: 10px 12px; border: none; border-radius: 10px; background: #4f46e5; color: #fff; cursor: pointer; }
    .links { display: flex; justify-content: space-between; font-size: 14px; }
  `],
})
export class AccountLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authStore = inject(AuthStore);
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authStore.login({ email, password });
    }
  }
}
