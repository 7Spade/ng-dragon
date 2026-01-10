/**
 * Factory helper functions for workspace creation
 */

import {
  WorkspaceAggregate,
  WorkspaceSnapshot,
  WorkspaceCreationInput,
  WorkspaceType,
  AccountId,
  WorkspaceId,
  EventContext,
  ModuleStatus
} from '@workspace-domain';

/**
 * Raw workspace data (e.g., from API or database)
 */
export interface RawWorkspaceData {
  id: string;
  accountId: string;
  type: string;
  name?: string;
  ownerId?: string;
  members?: Array<{ accountId: string; role: string; accountType?: string }>;
  modules?: Array<{ key: string; type: string; enabled: boolean }>;
  createdAt?: string;
}

/**
 * Create workspace factory function
 */
export function createWorkspaceFactory(defaultActorId: AccountId) {
  return (input: WorkspaceCreationInput): WorkspaceAggregate => {
    const context: EventContext = {
      actorId: defaultActorId,
      occurredAt: new Date().toISOString()
    };

    const { aggregate } = WorkspaceAggregate.create(input, context);
    return aggregate;
  };
}

/**
 * Build workspace aggregate from raw data
 */
export function buildWorkspaceFromData(
  data: RawWorkspaceData,
  actorId: AccountId
): WorkspaceAggregate {
  const modules: ModuleStatus[] = (data.modules ?? []).map(m => ({
    moduleKey: m.key,
    moduleType: m.type,
    enabled: m.enabled
  }));

  const members = (data.members ?? []).map(m => ({
    accountId: m.accountId,
    role: (m.role as any) ?? 'member',
    accountType: (m.accountType as any) ?? 'user'
  }));

  const input: WorkspaceCreationInput = {
    workspaceId: data.id,
    accountId: data.accountId,
    workspaceType: (data.type as WorkspaceType) ?? 'personal',
    name: data.name,
    ownerAccountId: data.ownerId ?? data.accountId,
    modules,
    members,
    createdAt: data.createdAt
  };

  const context: EventContext = {
    actorId,
    occurredAt: data.createdAt ?? new Date().toISOString()
  };

  const { aggregate } = WorkspaceAggregate.create(input, context);
  return aggregate;
}

/**
 * Create workspace from snapshot
 */
export function createFromSnapshot(snapshot: WorkspaceSnapshot): WorkspaceAggregate {
  return new WorkspaceAggregate(snapshot);
}

/**
 * Clone workspace aggregate
 */
export function cloneWorkspace(aggregate: WorkspaceAggregate): WorkspaceAggregate {
  return new WorkspaceAggregate(aggregate.state);
}
