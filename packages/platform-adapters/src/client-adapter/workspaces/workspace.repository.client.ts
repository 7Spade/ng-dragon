import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { WorkspaceRepositoryPort, Workspace } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class WorkspaceRepositoryClient implements WorkspaceRepositoryPort {
  private readonly firestore = inject(Firestore);

  async save(workspace: Workspace): Promise<string> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const eventsCol = collection(this.firestore, 'workspace-events');

    const snapshot = {
      workspaceId: workspace.workspaceId,
      accountId: workspace.accountId,
      type: workspace.type,
      name: workspace.name,
      ownerUserId: workspace.ownerUserId,
      members: workspace.members,
      createdAt: workspace.createdAt,
      modules: workspace.modules ?? []
    };

    await setDoc(doc(workspacesCol, workspace.workspaceId), snapshot);

    await setDoc(doc(eventsCol), {
      ...snapshot,
      timestamp: workspace.createdAt
    });

    return workspace.workspaceId;
  }
}
