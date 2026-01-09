import { WorkspaceSnapshot, WorkspaceType, WorkspaceMember } from '@account-domain';
import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface WorkspaceView extends WorkspaceSnapshot {
  id: string;
  members?: WorkspaceMember[];
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  getUserWorkspaces(): Observable<WorkspaceView[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);

        const workspacesCol = collection(this.firestore, 'workspaces');
        const q = query(workspacesCol, where('ownerAccountId', '==', user.uid));

        return collectionData<WorkspaceView>(q, { idField: 'id' }).pipe(map(workspaces => workspaces.map(ws => this.mapWorkspace(ws))));
      })
    );
  }

  getUserWorkspacesIncludingMemberships(): Observable<WorkspaceView[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);

        const workspacesCol = collection(this.firestore, 'workspaces');
        const memberQuery = query(
          workspacesCol,
          where('members', 'array-contains', { accountId: user.uid, role: 'member', accountType: 'user' })
        );

        return collectionData<WorkspaceView>(memberQuery, { idField: 'id' }).pipe(
          map(workspaces => workspaces.map(ws => this.mapWorkspace(ws)))
        );
      })
    );
  }

  getWorkspaceById(workspaceId: string): Observable<WorkspaceView | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const q = query(workspacesCol, where('workspaceId', '==', workspaceId));

    return collectionData<WorkspaceView>(q, { idField: 'id' }).pipe(
      map(workspaces => {
        if (workspaces.length === 0) return null;
        return this.mapWorkspace(workspaces[0]);
      })
    );
  }

  private mapWorkspace(ws: WorkspaceView): WorkspaceView {
    return {
      id: ws.id || ws.workspaceId,
      workspaceId: ws.workspaceId ?? ws.id,
      accountId: ws.accountId,
      workspaceType: (ws.workspaceType ?? ws.type) as WorkspaceType,
      modules: ws.modules ?? [],
      createdAt: ws.createdAt,
      name: ws.name,
      members: ws.members ?? [],
      ownerAccountId: ws.ownerAccountId ?? ws.accountId
    };
  }
}
