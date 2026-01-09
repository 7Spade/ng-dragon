export * from './i18n/i18n.service';
export * from './net/index';
export * from './startup/startup.service';
export * from './start-page.guard';
export * from './auth/firebase-auth-bridge.service';

// 🔄 Re-export FirebaseAuthAdapter from platform-adapters for backward compatibility
// Original: './auth/firebase-auth-bridge.service'
// New location: '@platform-adapters/firebase/angular-fire'
export * from './context/context.service';
