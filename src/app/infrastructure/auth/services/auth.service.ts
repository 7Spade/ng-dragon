import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  authState,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, combineLatest, from, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private demoUser = new BehaviorSubject<User | null>(this.loadDemoUser());

  private isDemoAuthEnabled(): boolean {
    return !environment.production;
  }

  private loadDemoUser(): User | null {
    if (!this.isDemoAuthEnabled()) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('demo-auth');
      }
      return null;
    }
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('demo-auth');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { uid: string; email: string; displayName: string };
      return {
        uid: parsed.uid,
        email: parsed.email,
        displayName: parsed.displayName,
        photoURL: null,
      } as User;
    } catch {
      window.localStorage.removeItem('demo-auth');
      return null;
    }
  }

  private persistDemoUser(user: User | null): void {
    if (!this.isDemoAuthEnabled()) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('demo-auth');
      }
      return;
    }
    if (typeof window === 'undefined') return;
    if (!user) {
      window.localStorage.removeItem('demo-auth');
      return;
    }
    window.localStorage.setItem(
      'demo-auth',
      JSON.stringify({
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? 'Demo User',
      })
    );
  }

  /**
   * Observable of the current authentication state
   */
  get authState$(): Observable<User | null> {
    return combineLatest([authState(this.auth), this.demoUser]).pipe(
      map(([firebaseUser, demoUser]) => demoUser ?? firebaseUser)
    );
  }

  /**
   * Sign in with email and password
   */
  login(email: string, password: string): Observable<User> {
    if (this.isDemoAuthEnabled() && email === 'demo@test.com' && password === '123123') {
      const demo = {
        uid: 'demo-user',
        email,
        displayName: 'Demo User',
        photoURL: null,
      } as User;
      this.demoUser.next(demo);
      this.persistDemoUser(demo);
      return of(demo);
    }
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(
        (credential) => credential.user
      )
    );
  }

  /**
   * Register a new user with email and password
   */
  register(email: string, password: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (credential) => credential.user
      )
    );
  }

  /**
   * Send password reset email
   */
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  verifyEmail(user: User): Observable<void> {
    return from(sendEmailVerification(user));
  }

  /**
   * Sign out the current user
   */
  logout(): Observable<void> {
    this.demoUser.next(null);
    this.persistDemoUser(null);
    return from(signOut(this.auth));
  }
}
