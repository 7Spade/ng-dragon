import { DomainEvent } from '@account-domain/src/events/domain-event';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';

export interface WorkspaceRepository {
  appendEvents(workspaceId: string, events: DomainEvent<unknown>[]): Promise<void>;
  loadEvents(workspaceId: string): Promise<DomainEvent<unknown>[]>;
  saveSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;
  getSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  list(): Promise<WorkspaceSnapshot[]>;
}
