import { Bucket } from '@google-cloud/storage';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '../app/firebase.app';

export const storage = (): Storage => getStorage(getFirebaseAdminApp());
export const defaultBucket = (): Bucket => storage().bucket();
