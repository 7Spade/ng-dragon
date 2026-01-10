/**
 * Modules Registry
 * 
 * 4 Base Modules for every Workspace:
 * 1. Identity/Members - Who is in this workspace?
 * 2. Access Control - Who can do what?
 * 3. Settings/Profile - What are workspace properties?
 * 4. Audit/Activity - What happened?
 */

// Identity/Members Module
export * from './identity';

// Access Control Module
export * from './access-control';

// Settings/Profile Module
export * from './settings';

// Audit/Activity Module
export * from './audit';
