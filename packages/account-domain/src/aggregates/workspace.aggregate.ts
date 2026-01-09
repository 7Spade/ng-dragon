import { DomainEvent, EventContext, toEventMetadata } from '../events/domain-event';
import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';
import { AccountType } from '../value-objects/account-type';
import { MemberRole } from '../value-objects/member-role';
import { ModuleStatus, ModuleType } from '../value-objects/module-types';
import { WorkspaceType } from '../value-objects/workspace-type';

export interface WorkspaceMember {
  accountId: AccountId;
  role: MemberRole;
  accountType: AccountType;
}

export interface WorkspaceSnapshot {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  modules: ModuleStatus[];
  createdAt: string;
  name?: string;
  members: WorkspaceMember[];
  ownerAccountId?: AccountId;
}

export interface ModuleToggledPayload {
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  moduleType: ModuleType;
  enabled: boolean;
}

export interface WorkspaceCreationInput {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  createdAt?: string;
  modules?: ModuleStatus[];
  name?: string;
  members?: WorkspaceMember[];
  ownerAccountId?: AccountId;
  ownerAccountType?: AccountType;
}

export class WorkspaceAggregate {
  constructor(private readonly snapshot: WorkspaceSnapshot) {}

  static create(
    input: WorkspaceCreationInput,
    context: EventContext
  ): {
    aggregate: WorkspaceAggregate;
    event: DomainEvent<WorkspaceSnapshot>;
  } {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const ownerAccountId = input.ownerAccountId ?? input.accountId;
    const ownerAccountType = input.ownerAccountType ?? 'user';
    const members = input.members ?? (ownerAccountId ? [{ accountId: ownerAccountId, role: 'owner', accountType: ownerAccountType }] : []);

    const snapshot: WorkspaceSnapshot = {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      workspaceType: input.workspaceType,
      modules: input.modules ?? [],
      createdAt,
      name: input.name,
      members,
      ownerAccountId
    };

    const event: DomainEvent<WorkspaceSnapshot> = {
      eventType: 'WorkspaceCreated',
      aggregateId: snapshot.workspaceId,
      accountId: snapshot.accountId,
      workspaceId: snapshot.workspaceId,
      payload: snapshot,
      metadata: toEventMetadata({ ...context, occurredAt: context.occurredAt ?? snapshot.createdAt })
    };

    return { aggregate: new WorkspaceAggregate(snapshot), event };
  }

  toggleModule(
    moduleKey: ModuleKey,
    moduleType: ModuleType,
    enabled: boolean,
    context: EventContext
  ): {
    aggregate: WorkspaceAggregate;
    event: DomainEvent<ModuleToggledPayload>;
  } {
    const modules = this.snapshot.modules.filter(m => m.moduleKey !== moduleKey);
    const nextModules: ModuleStatus[] = [...modules, { moduleKey, moduleType, enabled }];
    const nextSnapshot: WorkspaceSnapshot = { ...this.snapshot, modules: nextModules };

    const event: DomainEvent<ModuleToggledPayload> = {
      eventType: enabled ? 'ModuleEnabled' : 'ModuleDisabled',
      aggregateId: this.snapshot.workspaceId,
      accountId: this.snapshot.accountId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey,
      payload: { workspaceId: this.snapshot.workspaceId, moduleKey, moduleType, enabled },
      metadata: toEventMetadata(context)
    };

    return { aggregate: new WorkspaceAggregate(nextSnapshot), event };
  }

  get state(): WorkspaceSnapshot {
    return this.snapshot;
  }
}
