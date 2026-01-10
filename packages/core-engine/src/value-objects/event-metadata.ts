import { AccountId } from '@account-domain';

export type EventId = string & { readonly __brand: 'EventId' };
export type TraceId = string & { readonly __brand: 'TraceId' };

export interface EventMetadata {
  actorId: AccountId;
  traceId?: TraceId;
  causedBy?: EventId[];
  occurredAt: string;
}

export const createEventMetadata = (input: {
  actorId: AccountId;
  traceId?: string;
  causedBy?: string[];
  occurredAt?: string;
}): EventMetadata => ({
  actorId: input.actorId,
  traceId: input.traceId as TraceId | undefined,
  causedBy: input.causedBy as EventId[] | undefined,
  occurredAt: input.occurredAt ?? new Date().toISOString()
});
