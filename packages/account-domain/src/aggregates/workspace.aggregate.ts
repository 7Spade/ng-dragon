import { DomainEvent, EventContext, toEventMetadata } from '../events/domain-event';
import { ModuleStatus, ModuleType } from '../value-objects/module-types';
import { WorkspaceType } from '../value-objects/workspace-type';
import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';

export interface WorkspaceSnapshot {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  displayName: string;
  modules: ModuleStatus[];
  createdAt: string;
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
  displayName: string;
  createdAt?: string;
  modules?: ModuleStatus[];
}

export class WorkspaceAggregate {
  constructor(private readonly snapshot: WorkspaceSnapshot) {}

  static create(input: WorkspaceCreationInput, context: EventContext): {
    aggregate: WorkspaceAggregate;
    event: DomainEvent<WorkspaceSnapshot>;
  } {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const snapshot: WorkspaceSnapshot = {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      workspaceType: input.workspaceType,
      displayName: input.displayName,
      modules: input.modules ?? [],
      createdAt,
    };

    const event: DomainEvent<WorkspaceSnapshot> = {
      eventType: 'WorkspaceCreated',
      aggregateId: snapshot.workspaceId,
      accountId: snapshot.accountId,
      workspaceId: snapshot.workspaceId,
      payload: snapshot,
      metadata: toEventMetadata({ ...context, occurredAt: context.occurredAt ?? snapshot.createdAt }),
    };

    return { aggregate: new WorkspaceAggregate(snapshot), event };
  }

  toggleModule(moduleKey: ModuleKey, moduleType: ModuleType, enabled: boolean, context: EventContext): {
    aggregate: WorkspaceAggregate;
    event: DomainEvent<ModuleToggledPayload>;
  } {
    const modules = this.snapshot.modules.filter((m) => m.moduleKey !== moduleKey);
    const nextModules: ModuleStatus[] = [...modules, { moduleKey, moduleType, enabled }];
    const nextSnapshot: WorkspaceSnapshot = { ...this.snapshot, modules: nextModules };

    const event: DomainEvent<ModuleToggledPayload> = {
      eventType: enabled ? 'ModuleEnabled' : 'ModuleDisabled',
      aggregateId: this.snapshot.workspaceId,
      accountId: this.snapshot.accountId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey,
      payload: { workspaceId: this.snapshot.workspaceId, moduleKey, moduleType, enabled },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new WorkspaceAggregate(nextSnapshot), event };
  }

  get state(): WorkspaceSnapshot {
    return this.snapshot;
  }
}
