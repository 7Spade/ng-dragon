/**
 * Aggregate Repository - Bridge between aggregates and event store
 * 
 * Responsibilities:
 * - Load aggregates from event stream
 * - Save aggregate changes as events
 * - Handle optimistic concurrency
 * 
 * NOT responsible for:
 * - Business logic (done by aggregates)
 * - Event storage implementation (done by Event Store)
 */

import { IEventStore, EventStream } from './event-store.interface';
import { IEventReplayer } from './event-replayer.interface';
import { EventMetadata } from '../value-objects/event-metadata';

export interface DomainEvent<TPayload = unknown> {
  readonly eventType: string;
  readonly payload: TPayload;
  readonly metadata: EventMetadata;
}

export interface AggregateRoot {
  readonly id: string;
  readonly version: number;
  getUncommittedEvents(): readonly DomainEvent[];
  clearUncommittedEvents(): void;
  markAsCommitted(version: number): void;
}

export interface IAggregateRepository<TAggregate extends AggregateRoot> {
  /**
   * Load aggregate from event store
   */
  load(aggregateId: string): Promise<TAggregate | null>;

  /**
   * Save aggregate changes as events
   */
  save(aggregate: TAggregate): Promise<void>;

  /**
   * Check if aggregate exists
   */
  exists(aggregateId: string): Promise<boolean>;
}

/**
 * Base Aggregate Repository implementation
 */
export abstract class AggregateRepository<TAggregate extends AggregateRoot>
  implements IAggregateRepository<TAggregate>
{
  constructor(
    protected readonly eventStore: IEventStore,
    protected readonly replayer: IEventReplayer<TAggregate>,
    protected readonly aggregateType: string
  ) {}

  async load(aggregateId: string): Promise<TAggregate | null> {
    const stream = await this.eventStore.getEventStream(
      aggregateId,
      this.aggregateType
    );

    if (stream.events.length === 0) {
      return null;
    }

    const result = await this.replayer.replay(stream);
    return result.aggregate;
  }

  async save(aggregate: TAggregate): Promise<void> {
    const uncommittedEvents = aggregate.getUncommittedEvents();

    if (uncommittedEvents.length === 0) {
      return;
    }

    await this.eventStore.appendEvents(
      aggregate.id,
      this.aggregateType,
      uncommittedEvents,
      { expectedVersion: aggregate.version }
    );

    aggregate.markAsCommitted(aggregate.version + uncommittedEvents.length);
    aggregate.clearUncommittedEvents();
  }

  async exists(aggregateId: string): Promise<boolean> {
    const stream = await this.eventStore.getEventStream(
      aggregateId,
      this.aggregateType
    );
    return stream.events.length > 0;
  }
}
