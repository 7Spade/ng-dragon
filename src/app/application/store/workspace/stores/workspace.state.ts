import { Workspace } from '@domain/workspace/entities/workspace.entity';

export interface WorkspaceState {
  workspaces: Workspace[];
  favorites: string[];
  recents: string[];
  currentWorkspaceId: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

export const initialWorkspaceState: WorkspaceState = {
  workspaces: [],
  favorites: [],
  recents: [],
  currentWorkspaceId: null,
  searchQuery: '',
  loading: false,
  error: null,
};
