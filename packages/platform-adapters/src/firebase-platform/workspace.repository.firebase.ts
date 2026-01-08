import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { WorkspaceCreatedEvent } from '@saas-domain/src/events/WorkspaceCreatedEvent';
import { WorkspaceRepository } from '@saas-domain/src/repositories/WorkspaceRepository';
import { getCollection } from './firestore';

const EVENTS_COLLECTION = 'workspace-events';
const SNAPSHOTS_COLLECTION = 'workspaces';

export class WorkspaceRepositoryFirebase implements WorkspaceRepository {
  private readonly eventsCollection = getCollection<WorkspaceCreatedEvent>(EVENTS_COLLECTION);
  private readonly snapshotsCollection = getCollection<WorkspaceSnapshot>(SNAPSHOTS_COLLECTION);

  async appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void> {
    const docRef = this.eventsCollection.doc();
    await docRef.set({ ...event, aggregateId: event.workspaceId ?? event.aggregateId });
  }

  async saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    await this.snapshotsCollection.doc(snapshot.workspaceId).set(snapshot, { merge: true });
  }

  async getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const doc = await this.snapshotsCollection.doc(workspaceId).get();
    return doc.exists ? (doc.data() as WorkspaceSnapshot) : null;
  }

  async listWorkspaces(): Promise<WorkspaceSnapshot[]> {
    const snapshot = await this.snapshotsCollection.get();
    return snapshot.docs.map(doc => doc.data() as WorkspaceSnapshot);
  }
}
