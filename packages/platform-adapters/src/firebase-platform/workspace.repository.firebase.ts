import { Workspace as WorkspacePort, WorkspaceRepositoryPort } from '@core-engine';
import { Workspace } from '@saas-domain';
import { WorkspaceCreatedEvent } from '@saas-domain';
import { TeamCreatedEvent } from '@saas-domain';
import { getCollection } from './firestore';

const WORKSPACES_COLLECTION = 'workspaces';
const EVENTS_COLLECTION = 'workspace-events';

export class WorkspaceRepositoryFirebase implements WorkspaceRepositoryPort {
  private readonly workspacesCollection = getCollection(WORKSPACES_COLLECTION);
  private readonly eventsCollection = getCollection(EVENTS_COLLECTION);

  async save(workspaceData: WorkspacePort): Promise<string> {
    // Check if this is a new organization creation or team addition
    const isNewOrganization = !workspaceData.teams || workspaceData.teams.length === 0;
    
    if (isNewOrganization && workspaceData.type === 'organization') {
      // Create workspace aggregate from data
      const { workspace, event } = Workspace.createOrganization({
        workspaceId: workspaceData.workspaceId,
        accountId: workspaceData.accountId,
        name: workspaceData.name,
        ownerUserId: workspaceData.ownerUserId
      });

      // Save workspace snapshot to Firestore
      await this.workspacesCollection.doc(workspace.workspaceId).set(workspace.toSnapshot());

      // Save domain event to Firestore
      await this.eventsCollection.doc().set(event);

      return workspace.workspaceId;
    } else {
      // This is an update (e.g., adding a team)
      // Save updated workspace snapshot to Firestore
      await this.workspacesCollection.doc(workspaceData.workspaceId).set({
        workspaceId: workspaceData.workspaceId,
        accountId: workspaceData.accountId,
        type: workspaceData.type,
        name: workspaceData.name,
        ownerUserId: workspaceData.ownerUserId,
        members: workspaceData.members,
        createdAt: workspaceData.createdAt,
        modules: workspaceData.modules || [],
        teams: workspaceData.teams || []
      });

      // If there are teams, emit team created event for the latest team
      if (workspaceData.teams && workspaceData.teams.length > 0) {
        const latestTeam = workspaceData.teams[workspaceData.teams.length - 1];
        const teamEvent: TeamCreatedEvent = {
          workspaceId: workspaceData.workspaceId,
          teamId: latestTeam.teamId,
          teamName: latestTeam.teamName,
          createdByUserId: workspaceData.ownerUserId, // This should be passed in workspaceData
          timestamp: latestTeam.createdAt
        };
        await this.eventsCollection.doc().set(teamEvent);
      }

      return workspaceData.workspaceId;
    }
  }

  async load(workspaceId: string): Promise<WorkspacePort | null> {
    const doc = await this.workspacesCollection.doc(workspaceId).get();
    
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      workspaceId: data.workspaceId,
      accountId: data.accountId,
      type: data.type,
      name: data.name,
      ownerUserId: data.ownerUserId,
      members: data.members || [],
      createdAt: data.createdAt,
      modules: data.modules || [],
      teams: data.teams || []
    };
  }
}
