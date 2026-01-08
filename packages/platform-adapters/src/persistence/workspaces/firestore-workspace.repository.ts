import { WorkspaceRepository } from '@core-engine/src/ports/workspace.repository';
import { DomainEvent } from '@account-domain/src/events/domain-event';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { getCollection } from '../../firebase-platform/firestore';

const EVENTS_COLLECTION = 'workspace-events';
const SNAPSHOTS_COLLECTION = 'workspaces';

export class FirestoreWorkspaceRepository implements WorkspaceRepository {
  private eventsCollection = getCollection<DomainEvent<unknown>>(EVENTS_COLLECTION);
  private snapshotsCollection = getCollection<WorkspaceSnapshot>(SNAPSHOTS_COLLECTION);

  async appendEvents(workspaceId: string, events: DomainEvent<unknown>[]): Promise<void> {
    if (!events.length) return;
    const batch = this.eventsCollection.firestore.batch();

    events.forEach(event => {
      const docRef = this.eventsCollection.doc();
      batch.set(docRef, { ...event, aggregateId: workspaceId });
    });

    await batch.commit();
  }

  async loadEvents(workspaceId: string): Promise<DomainEvent<unknown>[]> {
    const snapshot = await this.eventsCollection
      .where('aggregateId', '==', workspaceId)
      .orderBy('metadata.occurredAt')
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  async saveSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    await this.snapshotsCollection.doc(snapshot.workspaceId).set(snapshot, { merge: true });
  }

  async getSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const doc = await this.snapshotsCollection.doc(workspaceId).get();
    return doc.exists ? (doc.data() as WorkspaceSnapshot) : null;
  }

  async list(): Promise<WorkspaceSnapshot[]> {
    const snapshot = await this.snapshotsCollection.get();
    return snapshot.docs.map(doc => doc.data() as WorkspaceSnapshot);
  }
}
