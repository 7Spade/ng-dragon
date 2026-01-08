import { AppCheck, AppCheckTokenResult, getAppCheck } from 'firebase-admin/app-check';
import { getFirebaseAdminApp } from '../app/firebase.app';

const appCheck = (): AppCheck => getAppCheck(getFirebaseAdminApp());

export const verifyAppCheckToken = (token: string): Promise<AppCheckTokenResult> =>
  appCheck().verifyToken(token);
