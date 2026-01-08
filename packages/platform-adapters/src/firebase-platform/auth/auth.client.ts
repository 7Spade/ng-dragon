import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '../app/firebase.app';

const auth = () => getAuth(getFirebaseAdminApp());

export const verifyIdToken = (token: string, checkRevoked = false) =>
  auth().verifyIdToken(token, checkRevoked);

export const createCustomToken = (uid: string, claims?: Record<string, unknown>) =>
  auth().createCustomToken(uid, claims);

export const setCustomUserClaims = (uid: string, claims: Record<string, unknown>) =>
  auth().setCustomUserClaims(uid, claims);
