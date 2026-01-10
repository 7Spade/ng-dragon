/**
 * Bootstrap utilities for workspace-domain
 */
import { WorkspaceAggregate, WorkspaceType, AccountId, WorkspaceId } from '@workspace-domain';
/**
 * Bootstrap configuration
 */
export interface BootstrapWorkspaceConfig {
    workspaceType: WorkspaceType;
    name?: string;
    accountId: AccountId;
    workspaceId?: WorkspaceId;
    actorId?: AccountId;
}
/**
 * Bootstrap a new workspace with default configuration
 */
export declare function bootstrapWorkspace(config: BootstrapWorkspaceConfig): WorkspaceAggregate;
/**
 * Create a personal workspace for an account
 */
export declare function createPersonalWorkspace(accountId: AccountId): WorkspaceAggregate;
/**
 * Create an organization workspace
 */
export declare function createOrganizationWorkspace(accountId: AccountId, organizationName: string, workspaceId?: WorkspaceId): WorkspaceAggregate;
/**
 * Create a team workspace
 */
export declare function createTeamWorkspace(accountId: AccountId, teamName: string, workspaceId?: WorkspaceId): WorkspaceAggregate;
/**
 * Initialize default workspace configuration
 */
export declare function initializeWorkspaceDefaults(): {
    defaultWorkspaceType: WorkspaceType;
    enablePersistence: boolean;
    persistenceKey: string;
};
//# sourceMappingURL=bootstrap.d.ts.map