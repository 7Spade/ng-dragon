import { WorkspaceSnapshot, WorkspaceMember } from '@account-domain';
import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  CollectionReference,
  collection,
  query,
  where,
  collectionData,
  doc,
  docData
} from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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
    const workspaceDoc = doc(workspacesCol, workspaceId);

    return docData<WorkspaceSnapshot & { id?: string }>(workspaceDoc, { idField: 'id' }).pipe(
      map(ws => (ws ? this.mapWorkspace(ws) : null)),
      catchError(() => of(null))
    );
  }

  private mapWorkspace(ws: WorkspaceSnapshot & { id?: string; members?: WorkspaceMember[] }): WorkspaceView {
    const id = ws.id ?? ws.workspaceId;
    const workspaceType = (ws.workspaceType ?? (ws as any).type ?? 'organization') as WorkspaceSnapshot['workspaceType'];
    const modules = ws.modules ?? [];
    const members = ws.members ?? [];
    const memberIds = ws.memberIds ?? members.map(m => m.accountId);
    return {
      id,
      workspaceId: ws.workspaceId,
      accountId: ws.accountId,
      workspaceType,
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
