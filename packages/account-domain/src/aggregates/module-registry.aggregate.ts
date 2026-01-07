import { DomainEvent, EventContext, toEventMetadata } from '../events/domain-event';
import { ModuleStatus, ModuleType } from '../value-objects/module-types';
import { ModuleKey, WorkspaceId } from '../types/identifiers';

export interface ModuleRegistrySnapshot {
  workspaceId: WorkspaceId;
  modules: ModuleStatus[];
}

export class ModuleRegistryAggregate {
  constructor(private readonly snapshot: ModuleRegistrySnapshot) {}

  static bootstrap(workspaceId: WorkspaceId): ModuleRegistryAggregate {
    return new ModuleRegistryAggregate({ workspaceId, modules: [] });
  }

  upsert(moduleKey: ModuleKey, moduleType: ModuleType, enabled: boolean, context: EventContext): {
    aggregate: ModuleRegistryAggregate;
    event: DomainEvent<ModuleStatus>;
  } {
    const modules = this.snapshot.modules.filter((m) => m.moduleKey !== moduleKey);
    const nextModule: ModuleStatus = { moduleKey, moduleType, enabled };
    const nextSnapshot: ModuleRegistrySnapshot = { ...this.snapshot, modules: [...modules, nextModule] };

    const event: DomainEvent<ModuleStatus> = {
      eventType: enabled ? 'ModuleEnabled' : 'ModuleDisabled',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey,
      payload: nextModule,
      metadata: toEventMetadata(context),
    };

    return { aggregate: new ModuleRegistryAggregate(nextSnapshot), event };
  }

  get state(): ModuleRegistrySnapshot {
    return this.snapshot;
  }
}
