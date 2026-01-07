import { AccountId, ModuleKey, WorkspaceId } from '@account-domain/src/types/identifiers';
import { OrganizationMemberRole } from '../value-objects/organization-roles';

export interface WorkspaceAccessSpecification {
  canAccess(workspaceId: WorkspaceId, actorId: AccountId): Promise<boolean>;
}

export interface ModuleEnabledSpecification {
  isEnabled(workspaceId: WorkspaceId, moduleKey: ModuleKey): Promise<boolean>;
}

export async function assertWorkspaceAccess(spec: WorkspaceAccessSpecification, workspaceId: WorkspaceId, actorId: AccountId): Promise<void> {
  const allowed = await spec.canAccess(workspaceId, actorId);
  if (!allowed) {
    throw new Error('Workspace access denied');
  }
}

export async function assertModuleEnabled(spec: ModuleEnabledSpecification, workspaceId: WorkspaceId, moduleKey: ModuleKey): Promise<void> {
  const enabled = await spec.isEnabled(workspaceId, moduleKey);
  if (!enabled) {
    throw new Error('Module is not enabled for this workspace');
  }
}

export function canManageOrganization(role?: OrganizationMemberRole): boolean {
  return role === 'owner' || role === 'admin';
}
