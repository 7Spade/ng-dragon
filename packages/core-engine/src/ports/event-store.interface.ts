/**
 * Event Store Interface - Minimal skeleton for event sourcing
 * 
 * Responsibilities:
 * - Append-only event persistence
 * - Event retrieval by aggregate/stream
 * - Event replay capability
 * 
 * NOT responsible for:
 * - Business logic
 * - Event validation (done by aggregates)
 * - Projections (done by projectors)
 */

import { EventMetadata } from '../value-objects/event-metadata';

export interface StoredEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly payload: TPayload;
  readonly metadata: EventMetadata;
  readonly version: number;
  readonly storedAt: Date;
}

export interface EventStream {
  readonly streamId: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly events: readonly StoredEvent[];
  readonly currentVersion: number;
}

export interface AppendEventsOptions {
  readonly expectedVersion?: number; // For optimistic concurrency
  readonly transactionId?: string;
}

export interface IEventStore {
  /**
   * Append events to a stream (aggregate)
   * Throws if expectedVersion doesn't match (optimistic concurrency)
   */
  appendEvents<TPayload>(
    aggregateId: string,
    aggregateType: string,
    events: Array<{
      eventType: string;
      payload: TPayload;
      metadata: EventMetadata;
    }>,
    options?: AppendEventsOptions
  ): Promise<void>;

  /**
   * Get all events for an aggregate (for replay)
   */
  getEventStream(
    aggregateId: string,
    aggregateType: string,
    fromVersion?: number
  ): Promise<EventStream>;

  /**
   * Get events by event type (for projections)
   */
  getEventsByType(
    eventType: string,
    fromTimestamp?: Date
  ): Promise<StoredEvent[]>;

  /**
   * Get all events in container scope (for workspace replay)
   */
  getEventsInScope(
    scopeId: string,
    scopeType: string,
    fromTimestamp?: Date
  ): Promise<StoredEvent[]>;
}
