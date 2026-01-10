import { EventId, TraceId } from './event-metadata';

export interface CausalityChain {
  traceId?: TraceId;
  causedBy?: EventId[];
}
