import { toEventMetadata } from '../events/domain-event';
export class WorkspaceAggregate {
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    static create(input, context) {
        const createdAt = input.createdAt ?? new Date().toISOString();
        const snapshot = {
            workspaceId: input.workspaceId,
            accountId: input.accountId,
            workspaceType: input.workspaceType,
            modules: input.modules ?? [],
            createdAt,
            description: input.description,
            organizationId: input.organizationId,
            name: input.name
        };
        const event = {
            eventType: 'WorkspaceCreated',
            aggregateId: snapshot.workspaceId,
            accountId: snapshot.accountId,
            workspaceId: snapshot.workspaceId,
            payload: snapshot,
            metadata: toEventMetadata({ ...context, occurredAt: context.occurredAt ?? snapshot.createdAt }),
        };
        return { aggregate: new WorkspaceAggregate(snapshot), event };
    }
    toggleModule(moduleKey, moduleType, enabled, context) {
        const modules = this.snapshot.modules.filter((m) => m.moduleKey !== moduleKey);
        const nextModules = [...modules, { moduleKey, moduleType, enabled }];
        const nextSnapshot = { ...this.snapshot, modules: nextModules };
        const event = {
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
    get state() {
        return this.snapshot;
    }
}
//# sourceMappingURL=workspace.aggregate.js.map