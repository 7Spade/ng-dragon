// Platform Adapters entrypoint
// DO NOT export firebase-admin based helpers here - they are server-only
// Frontend should use @angular/fire client SDK instead

// Only export client-safe adapters
export * from './src/ai';
export * from './src/external-apis';

// firebase-platform and persistence use firebase-admin (server-only)
// Import them explicitly from './server' if needed in backend code
