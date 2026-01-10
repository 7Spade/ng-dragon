/**
 * Workspace Aggregate
 * Core domain entity for workspace management
 */
import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';
import { WorkspaceType } from '../value-objects/workspace-type';
import { MemberRole } from '../value-objects/member-role';
import { ModuleStatus, ModuleType } from '../value-objects/module-status';
/**
 * Workspace member
 */
export interface WorkspaceMember {
    accountId: AccountId;
    role: MemberRole;
    accountType: 'user' | 'service';
}
/**
 * Workspace snapshot - immutable state representation
 */
export interface WorkspaceSnapshot {
    workspaceId: WorkspaceId;
    accountId: AccountId;
    workspaceType: WorkspaceType;
    modules: ModuleStatus[];
    createdAt: string;
    name?: string;
    members: WorkspaceMember[];
    ownerAccountId?: AccountId;
    memberIds?: AccountId[];
}
/**
 * Input for creating a new workspace
 */
export interface WorkspaceCreationInput {
    workspaceId: WorkspaceId;
    accountId: AccountId;
    workspaceType: WorkspaceType;
    createdAt?: string;
    modules?: ModuleStatus[];
    name?: string;
    members?: WorkspaceMember[];
    ownerAccountId?: AccountId;
    ownerAccountType?: 'user' | 'service';
    memberIds?: AccountId[];
}
/**
 * Domain event for workspace creation
 */
export interface WorkspaceCreatedEvent {
    eventType: 'WorkspaceCreated';
    aggregateId: WorkspaceId;
    accountId: AccountId;
    workspaceId: WorkspaceId;
    payload: WorkspaceSnapshot;
    metadata: {
        actorId: AccountId;
        traceId?: string;
        causedBy?: string[];
        occurredAt: string;
    };
}
/**
 * Domain event for module toggle
 */
export interface ModuleToggledEvent {
    eventType: 'ModuleEnabled' | 'ModuleDisabled';
    aggregateId: WorkspaceId;
    accountId: AccountId;
    workspaceId: WorkspaceId;
    moduleKey: ModuleKey;
    payload: {
        workspaceId: WorkspaceId;
        moduleKey: ModuleKey;
        moduleType: ModuleType;
        enabled: boolean;
    };
    metadata: {
        actorId: AccountId;
        traceId?: string;
        causedBy?: string[];
        occurredAt: string;
    };
}
/**
 * Event context for domain events
 */
export interface EventContext {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt?: string;
}
/**
 * Workspace Aggregate
 * Encapsulates workspace state and business rules
 */
export declare class WorkspaceAggregate {
    private readonly snapshot;
    constructor(snapshot: WorkspaceSnapshot);
    /**
     * Create a new workspace aggregate
     */
    static create(input: WorkspaceCreationInput, context: EventContext): {
        aggregate: WorkspaceAggregate;
        event: WorkspaceCreatedEvent;
    };
    /**
     * Toggle module enablement
     */
    toggleModule(moduleKey: ModuleKey, moduleType: ModuleType, enabled: boolean, context: EventContext): {
        aggregate: WorkspaceAggregate;
        event: ModuleToggledEvent;
    };
    /**
     * Get current workspace state
     */
    get state(): WorkspaceSnapshot;
    /**
     * Get workspace ID
     */
    get id(): WorkspaceId;
    /**
     * Get workspace type
     */
    get type(): WorkspaceType;
    /**
     * Get workspace name
     */
    get name(): string | undefined;
    /**
     * Check if a member exists in the workspace
     */
    hasMember(accountId: AccountId): boolean;
    /**
     * Get member role
     */
    getMemberRole(accountId: AccountId): MemberRole | null;
}
//# sourceMappingURL=workspace.aggregate.d.ts.map