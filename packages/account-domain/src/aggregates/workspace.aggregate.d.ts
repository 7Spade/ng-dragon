import { DomainEvent, EventContext } from '../events/domain-event';
import { ModuleStatus, ModuleType } from '../value-objects/module-types';
import { WorkspaceType } from '../value-objects/workspace-type';
import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';
export interface WorkspaceSnapshot {
    workspaceId: WorkspaceId;
    accountId: AccountId;
    workspaceType: WorkspaceType;
    modules: ModuleStatus[];
    createdAt: string;
    description?: string;
    organizationId?: string;
    name?: string;
}
export interface ModuleToggledPayload {
    workspaceId: WorkspaceId;
    moduleKey: ModuleKey;
    moduleType: ModuleType;
    enabled: boolean;
}
export interface WorkspaceCreationInput {
    workspaceId: WorkspaceId;
    accountId: AccountId;
    workspaceType: WorkspaceType;
    createdAt?: string;
    modules?: ModuleStatus[];
    description?: string;
    organizationId?: string;
    name?: string;
}
export declare class WorkspaceAggregate {
    private readonly snapshot;
    constructor(snapshot: WorkspaceSnapshot);
    static create(input: WorkspaceCreationInput, context: EventContext): {
        aggregate: WorkspaceAggregate;
        event: DomainEvent<WorkspaceSnapshot>;
    };
    toggleModule(moduleKey: ModuleKey, moduleType: ModuleType, enabled: boolean, context: EventContext): {
        aggregate: WorkspaceAggregate;
        event: DomainEvent<ModuleToggledPayload>;
    };
    get state(): WorkspaceSnapshot;
}
//# sourceMappingURL=workspace.aggregate.d.ts.map