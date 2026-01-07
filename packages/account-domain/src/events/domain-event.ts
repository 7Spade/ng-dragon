import { AccountId, ModuleKey, WorkspaceId } from '../types/identifiers';

export interface EventContext {
  actorId: AccountId;
  traceId?: string;
  causedBy?: string[];
  occurredAt?: string;
}

export interface DomainEvent<TPayload> {
  eventType: string;
  aggregateId: string;
  accountId?: AccountId;
  workspaceId?: WorkspaceId;
  moduleKey?: ModuleKey;
  payload: TPayload;
  metadata: {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
}

export function toEventMetadata(context: EventContext): DomainEvent<unknown>['metadata'] {
  return {
    actorId: context.actorId,
    traceId: context.traceId,
    causedBy: context.causedBy,
    occurredAt: context.occurredAt ?? new Date().toISOString(),
  };
}
