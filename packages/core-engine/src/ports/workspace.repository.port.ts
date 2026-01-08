export interface Workspace {
  workspaceId: string;
  accountId: string;
  type: 'organization' | 'team' | 'project';
  name: string;
  ownerUserId: string;
  members: Array<{ userId: string; role: string }>;
  createdAt: string;
  modules?: any[];
  teams?: Array<{ teamId: string; teamName: string; createdAt: string }>;
}

export interface WorkspaceRepositoryPort {
  save(workspace: Workspace): Promise<string>;
  load(workspaceId: string): Promise<Workspace | null>;
}
