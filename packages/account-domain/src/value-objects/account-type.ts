// AccountType enumerates actor identities that can own memberships or act in sessions.
// Actors are user or bot accounts; organization accounts map to workspaces, not actors.
export type AccountType = 'user' | 'bot' | 'organization';
