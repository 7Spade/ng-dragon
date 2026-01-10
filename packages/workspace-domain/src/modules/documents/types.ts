/**
 * Documents Module Types
 * Provides types for document management
 */

import { WorkspaceId, AccountId } from '../../types/identifiers';

/**
 * Document status
 */
export type DocumentStatus = 'draft' | 'published' | 'archived';

/**
 * Document visibility
 */
export type DocumentVisibility = 'private' | 'workspace' | 'public';

/**
 * Document input for creation
 */
export interface DocumentInput {
  title: string;
  content?: string;
  status?: DocumentStatus;
  visibility?: DocumentVisibility;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Document entity
 */
export interface Document {
  documentId: string;
  workspaceId: WorkspaceId;
  title: string;
  content?: string;
  status: DocumentStatus;
  visibility: DocumentVisibility;
  tags: string[];
  metadata: Record<string, any>;
  createdBy: AccountId;
  createdAt: string;
  updatedAt: string;
  version: number;
}

/**
 * Document query options
 */
export interface DocumentQueryOptions {
  status?: DocumentStatus;
  visibility?: DocumentVisibility;
  tags?: string[];
  limit?: number;
  offset?: number;
}
