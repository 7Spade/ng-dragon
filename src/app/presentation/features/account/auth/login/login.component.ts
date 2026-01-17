import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '@application/store/auth/stores/auth.store';

@Component({
  selector: 'app-account-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Welcome back</mat-card-title>
          <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                autocomplete="email"
                required
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                autocomplete="current-password"
                required
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>
            @if (authStore.error()) {
              <div class="auth-error" role="alert">{{ authStore.error() }}</div>
            }
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="loginForm.invalid || authStore.isLoading()"
            >
              @if (authStore.isLoading()) {
                <span>Signing in...</span>
              } @else {
                <span>Login</span>
              }
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions class="links">
          <a mat-button routerLink="/forgot-password">Forgot password?</a>
          <a mat-button routerLink="/register">Create account</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      background: linear-gradient(135deg, #f4f6fb 0%, #e9ecf7 100%);
    }
    .auth-card {
      width: min(420px, 100%);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .auth-error {
      color: #b91c1c;
      font-size: 14px;
    }
    .links {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
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
