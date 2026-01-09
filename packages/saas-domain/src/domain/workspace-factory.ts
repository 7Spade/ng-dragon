import { WorkspaceAggregate, WorkspaceSnapshot, EventContext, WorkspaceType } from '@account-domain';
import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { CreateTeamCommand } from '../commands/create-team-command';
import { CreatePartnerCommand } from '../commands/create-partner-command';
import { CreateProjectCommand } from '../commands/create-project-command';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';

export class WorkspaceFactory {
  createOrganization(command: CreateOrganizationCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceType: WorkspaceType = 'organization';
    const context: EventContext = {
      actorId: command.actorId ?? command.accountId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt
    };

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId: command.workspaceId,
        accountId: command.accountId,
        workspaceType,
        modules: command.modules,
        createdAt: command.createdAt,
        name: command.organizationName
      },
      context
    );

    return { snapshot: aggregate.state, event };
  }

  createTeam(command: CreateTeamCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceType: WorkspaceType = 'team';
    const context: EventContext = {
      actorId: command.actorId ?? command.accountId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt
    };

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId: command.workspaceId,
        accountId: command.accountId,
        workspaceType,
        modules: command.modules,
        createdAt: command.createdAt,
        name: command.teamName
      },
      context
    );

    return { snapshot: aggregate.state, event };
  }

  createPartner(command: CreatePartnerCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceType: WorkspaceType = 'partner';
    const now = command.createdAt || new Date().toISOString();
    const context: EventContext = {
      actorId: command.actorId || command.accountId,
      traceId: command.traceId || `partner-creation-${Date.now()}`,
      causedBy: command.causedBy || ['system'],
      occurredAt: now
    };

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId: command.workspaceId,
        accountId: command.accountId,
        workspaceType,
        modules: command.modules || [],
        createdAt: now,
        name: command.partnerName
      },
      context
    );

    return { snapshot: aggregate.state, event };
  }

  createProject(command: CreateProjectCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceType: WorkspaceType = 'project';
    const context: EventContext = {
      actorId: command.actorId ?? command.accountId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt
    };

    // Convert string[] modules to ModuleStatus[]
    const moduleStatuses = command.modules.map(moduleKey => ({
      moduleKey,
      moduleType: 'core' as const,
      enabled: true
    }));

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId: command.workspaceId,
        accountId: command.accountId,
        workspaceType,
        modules: moduleStatuses,
        createdAt: command.createdAt,
        name: command.projectName
      },
      context
    );

    return { snapshot: aggregate.state, event };
  }
}
