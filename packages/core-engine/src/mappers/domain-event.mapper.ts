import { DomainEvent, EventId, createEventMetadata } from '@account-domain';

import { EventEnvelope } from '../ports';

const randomId = (): EventId => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}` as EventId;

export const toEventEnvelope = <TPayload = unknown>(
  event: DomainEvent<TPayload>,
  aggregateType: string,
  sequence: number
): EventEnvelope<TPayload> => ({
  id: (event.metadata?.traceId as EventId) ?? randomId(),
  aggregateId: event.aggregateId,
  aggregateType,
  sequence,
  event: {
    ...event,
    metadata: createEventMetadata({
      actorId: event.metadata.actorId,
      traceId: event.metadata.traceId,
      causedBy: event.metadata.causedBy,
      occurredAt: event.metadata.occurredAt
    })
  },
  metadata: createEventMetadata({
    actorId: event.metadata.actorId,
    traceId: event.metadata.traceId,
    causedBy: event.metadata.causedBy,
    occurredAt: event.metadata.occurredAt
  })
});
