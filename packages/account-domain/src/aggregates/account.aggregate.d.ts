import { DomainEvent, EventContext } from '../events/domain-event';
import { AccountType } from '../value-objects/account-type';
import { WorkspaceType } from '../value-objects/workspace-type';
import { AccountId, WorkspaceId } from '../types/identifiers';
export interface AccountSnapshot {
    accountId: AccountId;
    accountType: AccountType;
    displayName: string;
    createdAt: string;
    workspaceIds: WorkspaceId[];
}
export interface AccountCreatedPayload {
    accountId: AccountId;
    accountType: AccountType;
    displayName: string;
    createdAt: string;
}
export interface WorkspaceCreatedPayload {
    workspaceId: WorkspaceId;
    workspaceType: WorkspaceType;
    accountId: AccountId;
}
export interface AccountCreationInput {
    accountId: AccountId;
    accountType: AccountType;
    displayName: string;
    createdAt?: string;
    workspaceIds?: WorkspaceId[];
}
export declare class AccountAggregate {
    private readonly snapshot;
    constructor(snapshot: AccountSnapshot);
    static create(input: AccountCreationInput, context: EventContext): {
        aggregate: AccountAggregate;
        event: DomainEvent<AccountCreatedPayload>;
    };
    createWorkspace(workspaceId: WorkspaceId, workspaceType: WorkspaceType, context: EventContext): {
        aggregate: AccountAggregate;
        event: DomainEvent<WorkspaceCreatedPayload>;
    };
    get state(): AccountSnapshot;
}
//# sourceMappingURL=account.aggregate.d.ts.map