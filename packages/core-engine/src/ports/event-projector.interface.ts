import { EventEnvelope } from './event-store.interface';

export interface EventProjector<TPayload = unknown> {
  project(events: EventEnvelope<TPayload>[]): Promise<void>;
}
