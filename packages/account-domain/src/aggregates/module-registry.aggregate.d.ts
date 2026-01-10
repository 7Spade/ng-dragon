import { DomainEvent, EventContext } from '../events/domain-event';
import { ModuleStatus, ModuleType } from '../value-objects/module-types';
import { ModuleKey, WorkspaceId } from '../types/identifiers';
export interface ModuleRegistrySnapshot {
    workspaceId: WorkspaceId;
    modules: ModuleStatus[];
}
export declare class ModuleRegistryAggregate {
    private readonly snapshot;
    constructor(snapshot: ModuleRegistrySnapshot);
    static bootstrap(workspaceId: WorkspaceId): ModuleRegistryAggregate;
    upsert(moduleKey: ModuleKey, moduleType: ModuleType, enabled: boolean, context: EventContext): {
        aggregate: ModuleRegistryAggregate;
        event: DomainEvent<ModuleStatus>;
    };
    get state(): ModuleRegistrySnapshot;
}
//# sourceMappingURL=module-registry.aggregate.d.ts.map