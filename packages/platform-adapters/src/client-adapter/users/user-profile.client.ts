import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

export interface UserProfile {
  name?: string;
  avatar?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class UserProfileClient {
  private readonly firestore = inject(Firestore);

  async getUserProfile(uid: string): Promise<UserProfile> {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    return {};
  }

  async saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
    const docRef = doc(this.firestore, 'users', uid);
    await setDoc(docRef, profile, { merge: true });
  }
}
