import { WorkspaceService as DomainWorkspaceService, CreateProjectWorkspaceCommand, WorkspaceCommandResult } from '@account-domain/src/domain-services/workspace.service';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { DomainEvent } from '@account-domain/src/events/domain-event';
import { getCollection } from '../../firebase-platform/firestore';

const WORKSPACES_COLLECTION = 'workspaces';
const EVENTS_COLLECTION = 'workspace-events';

/**
 * Server-side adapter: persists workspace snapshots & events using firebase-admin
 * while delegating business rules to the pure domain WorkspaceService.
 */
export class WorkspaceServiceAdapter {
  private readonly domain = new DomainWorkspaceService();
  private readonly workspacesCol = getCollection<WorkspaceSnapshot>(WORKSPACES_COLLECTION);
  private readonly eventsCol = getCollection<DomainEvent<unknown>>(EVENTS_COLLECTION);

  async createProject(command: CreateProjectWorkspaceCommand): Promise<WorkspaceCommandResult> {
    const result = this.domain.createProjectWorkspace(command);

    await this.workspacesCol.doc(result.snapshot.workspaceId).set(result.snapshot);
    await Promise.all(result.events.map((event) => this.eventsCol.doc().set(event)));

    return result;
  }
}
