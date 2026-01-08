import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { DomainEvent } from '@account-domain/src/events/domain-event';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { WorkspaceRepository } from '@core-engine/src/ports/workspace.repository';

const EVENTS_COLLECTION = 'workspace-events';
const SNAPSHOTS_COLLECTION = 'workspaces';

@Injectable({ providedIn: 'root' })
export class FirestoreWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly firestore: Firestore) {}

  async appendEvents(workspaceId: string, events: DomainEvent<unknown>[]): Promise<void> {
    if (!events.length) return;
    const colRef = collection(this.firestore, EVENTS_COLLECTION);
    await Promise.all(events.map(event => addDoc(colRef, { ...event, aggregateId: workspaceId })));
  }

  async loadEvents(workspaceId: string): Promise<DomainEvent<unknown>[]> {
    const colRef = collection(this.firestore, EVENTS_COLLECTION);
    const q = query(colRef, where('aggregateId', '==', workspaceId), orderBy('metadata.occurredAt'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as DomainEvent<unknown>);
  }

  async saveSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    const docRef = doc(this.firestore, SNAPSHOTS_COLLECTION, snapshot.workspaceId);
    await setDoc(docRef, snapshot, { merge: true });
  }

  async getSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const docRef = doc(this.firestore, SNAPSHOTS_COLLECTION, workspaceId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as WorkspaceSnapshot) : null;
  }

  async list(): Promise<WorkspaceSnapshot[]> {
    const colRef = collection(this.firestore, SNAPSHOTS_COLLECTION);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data() as WorkspaceSnapshot);
  }
}
