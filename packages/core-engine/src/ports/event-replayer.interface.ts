/**
 * Event Replayer - Minimal skeleton for replaying events to rebuild state
 * 
 * Responsibilities:
 * - Replay events in order
 * - Apply events to aggregates
 * - Rebuild aggregate state from event stream
 * 
 * NOT responsible for:
 * - Event storage (done by Event Store)
 * - Business logic (done by aggregates)
 */

import { StoredEvent, EventStream } from './event-store.interface';

export interface ReplayResult<TAggregate> {
  readonly aggregate: TAggregate;
  readonly version: number;
  readonly lastEventId: string;
  readonly eventsReplayed: number;
}

export interface IEventReplayer<TAggregate> {
  /**
   * Replay all events to rebuild aggregate state
   */
  replay(eventStream: EventStream): Promise<ReplayResult<TAggregate>>;

  /**
   * Replay specific events (for partial replay)
   */
  replayEvents(
    initialState: TAggregate,
    events: readonly StoredEvent[]
  ): Promise<TAggregate>;
}

/**
 * Base Event Replayer implementation
 */
export abstract class EventReplayer<TAggregate> implements IEventReplayer<TAggregate> {
  constructor(protected readonly initialStateFactory: () => TAggregate) {}

  async replay(eventStream: EventStream): Promise<ReplayResult<TAggregate>> {
    const initialState = this.initialStateFactory();
    const aggregate = await this.replayEvents(initialState, eventStream.events);

    return {
      aggregate,
      version: eventStream.currentVersion,
      lastEventId: eventStream.events[eventStream.events.length - 1]?.eventId ?? '',
      eventsReplayed: eventStream.events.length,
    };
  }

  async replayEvents(
    initialState: TAggregate,
    events: readonly StoredEvent[]
  ): Promise<TAggregate> {
    let state = initialState;

    for (const event of events) {
      state = await this.applyEvent(state, event);
    }

    return state;
  }

  /**
   * Apply single event to aggregate state
   * Subclasses must implement this
   */
  protected abstract applyEvent(
    state: TAggregate,
    event: StoredEvent
  ): Promise<TAggregate>;
}
