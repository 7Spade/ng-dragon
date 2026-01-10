import { DomainEvent, WorkspaceId, WorkspaceSnapshot } from '@account-domain';
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { WorkspaceRepository } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class WorkspaceRepositoryClient implements WorkspaceRepository<WorkspaceSnapshot, DomainEvent<WorkspaceSnapshot>> {
  private readonly firestore = inject(Firestore);
  private readonly workspacesCol = collection(this.firestore, 'workspaces');
  private readonly eventsCol = collection(this.firestore, 'workspace-events');

  async appendWorkspaceEvent(event: DomainEvent<WorkspaceSnapshot>): Promise<void> {
    await setDoc(doc(this.eventsCol), event);
  }

  async saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    await setDoc(doc(this.workspacesCol, snapshot.workspaceId), snapshot);
  }

  async getWorkspaceSnapshot(workspaceId: WorkspaceId): Promise<WorkspaceSnapshot | null> {
    const snapshot = await getDoc(doc(this.workspacesCol, workspaceId));
    return snapshot.exists() ? (snapshot.data() as WorkspaceSnapshot) : null;
  }

  async listWorkspaces(): Promise<WorkspaceSnapshot[]> {
    const snapshot = await getDocs(this.workspacesCol);
    return snapshot.docs.map(docSnap => docSnap.data() as WorkspaceSnapshot);
  }
}
