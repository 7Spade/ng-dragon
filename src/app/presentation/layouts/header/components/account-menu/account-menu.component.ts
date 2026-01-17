import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '@application/store/auth/stores/auth.store';
import { AuthService } from '@infrastructure/auth/services/auth.service';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss',
})
export class AccountMenuComponent {
  private authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected displayName = computed(
    () => this.authStore.user()?.displayName || this.authStore.user()?.email || 'User'
  );
  protected email = computed(() => this.authStore.user()?.email || '');
  protected photoUrl = computed(() => this.authStore.user()?.photoURL || null);

  protected goToProfile(): void {
    this.router.navigate(['/account/profile']);
  }

  protected goToSettings(): void {
    this.router.navigate(['/account/settings']);
  }

  protected async logout(): Promise<void> {
    await firstValueFrom(this.authService.logout());
    await this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
