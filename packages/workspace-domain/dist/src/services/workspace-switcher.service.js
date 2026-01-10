/**
 * Workspace Switcher Service
 * Abstract domain service for workspace switching logic
 */
/**
 * Abstract workspace switcher service
 * Domain service for managing workspace selection and switching
 */
export class WorkspaceSwitcher {
}
/**
 * Workspace switcher utilities
 */
export class WorkspaceSwitcherUtils {
    /**
     * Convert workspace snapshot to view
     */
    static snapshotToView(snapshot) {
        return {
            id: snapshot.workspaceId,
            workspaceId: snapshot.workspaceId,
            accountId: snapshot.accountId,
            workspaceType: snapshot.workspaceType,
            name: snapshot.name,
            ownerAccountId: snapshot.ownerAccountId,
            memberIds: snapshot.memberIds,
            modules: snapshot.modules,
            members: snapshot.members.map(m => ({
                accountId: m.accountId,
                role: m.role,
                accountType: m.accountType
            })),
            createdAt: snapshot.createdAt
        };
    }
    /**
     * Filter workspaces by type
     */
    static filterByType(workspaces, type) {
        return workspaces.filter(ws => ws.workspaceType === type);
    }
    /**
     * Filter workspaces owned by account
     */
    static filterOwnedBy(workspaces, accountId) {
        return workspaces.filter(ws => ws.ownerAccountId === accountId);
    }
    /**
     * Filter workspaces where account is member
     */
    static filterMemberships(workspaces, accountId) {
        return workspaces.filter(ws => ws.memberIds?.includes(accountId));
    }
    /**
     * Pick default workspace from list
     */
    static pickDefaultWorkspace(workspaces, accountId) {
        if (!workspaces.length)
            return null;
        // Priority: owned organization > joined organization > first available
        const ownedOrg = workspaces.find(ws => ws.workspaceType === 'organization' && ws.ownerAccountId === accountId);
        if (ownedOrg)
            return ownedOrg;
        const joinedOrg = workspaces.find(ws => ws.workspaceType === 'organization');
        if (joinedOrg)
            return joinedOrg;
        return workspaces[0] ?? null;
    }
}
//# sourceMappingURL=workspace-switcher.service.js.map