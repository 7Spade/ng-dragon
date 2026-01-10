import { toEventMetadata } from '../events/domain-event';
export class ModuleRegistryAggregate {
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    static bootstrap(workspaceId) {
        return new ModuleRegistryAggregate({ workspaceId, modules: [] });
    }
    upsert(moduleKey, moduleType, enabled, context) {
        const modules = this.snapshot.modules.filter((m) => m.moduleKey !== moduleKey);
        const nextModule = { moduleKey, moduleType, enabled };
        const nextSnapshot = { ...this.snapshot, modules: [...modules, nextModule] };
        const event = {
            eventType: enabled ? 'ModuleEnabled' : 'ModuleDisabled',
            aggregateId: this.snapshot.workspaceId,
            workspaceId: this.snapshot.workspaceId,
            moduleKey,
            payload: nextModule,
            metadata: toEventMetadata(context),
        };
        return { aggregate: new ModuleRegistryAggregate(nextSnapshot), event };
    }
    get state() {
        return this.snapshot;
    }
}
//# sourceMappingURL=module-registry.aggregate.js.map