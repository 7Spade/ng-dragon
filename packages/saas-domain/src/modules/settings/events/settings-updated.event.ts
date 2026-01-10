import { WorkspaceSettings } from '../value-objects/workspace-settings';

export class SettingsUpdatedEvent {
  constructor(public readonly workspaceId: string, public readonly settings: WorkspaceSettings, public readonly occurredAt: string) {}
}
