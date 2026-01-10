/**
 * Workspace Repository Interface
 * Port for workspace persistence operations
 */

import { WorkspaceId, AccountId } from '../types/identifiers';
import { WorkspaceSnapshot, WorkspaceCreatedEvent, ModuleToggledEvent } from '../aggregates/workspace.aggregate';

/**
 * Generic workspace event type
 */
export type WorkspaceEvent = WorkspaceCreatedEvent | ModuleToggledEvent | {
  eventType: string;
  aggregateId: string;
  payload: unknown;
  metadata: {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
  accountId?: AccountId;
  workspaceId?: WorkspaceId;
  moduleKey?: string;
};

/**
 * Workspace repository port
 * Infrastructure implementations should implement this interface
 */
export interface WorkspaceRepository {
  /**
   * Append an event to the workspace event stream
   */
  appendWorkspaceEvent(event: WorkspaceEvent): Promise<void>;

  /**
   * Save workspace snapshot
   */
  saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;

  /**
   * Get workspace snapshot by ID
   */
  getWorkspaceSnapshot(workspaceId: WorkspaceId): Promise<WorkspaceSnapshot | null>;

  /**
   * List all workspaces
   */
  listWorkspaces(): Promise<WorkspaceSnapshot[]>;

  /**
   * List workspaces for a specific account
   */
  listWorkspacesByAccount(accountId: AccountId): Promise<WorkspaceSnapshot[]>;

  /**
   * List workspaces where account is a member
   */
  listWorkspacesByMembership(accountId: AccountId): Promise<WorkspaceSnapshot[]>;
}
