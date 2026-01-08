import { AppCheck, VerifyAppCheckTokenResponse, getAppCheck } from 'firebase-admin/app-check';
import { getFirebaseAdminApp } from '../app/firebase.app';

const appCheck = (): AppCheck => getAppCheck(getFirebaseAdminApp());

export const verifyAppCheckToken = (token: string): Promise<VerifyAppCheckTokenResponse> =>
  appCheck().verifyToken(token);
