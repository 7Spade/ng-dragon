import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, or, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseAuthBridgeService } from '@core';

export interface WorkspaceMember {
  userId: string;
  role: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerUserId: string;
  type: 'organization' | 'team' | 'partner' | 'project';
  members: WorkspaceMember[];
  accountId?: string;
  createdAt?: string;
  modules?: any[];
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly firestore = inject(Firestore);
  private readonly authBridge = inject(FirebaseAuthBridgeService);

  /**
   * Fetches all workspaces where the current user is either the owner or a member
   * Uses @angular/fire client SDK - safe for frontend use
   * Returns an Observable that automatically updates when data changes
   * 
   * CRITICAL: Maps Firestore WorkspaceSnapshot fields to UI Workspace interface
   * WorkspaceSnapshot uses: workspaceId, accountId, workspaceType
   * UI Workspace uses: id, ownerUserId, type
   */
  getUserWorkspaces(): Observable<Workspace[]> {
    const user = this.authBridge.getCurrentUser();
    
    if (!user) {
      // Return empty array if user is not authenticated
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const workspacesCol = collection(this.firestore, 'workspaces');
    
    // Query for workspaces where user is owner (accountId field in Firestore)
    // WorkspaceSnapshot stores owner as 'accountId', not 'ownerUserId'
    const q = query(
      workspacesCol,
      where('accountId', '==', user.uid)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((workspaces: any[]) => {
        return workspaces.map(ws => ({
          // Map workspaceId -> id
          id: ws.workspaceId || ws.id,
          // Use name from snapshot (organizations have name in 'name' field)
          name: ws.name || ws.workspaceId,
          // Map accountId -> ownerUserId
          ownerUserId: ws.accountId,
          // Map workspaceType -> type
          type: ws.workspaceType || ws.type,
          members: ws.members || [],
          accountId: ws.accountId,
          createdAt: ws.createdAt,
          modules: ws.modules || []
        } as Workspace));
      })
    );
  }

  /**
   * Alternative: Fetches workspaces including those where user is a member
   * This requires a composite index in Firestore for optimal performance
   */
  getUserWorkspacesIncludingMemberships(): Observable<Workspace[]> {
    const user = this.authBridge.getCurrentUser();
    
    if (!user) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const workspacesCol = collection(this.firestore, 'workspaces');
    
    // Query workspaces where user is in members array
    // Requires Firestore composite index on: members (array-contains) + type (ascending)
    const memberQuery = query(
      workspacesCol,
      where('members', 'array-contains', { userId: user.uid, role: 'member' })
    );

    return collectionData(memberQuery, { idField: 'id' }).pipe(
      map((workspaces: any[]) => {
        return workspaces.map(ws => ({
          id: ws.id || ws.workspaceId,
          name: ws.name,
          ownerUserId: ws.ownerUserId,
          type: ws.type,
          members: ws.members || [],
          accountId: ws.accountId,
          createdAt: ws.createdAt,
          modules: ws.modules || []
        } as Workspace));
      })
    );
  }

  /**
   * Fetches a single workspace by ID
   * Maps Firestore WorkspaceSnapshot fields to UI Workspace interface
   */
  getWorkspaceById(workspaceId: string): Observable<Workspace | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const q = query(workspacesCol, where('workspaceId', '==', workspaceId));

    return collectionData(q, { idField: 'id' }).pipe(
      map((workspaces: any[]) => {
        if (workspaces.length === 0) return null;
        
        const ws = workspaces[0];
        return {
          // Map workspaceId -> id
          id: ws.workspaceId || ws.id,
          name: ws.name || ws.workspaceId,
          // Map accountId -> ownerUserId
          ownerUserId: ws.accountId || ws.ownerUserId,
          // Map workspaceType -> type
          type: ws.workspaceType || ws.type,
          members: ws.members || [],
          accountId: ws.accountId,
          createdAt: ws.createdAt,
          modules: ws.modules || []
        } as Workspace;
      })
    );
  }
}
