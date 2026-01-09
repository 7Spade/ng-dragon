import { Injectable, inject } from '@angular/core';
import {
  Auth,
  IdTokenResult,
  Unsubscribe,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthClient {
  private readonly auth = inject(Auth);
  readonly authState$ = authState(this.auth);

  onAuthStateChanged(next: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(this.auth, next);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, displayName?: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return credential;
  }

  async sendPasswordReset(email: string, continueUrl?: string): Promise<void> {
    const actionSettings = continueUrl
      ? {
          url: continueUrl,
          handleCodeInApp: false
        }
      : undefined;

    await sendPasswordResetEmail(this.auth, email, actionSettings);
  }

  async updateUserProfile(user: User, profile: { displayName?: string; photoURL?: string }): Promise<void> {
    await updateProfile(user, profile);
  }

  async getIdToken(user: User, forceRefresh = false): Promise<string> {
    return user.getIdToken(forceRefresh);
  }

  async getIdTokenResult(user: User, forceRefresh = false): Promise<IdTokenResult> {
    return user.getIdTokenResult(forceRefresh);
  }
}

export type FirebaseAuthUser = User;
export type FirebaseAuthUnsubscribe = Unsubscribe;
export type FirebaseAuthCredential = UserCredential;
export type FirebaseIdTokenResult = IdTokenResult;
