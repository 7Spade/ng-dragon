import { Firestore, getFirestore } from 'firebase-admin/firestore';

import { getFirebaseAdminApp } from '../app/firebase.app';

export const firestore = (): Firestore => getFirestore(getFirebaseAdminApp());

export const getCollection = <T = FirebaseFirestore.DocumentData>(collectionPath: string) =>
  firestore().collection(collectionPath) as FirebaseFirestore.CollectionReference<T>;
