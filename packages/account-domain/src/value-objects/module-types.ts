// ModuleType and ModuleStatus describe capability toggles within a workspace.
// Enabled flag controls access; moduleKey couples UI/navigation to domain handlers.
export type ModuleType = 'core' | 'addon' | 'beta';

export interface ModuleStatus {
  moduleKey: string;
  moduleType: ModuleType;
  enabled: boolean;
}
