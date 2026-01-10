import { DomainEvent } from '@account-domain';

import { AffectedEntity, CausalityChain, EventId, EventMetadata } from '../value-objects';

export interface EventEnvelope<TPayload = unknown> {
  id: EventId;
  aggregateId: string;
  aggregateType: string;
  sequence: number;
  event: DomainEvent<TPayload>;
  metadata: EventMetadata;
  affectedEntities?: AffectedEntity[];
}

export interface EventWrite<TPayload = unknown> {
  event: DomainEvent<TPayload>;
  affectedEntities?: AffectedEntity[];
}

export interface AppendEventsRequest<TPayload = unknown> extends CausalityChain {
  aggregateId: string;
  aggregateType?: string;
  events: EventWrite<TPayload>[];
  expectedSequence?: number;
}

export interface AppendEventsResponse {
  nextSequence: number;
}

export interface ListEventsParams {
  aggregateId: string;
  afterSequence?: number;
  limit?: number;
}

export interface ReplayOptions<TPayload = unknown> extends ListEventsParams {
  batchSize?: number;
  onEvents: (events: EventEnvelope<TPayload>[]) => Promise<void> | void;
}

export interface EventStore {
  appendEvents<TPayload = unknown>(request: AppendEventsRequest<TPayload>): Promise<AppendEventsResponse>;
  listEvents<TPayload = unknown>(params: ListEventsParams): Promise<Array<EventEnvelope<TPayload>>>;
  replay<TPayload = unknown>(options: ReplayOptions<TPayload>): Promise<void>;
}
