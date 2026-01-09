import { DomainEvent, EventContext, toEventMetadata } from '../events/domain-event';
import { ModuleStatus, ModuleType } from '../value-objects/module-types';
import { WorkspaceType } from '../value-objects/workspace-type';
import { AccountId, ModuleKey } from '../types/identifiers';
import { WorkspaceId } from '../value-objects/workspace-id';

export interface WorkspaceSnapshot {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  modules: ModuleStatus[];
  createdAt: string;
  name?: string;
}

export interface ModuleToggledPayload {
  workspaceId: string;
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
      modules: input.modules ?? [],
      createdAt,
      name: input.name
    };

    const event: DomainEvent<WorkspaceSnapshot> = {
      eventType: 'WorkspaceCreated',
      aggregateId: snapshot.workspaceId.value,
      accountId: snapshot.accountId,
      workspaceId: snapshot.workspaceId.value,
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
      aggregateId: this.snapshot.workspaceId.value,
      accountId: this.snapshot.accountId,
      workspaceId: this.snapshot.workspaceId.value,
      moduleKey,
      payload: { workspaceId: this.snapshot.workspaceId.value, moduleKey, moduleType, enabled },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new WorkspaceAggregate(nextSnapshot), event };
  }

  get state(): WorkspaceSnapshot {
    return this.snapshot;
  }
}
