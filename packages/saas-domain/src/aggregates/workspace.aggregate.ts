import { WorkspaceCreatedEvent } from '../events/workspace-created.event';
import { TeamCreatedEvent } from '../events/team-created.event';

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Team {
  teamId: string;
  teamName: string;
  createdAt: string;
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
    public readonly modules: any[] = [],
    public readonly teams: Team[] = []
  ) {}

  static createOrganization(props: {
    workspaceId: string;
    accountId: string;
    name: string;
    ownerUserId: string;
  }): { workspace: Workspace; event: WorkspaceCreatedEvent } {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }

    const timestamp = new Date().toISOString();

    // Create workspace with organization type
    const workspace = new Workspace(
      props.workspaceId,
      props.accountId,
      'organization',
      props.name.trim(),
      props.ownerUserId,
      [{ userId: props.ownerUserId, role: 'owner' }],
      timestamp,
      [],
      []
    );

    // Create domain event
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

  static fromSnapshot(snapshot: {
    workspaceId: string;
    accountId: string;
    type: 'organization' | 'team' | 'project';
    name: string;
    ownerUserId: string;
    members: WorkspaceMember[];
    createdAt: string;
    modules?: any[];
    teams?: Team[];
  }): Workspace {
    return new Workspace(
      snapshot.workspaceId,
      snapshot.accountId,
      snapshot.type,
      snapshot.name,
      snapshot.ownerUserId,
      snapshot.members,
      snapshot.createdAt,
      snapshot.modules || [],
      snapshot.teams || []
    );
  }

  addTeam(props: {
    teamId: string;
    teamName: string;
    createdByUserId: string;
  }): { workspace: Workspace; event: TeamCreatedEvent } {
    // Business rule: Only organization workspaces can have teams
    if (this.type !== 'organization') {
      throw new Error('Only organization workspaces can have teams');
    }

    // Validation
    if (!props.teamName || props.teamName.trim().length === 0) {
      throw new Error('Team name cannot be empty');
    }

    // Business rule: Only workspace members can create teams
    const isWorkspaceMember = this.members.some(m => m.userId === props.createdByUserId);
    if (!isWorkspaceMember) {
      throw new Error('Only workspace members can create teams');
    }

    // Check if team name already exists
    const teamExists = this.teams.some(t => t.teamName === props.teamName.trim());
    if (teamExists) {
      throw new Error('Team with this name already exists in the workspace');
    }

    const timestamp = new Date().toISOString();

    const newTeam: Team = {
      teamId: props.teamId,
      teamName: props.teamName.trim(),
      createdAt: timestamp
    };

    // Create new workspace with added team
    const updatedWorkspace = new Workspace(
      this.workspaceId,
      this.accountId,
      this.type,
      this.name,
      this.ownerUserId,
      this.members,
      this.createdAt,
      this.modules,
      [...this.teams, newTeam]
    );

    // Create domain event
    const event: TeamCreatedEvent = {
      workspaceId: this.workspaceId,
      teamId: props.teamId,
      teamName: props.teamName.trim(),
      createdByUserId: props.createdByUserId,
      timestamp
    };

    return { workspace: updatedWorkspace, event };
  }

  toSnapshot() {
    return {
      workspaceId: this.workspaceId,
      accountId: this.accountId,
      type: this.type,
      name: this.name,
      ownerUserId: this.ownerUserId,
      members: this.members,
      createdAt: this.createdAt,
      modules: this.modules,
      teams: this.teams
    };
  }
}
