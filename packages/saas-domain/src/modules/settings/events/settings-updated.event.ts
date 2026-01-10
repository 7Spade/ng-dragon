import { DomainEvent } from '@account-domain';
import { WorkspaceSettings } from '../value-objects/workspace-settings';

export interface SettingsUpdatedPayload {
  workspaceId: string;
  settings: WorkspaceSettings;
}

export type SettingsUpdatedEvent = DomainEvent<SettingsUpdatedPayload>;
