export type WorkspaceScope = 'user' | 'organization' | 'team' | 'partner';

export interface Workspace {
  id: string;
  name: string;
  scope: WorkspaceScope;
  contextId: string;
  ownerId: string;
  capabilities: string[];
}

export interface WorkspaceSettings {
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  defaultWorkspaceId: string | null;
  preferences: Record<string, boolean>;
}

export interface DocumentAsset {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
  contentType: string;
  uploadedAt: number;
  workspaceId: string;
  uploadedBy: string;
}

export interface AuditEntry {
  id: string;
  workspaceId: string;
  actor: string;
  action: string;
  target: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface JournalEntry {
  id: string;
  workspaceId: string;
  author: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export type Capability =
  | 'documents:read'
  | 'documents:write'
  | 'settings:write'
  | 'audit:read'
  | 'journal:write'
  | 'permissions:manage';

export interface RoleMatrixRow {
  role: string;
  capabilities: Capability[];
  description?: string;
}
