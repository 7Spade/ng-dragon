import { WorkspaceAggregate, WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { DomainEvent, EventContext } from '../events/domain-event';
import { AccountId, ModuleKey } from '../types/identifiers';
import { ModuleType } from '../value-objects/module-types';
import { WorkspaceFactory } from './workspace.factory';

type MountCondition = (workspace: WorkspaceSnapshot) => boolean;

export interface ModuleManifestEntry {
  moduleKey: ModuleKey;
  moduleType: ModuleType;
  defaultEnabled?: boolean;
  mountCondition?: MountCondition;
}

export interface CreateProjectWorkspaceCommand {
  orgId: AccountId;
  name: string;
  ownerId: AccountId;
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
  private readonly factory = new WorkspaceFactory();

  createProjectWorkspace(command: CreateProjectWorkspaceCommand): WorkspaceCommandResult {
    const context: EventContext = {
      actorId: command.ownerId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt,
    };

    const { aggregate: workspaceAggregate, event: workspaceCreated } = this.factory.createProject({
      orgId: command.orgId,
      name: command.name,
      createdAt: command.createdAt,
      context,
    });

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
