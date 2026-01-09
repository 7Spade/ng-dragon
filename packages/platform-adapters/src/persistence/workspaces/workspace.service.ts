import { WorkspaceService as DomainWorkspaceService, CreateProjectWorkspaceCommand, WorkspaceCommandResult } from '@account-domain';
import { WorkspaceSnapshot } from '@account-domain';
import { DomainEvent } from '@account-domain';
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
    const workspaceId = result.snapshot.workspaceId.value;

    if (!workspaceId) {
      throw new Error('WorkspaceId cannot be empty');
    }

    await this.workspacesCol.doc(workspaceId).set({ ...result.snapshot, workspaceId });
    await Promise.all(result.events.map((event) => this.eventsCol.doc().set(event)));

    return result;
  }
}
