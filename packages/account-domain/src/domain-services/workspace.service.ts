import { WorkspaceAggregate, WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { DomainEvent, EventContext } from '../events/domain-event';
import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';
import { ModuleType } from '../value-objects/module-types';

type MountCondition = (workspace: WorkspaceSnapshot) => boolean;

export interface ModuleManifestEntry {
  moduleKey: ModuleKey;
  moduleType: ModuleType;
  defaultEnabled?: boolean;
  mountCondition?: MountCondition;
}

export interface CreateProjectWorkspaceCommand {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  projectName: string;
  actorId: AccountId;
  modules?: ModuleManifestEntry[];
  traceId?: string;
  causedBy?: string[];
  createdAt?: string;
}

export interface WorkspaceCommandResult {
  snapshot: WorkspaceSnapshot;
  events: DomainEvent<unknown>[];
}

export class WorkspaceService {
  createProjectWorkspace(command: CreateProjectWorkspaceCommand): WorkspaceCommandResult {
    const context: EventContext = {
      actorId: command.actorId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt,
    };

    const { aggregate: workspaceAggregate, event: workspaceCreated } = WorkspaceAggregate.create(
      {
        workspaceId: command.workspaceId,
        accountId: command.accountId,
        workspaceType: 'project',
        modules: [],
        createdAt: command.createdAt,
        name: command.projectName,
      },
      context,
    );

    const events: DomainEvent<unknown>[] = [workspaceCreated];
    const manifest = command.modules ?? [];
    let aggregate = workspaceAggregate;

    for (const moduleDef of manifest) {
      const shouldMount = moduleDef.mountCondition ? moduleDef.mountCondition(aggregate.state) : true;
      if (!shouldMount) continue;

      const { aggregate: nextAggregate, event: moduleEvent } = aggregate.toggleModule(
        moduleDef.moduleKey,
        moduleDef.moduleType,
        moduleDef.defaultEnabled ?? false,
        context,
      );

      aggregate = nextAggregate;
      events.push(moduleEvent);
    }

    return { snapshot: aggregate.state, events };
  }
}
