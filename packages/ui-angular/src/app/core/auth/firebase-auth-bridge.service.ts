import { Injectable, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { FirebaseAuthClient, FirebaseAuthUnsubscribe, FirebaseAuthUser, FirebaseIdTokenResult } from '@platform-adapters';
import { ReplaySubject, firstValueFrom, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthBridgeService {
  private authClient = inject(FirebaseAuthClient);
  private tokenService = inject(DA_SERVICE_TOKEN);
  private authState$ = new ReplaySubject<FirebaseAuthUser | null>(1);
  private unsubscribeFn?: FirebaseAuthUnsubscribe;

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

    this.unsubscribeFn = this.authClient.onAuthStateChanged(async (user: FirebaseAuthUser | null) => {
      await this.syncToken(user);
      this.authState$.next(user);
    });
  }

  /**
   * 獲取 token 過期時間（毫秒時間戳）
   */
  private async getTokenExpiration(user: FirebaseAuthUser): Promise<number> {
    const idTokenResult: FirebaseIdTokenResult = await this.authClient.getIdTokenResult(user);
    return new Date(idTokenResult.expirationTime).getTime();
  }

  /**
   * 強制刷新 token
   */
  async refreshToken(): Promise<string> {
    const user = this.authClient.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }
    const token = await this.authClient.getIdToken(user, true);
    return token;
  }

  /**
   * 獲取當前用戶
   */
  getCurrentUser(): FirebaseAuthUser | null {
    return this.authClient.getCurrentUser();
  }

  /**
   * 單一來源的 Auth 狀態 (避免多處監聽)
   */
  waitForAuthState(): Promise<FirebaseAuthUser | null> {
    return firstValueFrom(this.authState$.pipe(take(1)));
  }

  private async syncToken(user: FirebaseAuthUser | null): Promise<void> {
    if (user) {
      const token = await this.authClient.getIdToken(user);
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
