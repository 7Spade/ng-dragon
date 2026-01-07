import { AccountId, WorkspaceId } from '@account-domain/src/types/identifiers';
import {
  EventContext,
  OrganizationAggregate,
  OrganizationCreationInput,
  OrganizationDomainEvent,
  OrganizationEventStore,
  OrganizationMemberRole,
  OrganizationProjectionState,
  assertModuleEnabled,
  assertWorkspaceAccess,
  createEmptyProjectionState,
} from '@saas-domain';

export class OrganizationApplicationService {
  constructor(
    private readonly store: OrganizationEventStore,
    private readonly workspaceAccess: { canAccess(workspaceId: WorkspaceId, actorId: AccountId): Promise<boolean> },
    private readonly moduleEnabled: { isEnabled(workspaceId: WorkspaceId, moduleKey: string): Promise<boolean> }
  ) {}

  async createOrganization(input: OrganizationCreationInput, context: EventContext): Promise<OrganizationDomainEvent[]> {
    await this.guardContext(context);
    const { events } = OrganizationAggregate.create(input, context);
    await this.store.appendMany(events);
    return events;
  }

  async addMember(
    organizationId: string,
    accountId: AccountId,
    role: OrganizationMemberRole,
    context: EventContext
  ): Promise<OrganizationDomainEvent[]> {
    await this.guardContext(context);
    const aggregate = await this.loadAggregate(organizationId, context);
    const { events } = aggregate.addMember(accountId, role, context);
    await this.store.appendMany(events);
    return events;
  }

  async createTeam(
    organizationId: string,
    input: { teamId: string; slug: string; displayName: string; defaultPermission?: 'admin' | 'write' | 'read' | 'none' },
    context: EventContext
  ): Promise<OrganizationDomainEvent[]> {
    await this.guardContext(context);
    const aggregate = await this.loadAggregate(organizationId, context);
    const { events } = aggregate.createTeam(input, context);
    await this.store.appendMany(events);
    return events;
  }

  async linkProject(organizationId: string, projectId: string, context: EventContext): Promise<OrganizationDomainEvent[]> {
    await this.guardContext(context);
    const aggregate = await this.loadAggregate(organizationId, context);
    const { events } = aggregate.linkProject(projectId, context);
    await this.store.appendMany(events);
    return events;
  }

  private async guardContext(context: EventContext): Promise<void> {
    await assertWorkspaceAccess(this.workspaceAccess, context.workspaceId, context.actorId);
    await assertModuleEnabled(this.moduleEnabled, context.workspaceId, context.moduleKey);
  }

  private async loadAggregate(organizationId: string, context: EventContext): Promise<OrganizationAggregate> {
    const events = await this.store.load(organizationId);
    return OrganizationAggregate.fromEvents(events, { workspaceId: context.workspaceId, moduleKey: context.moduleKey });
  }
}

export function toProjectionSnapshot(events: OrganizationDomainEvent[]): OrganizationProjectionState {
  return events.reduce((state, event) => {
    const projection = state.organizations.get(event.aggregateId);
    if (projection) {
      projection.updatedAt = event.metadata.occurredAt;
    }
    return state;
  }, createEmptyProjectionState());
}
