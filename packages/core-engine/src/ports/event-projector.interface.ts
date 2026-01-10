import { EventEnvelope } from './event-store.interface';

export interface EventProjector<TPayload = unknown> {
  project(events: Array<EventEnvelope<TPayload>>): Promise<void>;
}
