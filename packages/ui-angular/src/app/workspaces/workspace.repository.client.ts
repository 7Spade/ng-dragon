import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  QueryConstraint
} from '@angular/fire/firestore';
import { WorkspaceRepository, WorkspaceCreatedEvent } from '@saas-domain';
import { WorkspaceSnapshot } from '@account-domain';

/**
 * Client-side implementation of WorkspaceRepository using @angular/fire
 * This is the frontend version that uses Firestore client SDK
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceRepositoryClient implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  async appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void> {
    const eventsCol = collection(this.firestore, 'workspace-events');
    await setDoc(doc(eventsCol), {
      ...event,
      timestamp: event.metadata.occurredAt
    });
  }

  async saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    await setDoc(doc(workspacesCol, snapshot.workspaceId), snapshot);
  }

  async getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const docRef = doc(workspacesCol, workspaceId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return docSnap.data() as WorkspaceSnapshot;
  }

  async listWorkspaces(filter?: { workspaceType?: WorkspaceSnapshot['workspaceType']; accountId?: string }): Promise<WorkspaceSnapshot[]> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const constraints: QueryConstraint[] = [];

    if (filter?.workspaceType) {
      constraints.push(where('workspaceType', '==', filter.workspaceType));
    }

    if (filter?.accountId) {
      constraints.push(where('accountId', '==', filter.accountId));
    }

    const q = constraints.length > 0 ? query(workspacesCol, ...constraints) : workspacesCol;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as WorkspaceSnapshot);
  }
}
