import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
}

export interface WorkspaceSnapshot {
  workspaceId: string;
  accountId: string;
  type: 'organization' | 'team' | 'project';
  name: string;
  ownerUserId: string;
  members: WorkspaceMember[];
  createdAt: string;
  modules: any[];
}

export class Workspace {
  private constructor(
    public readonly workspaceId: string,
    public readonly accountId: string,
    public readonly type: 'organization' | 'team' | 'project',
    public readonly name: string,
    public readonly ownerUserId: string,
    public readonly members: WorkspaceMember[],
    public readonly createdAt: string,
    public readonly modules: any[] = []
  ) {}

  static createOrganization(props: {
    workspaceId: string;
    accountId: string;
    name: string;
    ownerUserId: string;
    modules?: any[];
    createdAt?: string;
  }): { workspace: Workspace; event: WorkspaceCreatedEvent } {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }

    const timestamp = props.createdAt ?? new Date().toISOString();

    const workspace = new Workspace(
      props.workspaceId,
      props.accountId,
      'organization',
      props.name.trim(),
      props.ownerUserId,
      [{ userId: props.ownerUserId, role: 'owner' }],
      timestamp,
      props.modules ?? []
    );

    const event: WorkspaceCreatedEvent = {
      workspaceId: props.workspaceId,
      accountId: props.accountId,
      type: 'organization',
      name: props.name.trim(),
      ownerUserId: props.ownerUserId,
      timestamp
    };

    return { workspace, event };
  }

  toSnapshot(): WorkspaceSnapshot {
    return {
      workspaceId: this.workspaceId,
      accountId: this.accountId,
      type: this.type,
      name: this.name,
      ownerUserId: this.ownerUserId,
      members: this.members,
      createdAt: this.createdAt,
      modules: this.modules
    };
  }
}
