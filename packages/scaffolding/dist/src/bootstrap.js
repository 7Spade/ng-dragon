/**
 * Bootstrap utilities for workspace-domain
 */
import { WorkspaceAggregate } from '@workspace-domain';
/**
 * Bootstrap a new workspace with default configuration
 */
export function bootstrapWorkspace(config) {
    const workspaceId = config.workspaceId ?? `${config.workspaceType}-${config.accountId}`;
    const actorId = config.actorId ?? config.accountId;
    const input = {
        workspaceId,
        accountId: config.accountId,
        workspaceType: config.workspaceType,
        name: config.name,
        ownerAccountId: config.accountId,
        ownerAccountType: 'user'
    };
    const context = {
        actorId,
        occurredAt: new Date().toISOString()
    };
    const { aggregate } = WorkspaceAggregate.create(input, context);
    return aggregate;
}
/**
 * Create a personal workspace for an account
 */
export function createPersonalWorkspace(accountId) {
    return bootstrapWorkspace({
        workspaceType: 'personal',
        accountId,
        name: 'Personal'
    });
}
/**
 * Create an organization workspace
 */
export function createOrganizationWorkspace(accountId, organizationName, workspaceId) {
    return bootstrapWorkspace({
        workspaceType: 'organization',
        accountId,
        name: organizationName,
        workspaceId
    });
}
/**
 * Create a team workspace
 */
export function createTeamWorkspace(accountId, teamName, workspaceId) {
    return bootstrapWorkspace({
        workspaceType: 'team',
        accountId,
        name: teamName,
        workspaceId
    });
}
/**
 * Initialize default workspace configuration
 */
export function initializeWorkspaceDefaults() {
    return {
        defaultWorkspaceType: 'personal',
        enablePersistence: true,
        persistenceKey: 'workspace.active'
    };
}
//# sourceMappingURL=bootstrap.js.map