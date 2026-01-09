import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface WorkspaceMember {
  userId: string;
  role: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerUserId: string;
  type: 'organization' | 'team' | 'project';
  members: WorkspaceMember[];
  accountId?: string;
  createdAt?: string;
  modules?: any[];
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  getUserWorkspaces(): Observable<Workspace[]> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) return of([]);

        const workspacesCol = collection(this.firestore, 'workspaces');
        const q = query(workspacesCol, where('ownerUserId', '==', user.uid));

        return collectionData(q, { idField: 'id' }).pipe(map((workspaces) => workspaces.map((ws) => this.mapWorkspace(ws))));
      })
    );
  }

  getUserWorkspacesIncludingMemberships(): Observable<Workspace[]> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) return of([]);

        const workspacesCol = collection(this.firestore, 'workspaces');
        const memberQuery = query(workspacesCol, where('members', 'array-contains', { userId: user.uid, role: 'member' }));

        return collectionData(memberQuery, { idField: 'id' }).pipe(map((workspaces) => workspaces.map((ws) => this.mapWorkspace(ws))));
      })
    );
  }

  getWorkspaceById(workspaceId: string): Observable<Workspace | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const q = query(workspacesCol, where('workspaceId', '==', workspaceId));

    return collectionData(q, { idField: 'id' }).pipe(
      map((workspaces: any[]) => {
        if (workspaces.length === 0) return null;
        return this.mapWorkspace(workspaces[0]);
      })
    );
  }

  private mapWorkspace(ws: any): Workspace {
    return {
      id: ws.id || ws.workspaceId,
      name: ws.name,
      ownerUserId: ws.ownerUserId,
      type: ws.type,
      members: ws.members || [],
      accountId: ws.accountId,
      createdAt: ws.createdAt,
      modules: ws.modules || []
    };
  }
}
