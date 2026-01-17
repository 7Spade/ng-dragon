export type WorkspaceModuleType =
  | 'overview'
  | 'documents'
  | 'tasks'
  | 'members'
  | 'permissions'
  | 'audit'
  | 'settings'
  | 'journal';

export interface WorkspaceModuleDescriptor {
  id: WorkspaceModuleType;
  label: string;
  icon: string;
  route: WorkspaceModuleType;
  enabled: boolean;
}

export interface ModuleState {
  registered: WorkspaceModuleDescriptor[];
}

export const defaultModules: WorkspaceModuleDescriptor[] = [
  { id: 'overview', label: 'Overview', icon: '📊', route: 'overview', enabled: true },
  { id: 'documents', label: 'Documents', icon: '📄', route: 'documents', enabled: true },
  { id: 'tasks', label: 'Tasks', icon: '✅', route: 'tasks', enabled: true },
  { id: 'members', label: 'Members', icon: '👥', route: 'members', enabled: true },
  { id: 'permissions', label: 'Permissions', icon: '🔒', route: 'permissions', enabled: true },
  { id: 'audit', label: 'Audit', icon: '🕑', route: 'audit', enabled: true },
  { id: 'settings', label: 'Settings', icon: '⚙️', route: 'settings', enabled: true },
  { id: 'journal', label: 'Journal', icon: '📝', route: 'journal', enabled: true },
];

export const initialModuleState: ModuleState = {
  registered: defaultModules,
};
