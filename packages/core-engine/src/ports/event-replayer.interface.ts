import { EventEnvelope, ReplayOptions } from './event-store.interface';

export interface EventReplayer<TPayload = unknown> {
  replay(options: ReplayOptions<TPayload>): Promise<void>;
  onReplay?(events: Array<EventEnvelope<TPayload>>): Promise<void>;
}
