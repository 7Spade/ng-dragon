/**
 * Bootstrap utilities for workspace-domain
 */

import {
  WorkspaceAggregate,
  WorkspaceCreationInput,
  WorkspaceType,
  AccountId,
  WorkspaceId,
  EventContext
} from '@workspace-domain';

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
export function bootstrapWorkspace(config: BootstrapWorkspaceConfig): WorkspaceAggregate {
  const workspaceId = config.workspaceId ?? `${config.workspaceType}-${config.accountId}`;
  const actorId = config.actorId ?? config.accountId;

  const input: WorkspaceCreationInput = {
    workspaceId,
    accountId: config.accountId,
    workspaceType: config.workspaceType,
    name: config.name,
    ownerAccountId: config.accountId,
    ownerAccountType: 'user'
  };

  const context: EventContext = {
    actorId,
    occurredAt: new Date().toISOString()
  };

  const { aggregate } = WorkspaceAggregate.create(input, context);
  return aggregate;
}

/**
 * Create a personal workspace for an account
 */
export function createPersonalWorkspace(accountId: AccountId): WorkspaceAggregate {
  return bootstrapWorkspace({
    workspaceType: 'personal',
    accountId,
    name: 'Personal'
  });
}

/**
 * Create an organization workspace
 */
export function createOrganizationWorkspace(
  accountId: AccountId,
  organizationName: string,
  workspaceId?: WorkspaceId
): WorkspaceAggregate {
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
export function createTeamWorkspace(
  accountId: AccountId,
  teamName: string,
  workspaceId?: WorkspaceId
): WorkspaceAggregate {
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
    defaultWorkspaceType: 'personal' as WorkspaceType,
    enablePersistence: true,
    persistenceKey: 'workspace.active'
  };
}
