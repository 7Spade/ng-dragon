import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../../../core/auth/stores/auth.store';

@Component({
  selector: 'app-account-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h1>Create your account</h1>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <label>Email <input type="email" formControlName="email" required /></label>
        <label>Password <input type="password" formControlName="password" required /></label>
        <label>Confirm <input type="password" formControlName="confirmPassword" required /></label>
        <button type="submit" [disabled]="registerForm.invalid || authStore.isLoading()">Register</button>
      </form>
      <div class="links">
        <a routerLink="/login">Already have an account? Login</a>
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
export class AccountRegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authStore = inject(AuthStore);
  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
        return;
      }
      this.authStore.register({ email, password });
    }
  }
}
