import { DomainEvent, EventContext, toEventMetadata } from '../events/domain-event';
import { AccountId, WorkspaceId } from '../types/identifiers';
import { AccountType } from '../value-objects/account-type';
import { WorkspaceType } from '../value-objects/workspace-type';

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

export class AccountAggregate {
  constructor(private readonly snapshot: AccountSnapshot) {}

  static create(
    input: AccountCreationInput,
    context: EventContext
  ): {
    aggregate: AccountAggregate;
    event: DomainEvent<AccountCreatedPayload>;
  } {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const snapshot: AccountSnapshot = {
      accountId: input.accountId,
      accountType: input.accountType,
      displayName: input.displayName,
      createdAt,
      workspaceIds: input.workspaceIds ?? []
    };

    const event: DomainEvent<AccountCreatedPayload> = {
      eventType: 'AccountCreated',
      aggregateId: snapshot.accountId,
      accountId: snapshot.accountId,
      payload: {
        accountId: snapshot.accountId,
        accountType: snapshot.accountType,
        displayName: snapshot.displayName,
        createdAt: snapshot.createdAt
      },
      metadata: toEventMetadata({ ...context, occurredAt: context.occurredAt ?? snapshot.createdAt })
    };

    return { aggregate: new AccountAggregate(snapshot), event };
  }

  createWorkspace(
    workspaceId: WorkspaceId,
    workspaceType: WorkspaceType,
    context: EventContext
  ): {
    aggregate: AccountAggregate;
    event: DomainEvent<WorkspaceCreatedPayload>;
  } {
    const nextSnapshot: AccountSnapshot = {
      ...this.snapshot,
      workspaceIds: [...this.snapshot.workspaceIds, workspaceId]
    };

    const event: DomainEvent<WorkspaceCreatedPayload> = {
      eventType: 'WorkspaceCreated',
      aggregateId: this.snapshot.accountId,
      accountId: this.snapshot.accountId,
      workspaceId,
      payload: {
        workspaceId,
        workspaceType,
        accountId: this.snapshot.accountId
      },
      metadata: toEventMetadata(context)
    };

    return { aggregate: new AccountAggregate(nextSnapshot), event };
  }

  get state(): AccountSnapshot {
    return this.snapshot;
  }
}
