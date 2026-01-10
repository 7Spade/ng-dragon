/**
 * Workspace Aggregate
 * Core domain entity for workspace management
 */
/**
 * Workspace Aggregate
 * Encapsulates workspace state and business rules
 */
export class WorkspaceAggregate {
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * Create a new workspace aggregate
     */
    static create(input, context) {
        const createdAt = input.createdAt ?? new Date().toISOString();
        const ownerAccountId = input.ownerAccountId ?? input.accountId;
        const ownerAccountType = input.ownerAccountType ?? 'user';
        const members = input.members ?? (ownerAccountId ? [{ accountId: ownerAccountId, role: 'owner', accountType: ownerAccountType }] : []);
        const memberIds = members.map(member => member.accountId);
        const snapshot = {
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
        const event = {
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
    toggleModule(moduleKey, moduleType, enabled, context) {
        const modules = this.snapshot.modules.filter(m => m.moduleKey !== moduleKey);
        const nextModules = [...modules, { moduleKey, moduleType, enabled }];
        const nextSnapshot = { ...this.snapshot, modules: nextModules };
        const event = {
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
    get state() {
        return this.snapshot;
    }
    /**
     * Get workspace ID
     */
    get id() {
        return this.snapshot.workspaceId;
    }
    /**
     * Get workspace type
     */
    get type() {
        return this.snapshot.workspaceType;
    }
    /**
     * Get workspace name
     */
    get name() {
        return this.snapshot.name;
    }
    /**
     * Check if a member exists in the workspace
     */
    hasMember(accountId) {
        return this.snapshot.memberIds?.includes(accountId) ?? false;
    }
    /**
     * Get member role
     */
    getMemberRole(accountId) {
        const member = this.snapshot.members.find(m => m.accountId === accountId);
        return member?.role ?? null;
    }
}
//# sourceMappingURL=workspace.aggregate.js.map