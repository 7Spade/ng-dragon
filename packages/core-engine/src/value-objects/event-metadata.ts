import { ContainerScope } from '@account-domain';

import { AffectedEntity } from './affected-entity';
import { CausalityChain, EventId } from './causality-chain';

export type TraceId = string & { readonly __brand: 'TraceId' };

export interface EventMetadataInput {
  eventId: EventId;
  actorAccountId: string;
  containerScope: ContainerScope;
  causality?: CausalityChain;
  occurredAt?: Date;
  affects?: AffectedEntity[];
  traceId?: TraceId;
}

export class EventMetadata {
  readonly eventId: EventId;
  readonly traceId: TraceId;
  readonly actorAccountId: string;
  readonly containerScope: ContainerScope;
  readonly causality: CausalityChain;
  readonly occurredAt: Date;
  readonly affects: readonly AffectedEntity[];

  constructor(input: EventMetadataInput) {
    this.eventId = input.eventId;
    this.traceId = input.traceId ?? (`trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}` as TraceId);
    this.actorAccountId = input.actorAccountId;
    this.containerScope = input.containerScope;
    this.causality = input.causality ?? new CausalityChain();
    this.occurredAt = input.occurredAt ?? new Date();
    this.affects = input.affects ?? [];
  }

  withAdditionalCause(eventId: EventId): EventMetadata {
    return new EventMetadata({
      ...this,
      causality: this.causality.addCause(eventId)
    });
  }

  withAdditionalAffect(entity: AffectedEntity): EventMetadata {
    return new EventMetadata({
      ...this,
      affects: [...this.affects, entity]
    });
  }
}

// Compatibility helper aligned with existing DomainEvent metadata shape
export const createEventMetadata = (input: {
  actorId: string;
  traceId?: string;
  causedBy?: string[];
  occurredAt?: string;
}): {
  actorId: string;
  traceId?: string;
  causedBy?: string[];
  occurredAt: string;
} => ({
  actorId: input.actorId,
  traceId: input.traceId,
  causedBy: input.causedBy,
  occurredAt: input.occurredAt ?? new Date().toISOString()
});
