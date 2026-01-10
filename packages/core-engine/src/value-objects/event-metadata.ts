/**
 * EventMetadata - Complete Event Context Value Object
 * 
 * Combines all event context information:
 * - Actor (who triggered the event)
 * - Container Scope (where the event occurred)
 * - Causality Chain (why the event occurred - parent events)
 * - Affected Entities (what was impacted)
 * - Temporal information (when)
 * 
 * Per architectural docs:
 * - Account (ActorIdentity): 誰 (Who)
 * - Workspace (ContainerScope): 在哪裡 (Where)
 * - Event: 發生了什麼、為什麼 (What happened, Why)
 * - Causality: Event metadata 中的因果鏈
 */
import { ContainerScope } from '../../../account-domain/src/value-objects/container-scope';
import { CausalityChain } from './causality-chain';
import { AffectedEntity } from './affected-entity';

export class EventMetadata {
  constructor(
    public readonly eventId: string,
    public readonly traceId: string,
    public readonly actorAccountId: string,
    public readonly containerScope: ContainerScope,
    public readonly causality: CausalityChain,
    public readonly occurredAt: Date,
    public readonly affects: AffectedEntity[] = []
  ) {
    if (!eventId || eventId.trim().length === 0) {
      throw new Error('Event ID cannot be empty');
    }
    if (!traceId || traceId.trim().length === 0) {
      throw new Error('Trace ID cannot be empty');
    }
    if (!actorAccountId || actorAccountId.trim().length === 0) {
      throw new Error('Actor account ID cannot be empty');
    }
  }

  /**
   * Create a new EventMetadata with an additional cause added to the causality chain
   */
  withAdditionalCause(parentEventId: string): EventMetadata {
    return new EventMetadata(
      this.eventId,
      this.traceId,
      this.actorAccountId,
      this.containerScope,
      this.causality.addCause(parentEventId),
      this.occurredAt,
      this.affects
    );
  }

  /**
   * Create a new EventMetadata with an additional affected entity
   */
  withAdditionalAffect(entity: AffectedEntity): EventMetadata {
    return new EventMetadata(
      this.eventId,
      this.traceId,
      this.actorAccountId,
      this.containerScope,
      this.causality,
      this.occurredAt,
      [...this.affects, entity]
    );
  }

  /**
   * Get a summary string for debugging
   */
  toString(): string {
    return `Event[${this.eventId}] by ${this.actorAccountId} in ${this.containerScope.toString()} at ${this.occurredAt.toISOString()}`;
  }
}
