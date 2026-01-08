import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { WorkspaceRepositoryPort, Workspace } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class WorkspaceRepositoryClient implements WorkspaceRepositoryPort {
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
      modules: workspace.modules || [],
      teams: workspace.teams || []
    });

    // Save event (workspace created or team created)
    const eventData: any = {
      workspaceId: workspace.workspaceId,
      timestamp: new Date().toISOString()
    };

    if (!workspace.teams || workspace.teams.length === 0) {
      // Workspace created event
      eventData.accountId = workspace.accountId;
      eventData.type = workspace.type;
      eventData.name = workspace.name;
      eventData.ownerUserId = workspace.ownerUserId;
    } else {
      // Team created event (for the latest team)
      const latestTeam = workspace.teams[workspace.teams.length - 1];
      eventData.teamId = latestTeam.teamId;
      eventData.teamName = latestTeam.teamName;
      eventData.createdByUserId = workspace.ownerUserId;
    }

    await setDoc(doc(eventsCol), eventData);

    return workspace.workspaceId;
  }

  async load(workspaceId: string): Promise<Workspace | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const workspaceDoc = await getDoc(doc(workspacesCol, workspaceId));

    if (!workspaceDoc.exists()) {
      return null;
    }

    const data = workspaceDoc.data();
    return {
      workspaceId: data['workspaceId'],
      accountId: data['accountId'],
      type: data['type'],
      name: data['name'],
      ownerUserId: data['ownerUserId'],
      members: data['members'] || [],
      createdAt: data['createdAt'],
      modules: data['modules'] || [],
      teams: data['teams'] || []
    };
  }
}
