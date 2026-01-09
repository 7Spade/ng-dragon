import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { WorkspaceRepositoryPort, Workspace } from '@ng-events/core-engine';

// Frontend-safe repository using @angular/fire (client SDK)
@Injectable({ providedIn: 'root' })
export class WorkspaceClientRepository implements WorkspaceRepositoryPort {
  private readonly firestore = inject(Firestore);

  async save(workspace: Workspace): Promise<string> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const eventsCol = collection(this.firestore, 'workspace-events');

    // Save workspace snapshot
    await setDoc(doc(workspacesCol, workspace.workspaceId), {
      workspaceId: workspace.workspaceId,
      accountId: workspace.accountId,
      type: workspace.type,
      name: workspace.name,
      ownerUserId: workspace.ownerUserId,
      members: workspace.members,
      createdAt: workspace.createdAt,
      modules: workspace.modules || []
    });

    // Save event
    await setDoc(doc(eventsCol), {
      workspaceId: workspace.workspaceId,
      accountId: workspace.accountId,
      type: workspace.type,
      name: workspace.name,
      ownerUserId: workspace.ownerUserId,
      timestamp: workspace.createdAt
    });

    return workspace.workspaceId;
  }
}
