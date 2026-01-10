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
  const metadata: DomainEvent<unknown>['metadata'] = {
    actorId: context.actorId,
    occurredAt: context.occurredAt ?? new Date().toISOString()
  };

  if (context.traceId) {
    metadata.traceId = context.traceId;
  }
  if (context.causedBy && context.causedBy.length > 0) {
    metadata.causedBy = context.causedBy;
  }

  return metadata;
}
