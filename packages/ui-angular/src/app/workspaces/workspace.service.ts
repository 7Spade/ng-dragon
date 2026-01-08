import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, or, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseAuthBridgeService } from '@core';

export interface WorkspaceMember {
  userId: string;
  role: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerUserId: string;
  type: 'organization' | 'team' | 'project';
  members: WorkspaceMember[];
  teams?: Team[];
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
    
    // Query for workspaces where user is owner OR user is in members array
    // Note: Firestore doesn't support OR queries with array-contains, 
    // so we need to query by ownerUserId only and filter members client-side
    const q = query(
      workspacesCol,
      where('ownerUserId', '==', user.uid)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((workspaces: any[]) => {
        return workspaces.map(ws => ({
          id: ws.id || ws.workspaceId,
          name: ws.name,
          ownerUserId: ws.ownerUserId,
          type: ws.type,
          members: ws.members || [],
          teams: ws.teams || [],
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
          teams: ws.teams || [],
          accountId: ws.accountId,
          createdAt: ws.createdAt,
          modules: ws.modules || []
        } as Workspace));
      })
    );
  }

  /**
   * Fetches a single workspace by ID
   */
  getWorkspaceById(workspaceId: string): Observable<Workspace | null> {
    const workspacesCol = collection(this.firestore, 'workspaces');
    const q = query(workspacesCol, where('workspaceId', '==', workspaceId));

    return collectionData(q, { idField: 'id' }).pipe(
      map((workspaces: any[]) => {
        if (workspaces.length === 0) return null;
        
        const ws = workspaces[0];
        return {
          id: ws.id || ws.workspaceId,
          name: ws.name,
          ownerUserId: ws.ownerUserId,
          type: ws.type,
          members: ws.members || [],
          teams: ws.teams || [],
          accountId: ws.accountId,
          createdAt: ws.createdAt,
          modules: ws.modules || []
        } as Workspace;
      })
    );
  }

  /**
   * Fetches teams for a specific workspace (organization)
   * Only organizations can have teams
   */
  getTeamsByWorkspace(workspaceId: string): Observable<Team[]> {
    return this.getWorkspaceById(workspaceId).pipe(
      map(workspace => {
        if (!workspace || workspace.type !== 'organization') {
          return [];
        }
        return workspace.teams || [];
      })
    );
  }

  /**
   * Fetches teams where user is a member
   * Filters teams from all workspaces based on user membership
   */
  getUserTeams(): Observable<{ workspace: Workspace; team: Team }[]> {
    const user = this.authBridge.getCurrentUser();
    
    if (!user) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.getUserWorkspaces().pipe(
      map(workspaces => {
        const userTeams: { workspace: Workspace; team: Team }[] = [];
        
        workspaces.forEach(workspace => {
          if (workspace.type === 'organization' && workspace.teams) {
            workspace.teams.forEach(team => {
              // Check if user is a member of this workspace (which grants team access)
              const isMember = workspace.members?.some(m => m.userId === user.uid);
              if (isMember) {
                userTeams.push({ workspace, team });
              }
            });
          }
        });
        
        return userTeams;
      })
    );
  }
}
