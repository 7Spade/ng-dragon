/**
 * Factory helper functions for workspace creation
 */
import { WorkspaceAggregate } from '@workspace-domain';
/**
 * Create workspace factory function
 */
export function createWorkspaceFactory(defaultActorId) {
    return (input) => {
        const context = {
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
export function buildWorkspaceFromData(data, actorId) {
    const modules = (data.modules ?? []).map(m => ({
        moduleKey: m.key,
        moduleType: m.type,
        enabled: m.enabled
    }));
    const members = (data.members ?? []).map(m => ({
        accountId: m.accountId,
        role: m.role ?? 'member',
        accountType: m.accountType ?? 'user'
    }));
    const input = {
        workspaceId: data.id,
        accountId: data.accountId,
        workspaceType: data.type ?? 'personal',
        name: data.name,
        ownerAccountId: data.ownerId ?? data.accountId,
        modules,
        members,
        createdAt: data.createdAt
    };
    const context = {
        actorId,
        occurredAt: data.createdAt ?? new Date().toISOString()
    };
    const { aggregate } = WorkspaceAggregate.create(input, context);
    return aggregate;
}
/**
 * Create workspace from snapshot
 */
export function createFromSnapshot(snapshot) {
    return new WorkspaceAggregate(snapshot);
}
/**
 * Clone workspace aggregate
 */
export function cloneWorkspace(aggregate) {
    return new WorkspaceAggregate(aggregate.state);
}
//# sourceMappingURL=factory.js.map