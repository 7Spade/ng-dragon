import { Workspace as WorkspacePort, WorkspaceRepositoryPort } from '../../../core-engine/src/ports/workspace.repository.port';
import { Workspace } from '../../../saas-domain/src/aggregates/workspace.aggregate';
import { WorkspaceCreatedEvent } from '../../../saas-domain/src/events/workspace-created.event';
import { getCollection } from './firestore';

const WORKSPACES_COLLECTION = 'workspaces';
const EVENTS_COLLECTION = 'workspace-events';

export class WorkspaceRepositoryFirebase implements WorkspaceRepositoryPort {
  private readonly workspacesCollection = getCollection(WORKSPACES_COLLECTION);
  private readonly eventsCollection = getCollection(EVENTS_COLLECTION);

  async save(workspaceData: WorkspacePort): Promise<string> {
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
  }
}
