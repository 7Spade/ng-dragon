import { Injectable, inject } from '@angular/core';
import { Auth, Unsubscribe, onAuthStateChanged, User } from '@angular/fire/auth';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ReplaySubject, firstValueFrom, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthBridgeService {
  private auth = inject(Auth);
  private tokenService = inject(DA_SERVICE_TOKEN);
  private authState$ = new ReplaySubject<User | null>(1);
  private unsubscribeFn?: Unsubscribe;

  /**
   * 初始化 Firebase Auth 狀態監聽
   * 自動同步到 @delon/auth
   *
   * NOTE: 只建立一次監聽，避免重複 onAuthStateChanged 造成競態
   */
  init(): void {
    if (this.unsubscribeFn) {
      return;
    }

    this.unsubscribeFn = onAuthStateChanged(this.auth, async (user: User | null) => {
      await this.syncToken(user);
      this.authState$.next(user);
    });
  }

  /**
   * 獲取 token 過期時間（毫秒時間戳）
   */
  private async getTokenExpiration(user: User): Promise<number> {
    const idTokenResult = await user.getIdTokenResult();
    return new Date(idTokenResult.expirationTime).getTime();
  }

  /**
   * 強制刷新 token
   */
  async refreshToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    const token = await user.getIdToken(true); // 強制刷新
    return token;
  }

  /**
   * 獲取當前用戶
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * 單一來源的 Auth 狀態 (避免多處監聽)
   */
  waitForAuthState(): Promise<User | null> {
    return firstValueFrom(this.authState$.pipe(take(1)));
  }

  private async syncToken(user: User | null): Promise<void> {
    if (user) {
      const token = await user.getIdToken();
      const tokenExpiration = await this.getTokenExpiration(user);

      this.tokenService.set({
        token,
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email,
        avatar: user.photoURL,
        expired: tokenExpiration
      });
    } else {
      this.tokenService.clear();
    }
  }
}

// END OF FILE
