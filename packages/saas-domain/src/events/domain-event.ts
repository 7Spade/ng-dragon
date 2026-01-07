import { AccountId, EntityId, ModuleKey, WorkspaceId } from '@account-domain/src/types/identifiers';

export interface EventContext {
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  actorId: AccountId;
  traceId?: string;
  causedBy?: string[];
  occurredAt?: string;
}

export interface DomainEvent<TPayload> {
  eventType: string;
  aggregateId: EntityId;
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  organizationId?: EntityId;
  accountId?: AccountId;
  payload: TPayload;
  metadata: EventMetadata;
}

export interface EventMetadata {
  actorId: AccountId;
  traceId?: string;
  causedBy?: string[];
  occurredAt: string;
}

export function toEventMetadata(context: EventContext): EventMetadata {
  return {
    actorId: context.actorId,
    traceId: context.traceId,
    causedBy: context.causedBy,
    occurredAt: context.occurredAt ?? new Date().toISOString(),
  };
}
