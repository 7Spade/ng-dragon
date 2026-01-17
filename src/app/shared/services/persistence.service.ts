import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  saveCurrentWorkspace(workspaceId: string): void {
    localStorage.setItem('currentWorkspaceId', workspaceId);
  }

  loadCurrentWorkspace(): string | null {
    return localStorage.getItem('currentWorkspaceId');
  }

  saveFavorites(favoriteIds: string[]): void {
    localStorage.setItem('favoriteWorkspaceIds', JSON.stringify(favoriteIds));
  }

  loadFavorites(): string[] {
    const data = localStorage.getItem('favoriteWorkspaceIds');
    return data ? (JSON.parse(data) as string[]) : [];
  }

  saveRecents(recentIds: string[]): void {
    localStorage.setItem('recentWorkspaceIds', JSON.stringify(recentIds));
  }

  loadRecents(): string[] {
    const data = localStorage.getItem('recentWorkspaceIds');
    return data ? (JSON.parse(data) as string[]) : [];
  }
}
