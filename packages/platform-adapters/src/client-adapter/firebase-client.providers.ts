import { EnvironmentProviders, Provider } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getAuth, provideAuth as provideAuthAlias } from '@angular/fire/auth';
import { getDataConnect, provideDataConnect } from '@angular/fire/data-connect';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

const firebaseConfig = {
  projectId: 'elite-chiller-455712-c4',
  appId: '1:7807661688:web:0835c399c934321d1d1f8d',
  databaseURL: 'https://elite-chiller-455712-c4-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket: 'elite-chiller-455712-c4.firebasestorage.app',
  apiKey: 'AIzaSyCJ-eayGjJwBKsNIh3oEAG2GjbfTrvAMEI',
  authDomain: 'elite-chiller-455712-c4.firebaseapp.com',
  messagingSenderId: '7807661688',
  measurementId: 'G-W6KXBTP3YD'
};

export const FIREBASE_CLIENT_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideAuthAlias(() => getAuth()),
  provideAnalytics(() => getAnalytics()),
  ScreenTrackingService,
  UserTrackingService,
  provideAppCheck(() => {
    const provider = new ReCaptchaEnterpriseProvider('6LcGnSUsAAAAAMIm1aYeWqoYNEmLphGIbwEfWJlc');
    return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
  }),
  provideFirestore(() => getFirestore()),
  provideDatabase(() => getDatabase()),
  provideDataConnect(() => getDataConnect({ connector: 'example', location: 'asia-southeast1', service: 'ng-events' })),
  provideFunctions(() => getFunctions()),
  provideMessaging(() => getMessaging()),
  providePerformance(() => getPerformance()),
  provideStorage(() => getStorage()),
  provideRemoteConfig(() => getRemoteConfig()),
  provideVertexAI(() => getVertexAI())
];

export { firebaseConfig as FIREBASE_CLIENT_CONFIG };
