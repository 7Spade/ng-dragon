// ContextType represents the current user's operational context within the system.
// Determines which menu items, permissions, and workspace views are active.
export type ContextType = 'user' | 'organization' | 'team' | 'partner';

// ContextInfo holds metadata about the active context
export interface ContextInfo {
  type: ContextType;
  id: string | null; // workspace ID for org/team/partner, null for user context
  name?: string; // display name for context
}
