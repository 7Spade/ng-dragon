/**
 * Workspace Aggregate
 * Core domain entity for workspace management
 */

import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';
import { WorkspaceType } from '../value-objects/workspace-type';
import { MemberRole } from '../value-objects/member-role';
import { ModuleStatus, ModuleType } from '../value-objects/module-status';

/**
 * Workspace member
 */
export interface WorkspaceMember {
  accountId: AccountId;
  role: MemberRole;
  accountType: 'user' | 'service';
}

/**
 * Workspace snapshot - immutable state representation
 */
export interface WorkspaceSnapshot {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  modules: ModuleStatus[];
  createdAt: string;
  name?: string;
  members: WorkspaceMember[];
  ownerAccountId?: AccountId;
  memberIds?: AccountId[];
}

/**
 * Input for creating a new workspace
 */
export interface WorkspaceCreationInput {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  createdAt?: string;
  modules?: ModuleStatus[];
  name?: string;
  members?: WorkspaceMember[];
  ownerAccountId?: AccountId;
  ownerAccountType?: 'user' | 'service';
  memberIds?: AccountId[];
}

/**
 * Domain event for workspace creation
 */
export interface WorkspaceCreatedEvent {
  eventType: 'WorkspaceCreated';
  aggregateId: WorkspaceId;
  accountId: AccountId;
  workspaceId: WorkspaceId;
  payload: WorkspaceSnapshot;
  metadata: {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
}

/**
 * Domain event for module toggle
 */
export interface ModuleToggledEvent {
  eventType: 'ModuleEnabled' | 'ModuleDisabled';
  aggregateId: WorkspaceId;
  accountId: AccountId;
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  payload: {
    workspaceId: WorkspaceId;
    moduleKey: ModuleKey;
    moduleType: ModuleType;
    enabled: boolean;
  };
  metadata: {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
}

/**
 * Event context for domain events
 */
export interface EventContext {
  actorId: AccountId;
  traceId?: string;
  causedBy?: string[];
  occurredAt?: string;
}

/**
 * Workspace Aggregate
 * Encapsulates workspace state and business rules
 */
export class WorkspaceAggregate {
  constructor(private readonly snapshot: WorkspaceSnapshot) {}

  /**
   * Create a new workspace aggregate
   */
  static create(
    input: WorkspaceCreationInput,
    context: EventContext
  ): {
    aggregate: WorkspaceAggregate;
    event: WorkspaceCreatedEvent;
  } {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const ownerAccountId = input.ownerAccountId ?? input.accountId;
    const ownerAccountType = input.ownerAccountType ?? 'user';
    const members = input.members ?? (ownerAccountId ? [{ accountId: ownerAccountId, role: 'owner' as MemberRole, accountType: ownerAccountType }] : []);
    const memberIds = members.map(member => member.accountId);

    const snapshot: WorkspaceSnapshot = {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      workspaceType: input.workspaceType,
      modules: input.modules ?? [],
      createdAt,
      name: input.name,
      members,
      ownerAccountId,
      memberIds
    };

    const event: WorkspaceCreatedEvent = {
      eventType: 'WorkspaceCreated',
      aggregateId: snapshot.workspaceId,
      accountId: snapshot.accountId,
      workspaceId: snapshot.workspaceId,
      payload: snapshot,
      metadata: {
        actorId: context.actorId,
        traceId: context.traceId,
        causedBy: context.causedBy,
        occurredAt: context.occurredAt ?? createdAt
      }
    };

    return { aggregate: new WorkspaceAggregate(snapshot), event };
  }

  /**
   * Toggle module enablement
   */
  toggleModule(
    moduleKey: ModuleKey,
    moduleType: ModuleType,
    enabled: boolean,
    context: EventContext
  ): {
    aggregate: WorkspaceAggregate;
    event: ModuleToggledEvent;
  } {
    const modules = this.snapshot.modules.filter(m => m.moduleKey !== moduleKey);
    const nextModules: ModuleStatus[] = [...modules, { moduleKey, moduleType, enabled }];
    const nextSnapshot: WorkspaceSnapshot = { ...this.snapshot, modules: nextModules };

    const event: ModuleToggledEvent = {
      eventType: enabled ? 'ModuleEnabled' : 'ModuleDisabled',
      aggregateId: this.snapshot.workspaceId,
      accountId: this.snapshot.accountId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey,
      payload: { workspaceId: this.snapshot.workspaceId, moduleKey, moduleType, enabled },
      metadata: {
        actorId: context.actorId,
        traceId: context.traceId,
        causedBy: context.causedBy,
        occurredAt: context.occurredAt ?? new Date().toISOString()
      }
    };

    return { aggregate: new WorkspaceAggregate(nextSnapshot), event };
  }

  /**
   * Get current workspace state
   */
  get state(): WorkspaceSnapshot {
    return this.snapshot;
  }

  /**
   * Get workspace ID
   */
  get id(): WorkspaceId {
    return this.snapshot.workspaceId;
  }

  /**
   * Get workspace type
   */
  get type(): WorkspaceType {
    return this.snapshot.workspaceType;
  }

  /**
   * Get workspace name
   */
  get name(): string | undefined {
    return this.snapshot.name;
  }

  /**
   * Check if a member exists in the workspace
   */
  hasMember(accountId: AccountId): boolean {
    return this.snapshot.memberIds?.includes(accountId) ?? false;
  }

  /**
   * Get member role
   */
  getMemberRole(accountId: AccountId): MemberRole | null {
    const member = this.snapshot.members.find(m => m.accountId === accountId);
    return member?.role ?? null;
  }
}
