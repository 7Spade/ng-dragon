import { WorkspaceType } from './workspace-type';

export type ContextType = 'user' | 'organization' | 'team' | 'partner' | 'project' | 'personal';

export interface ContextInfo {
  contextType: ContextType;
  contextId?: string;
  contextName?: string;
  workspaceType?: WorkspaceType;
  ownerAccountId?: string;
}
