import { WorkspaceId } from '@account-domain';
import { WorkspaceRepository, WorkspaceSnapshot, WorkspaceCreatedEvent } from '@saas-domain';

import { getCollection } from './firestore';

const WORKSPACES_COLLECTION = 'workspaces';
const EVENTS_COLLECTION = 'workspace-events';

export class WorkspaceRepositoryFirebase implements WorkspaceRepository {
  private readonly workspacesCollection = getCollection<WorkspaceSnapshot>(WORKSPACES_COLLECTION);
  private readonly eventsCollection = getCollection<WorkspaceCreatedEvent>(EVENTS_COLLECTION);

  async appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void> {
    await this.eventsCollection.doc().set(event);
  }

  async saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    await this.workspacesCollection.doc(snapshot.workspaceId).set(snapshot);
  }

  async getWorkspaceSnapshot(workspaceId: WorkspaceId): Promise<WorkspaceSnapshot | null> {
    const doc = await this.workspacesCollection.doc(workspaceId).get();
    if (!doc.exists) return null;
    return doc.data() as WorkspaceSnapshot;
  }

  async listWorkspaces(): Promise<WorkspaceSnapshot[]> {
    const snapshot = await this.workspacesCollection.get();
    return snapshot.docs.map(doc => doc.data() as WorkspaceSnapshot);
  }
}
