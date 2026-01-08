import { App, AppOptions, getApps, initializeApp } from 'firebase-admin/app';

/**
 * Singleton firebase-admin App. We rely on platform default credentials
 * (ADC or metadata server). No env var wiring is required by design.
 */
export const getFirebaseAdminApp = (options?: AppOptions): App => {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }
  return initializeApp(options);
};
