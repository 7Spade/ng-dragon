import { WorkspaceSnapshot, WorkspaceMember } from '@account-domain';
import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, CollectionReference, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface WorkspaceView extends WorkspaceSnapshot {
  id: string;
  members: WorkspaceMember[];
  memberIds?: string[];
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  getUserWorkspaces(): Observable<WorkspaceView[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);

        const workspacesCol = collection(this.firestore, 'workspaces') as CollectionReference<WorkspaceSnapshot>;
        const q = query(workspacesCol, where('accountId', '==', user.uid));

        return collectionData<WorkspaceSnapshot & { id?: string }>(q, { idField: 'id' }).pipe(
          map(workspaces => workspaces.map(ws => this.mapWorkspace(ws as WorkspaceSnapshot & { id?: string })))
        );
      })
    );
  }

  getUserWorkspacesIncludingMemberships(): Observable<WorkspaceView[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);

        const workspacesCol = collection(this.firestore, 'workspaces') as CollectionReference<WorkspaceSnapshot>;
        const memberIdQuery = query(workspacesCol, where('memberIds', 'array-contains', user.uid));
        const legacyMemberQuery = query(
          workspacesCol,
          where('members', 'array-contains', { accountId: user.uid, role: 'member', accountType: 'user' })
        );

        return combineLatest([
          collectionData<WorkspaceSnapshot & { id?: string }>(memberIdQuery, { idField: 'id' }),
          collectionData<WorkspaceSnapshot & { id?: string }>(legacyMemberQuery, { idField: 'id' })
        ]).pipe(
          map(([byId, legacy]) => this.mergeWorkspaceResults([...byId, ...legacy])),
          map(workspaces => workspaces.map(ws => this.mapWorkspace(ws)))
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
    const id = ws.id ?? ws.workspaceId;
    const modules = ws.modules ?? [];
    const members = ws.members ?? [];
    const memberIds = ws.memberIds ?? members.map(m => m.accountId);
    return {
      id,
      workspaceId: ws.workspaceId,
      accountId: ws.accountId,
      workspaceType: ws.workspaceType,
      modules,
      createdAt: ws.createdAt,
      name: ws.name,
      members,
      ownerAccountId: ws.ownerAccountId ?? ws.accountId,
      memberIds
    };
  }

  private mergeWorkspaceResults(raw: Array<WorkspaceSnapshot & { id?: string }>): Array<WorkspaceSnapshot & { id?: string }> {
    const seen = new Map<string, WorkspaceSnapshot & { id?: string }>();
    raw.forEach(ws => {
      const id = ws.id ?? ws.workspaceId;
      if (!id) return;
      if (seen.has(id)) return;
      seen.set(id, ws);
    });
    return Array.from(seen.values());
  }
}
