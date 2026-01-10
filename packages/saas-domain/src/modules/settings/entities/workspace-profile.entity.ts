import { WorkspaceSettings } from '../value-objects/workspace-settings';

export class WorkspaceProfile {
  constructor(
    public readonly workspaceId: string,
    public name: string,
    public settings: WorkspaceSettings = new WorkspaceSettings()
  ) {}
}
