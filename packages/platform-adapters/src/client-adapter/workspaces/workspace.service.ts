import { WorkspaceSnapshot, WorkspaceMember } from '@account-domain';
import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface WorkspaceView extends WorkspaceSnapshot {
  id: string;
  members: WorkspaceMember[];
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

        return collectionData(q, { idField: 'id' }).pipe(
          map(workspaces => workspaces.map(ws => this.mapWorkspace(ws as WorkspaceSnapshot & { id?: string })))
        );
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

        return collectionData(memberQuery, { idField: 'id' }).pipe(
          map(workspaces => workspaces.map(ws => this.mapWorkspace(ws as WorkspaceSnapshot & { id?: string })))
        );
      })
    );
  }

  getWorkspaceById(workspaceId: string): Observable<WorkspaceView | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const q = query(workspacesCol, where('workspaceId', '==', workspaceId));

    return collectionData(q, { idField: 'id' }).pipe(
      map(workspaces => {
        if (workspaces.length === 0) return null;
        return this.mapWorkspace(workspaces[0] as WorkspaceSnapshot & { id?: string });
      })
    );
  }

  private mapWorkspace(ws: WorkspaceSnapshot & { id?: string; members?: WorkspaceMember[] }): WorkspaceView {
    return {
      id: ws.id ?? ws.workspaceId,
      workspaceId: ws.workspaceId,
      accountId: ws.accountId,
      workspaceType: ws.workspaceType,
      modules: ws.modules ?? [],
      createdAt: ws.createdAt,
      name: ws.name,
      members: ws.members ?? [],
      ownerAccountId: ws.ownerAccountId ?? ws.accountId
    };
  }
}
