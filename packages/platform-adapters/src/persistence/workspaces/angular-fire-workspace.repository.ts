import { inject, Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { WorkspaceCreatedEvent } from '@saas-domain/src/events/WorkspaceCreatedEvent';
import { WorkspaceRepository } from '@saas-domain/src/repositories/WorkspaceRepository';

const EVENTS_COLLECTION = 'workspace-events';
const SNAPSHOTS_COLLECTION = 'workspaces';

@Injectable({ providedIn: 'root' })
export class AngularFireWorkspaceRepository implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  async appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void> {
    const eventsCol = collection(this.firestore, EVENTS_COLLECTION) as CollectionReference;
    const eventDocRef = doc(eventsCol);
    await setDoc(eventDocRef, { ...event, aggregateId: event.workspaceId ?? event.aggregateId });
  }

  async saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    const snapshotsCol = collection(this.firestore, SNAPSHOTS_COLLECTION) as CollectionReference;
    const snapshotDocRef = doc(snapshotsCol, snapshot.workspaceId) as DocumentReference;
    await setDoc(snapshotDocRef, snapshot, { merge: true });
  }

  async getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const snapshotsCol = collection(this.firestore, SNAPSHOTS_COLLECTION) as CollectionReference;
    const snapshotDocRef = doc(snapshotsCol, workspaceId) as DocumentReference;
    const docSnap = await getDoc(snapshotDocRef);
    return docSnap.exists() ? (docSnap.data() as WorkspaceSnapshot) : null;
  }

  async listWorkspaces(): Promise<WorkspaceSnapshot[]> {
    const snapshotsCol = collection(this.firestore, SNAPSHOTS_COLLECTION) as CollectionReference;
    const querySnapshot = await getDocs(snapshotsCol);
    return querySnapshot.docs.map(doc => doc.data() as WorkspaceSnapshot);
  }
}
