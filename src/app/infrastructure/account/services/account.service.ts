import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  docData,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable, switchMap } from 'rxjs';
import { Account, AccountType } from '@domain/account/entities/account.entity';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private firestore = inject(Firestore);
  private collectionName = 'accounts';

  createUserAccount(user: { uid: string; email?: string | null; displayName?: string | null }): Observable<void> {
    const docRef = doc(collection(this.firestore, this.collectionName), user.uid);
    const account: Account = {
      id: user.uid,
      type: AccountType.User,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        emailVerified: false,
      },
    };
    return from(setDoc(docRef, account));
  }

  getAccount(id: string): Observable<Account | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return docData(docRef, { idField: 'id' }).pipe(
      map((data) => (data ? (data as Account) : null))
    );
  }

  getUserAccounts(userId: string): Observable<Account[]> {
    const membershipsRef = collection(this.firestore, 'accountMemberships');
    const membershipQuery = query(membershipsRef, where('userId', '==', userId));

    return from(getDocs(membershipQuery)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data()['accountId'] as string)),
      switchMap((accountIds) =>
        from(
          Promise.all(
            accountIds.map((accountId) =>
              getDoc(doc(this.firestore, this.collectionName, accountId))
            )
          )
        )
      ),
      map((snapshots) =>
        snapshots
          .filter((snapshot) => snapshot.exists())
          .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() } as Account))
      )
    );
  }

  switchAccount(accountId: string): Observable<Account | null> {
    localStorage.setItem('currentAccountId', accountId);
    return this.getAccount(accountId);
  }

  getCurrentAccountId(): string | null {
    return localStorage.getItem('currentAccountId');
  }

  updateAccount(id: string, data: Partial<Account>): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(docRef, data));
  }
}
