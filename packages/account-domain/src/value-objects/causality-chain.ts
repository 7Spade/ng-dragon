export type EventId = string;
export type TraceId = string & { readonly __brand: 'TraceId' };

/**
 * CausalityChain captures the chain of events that led to the current one.
 * It keeps a trace identifier plus the ordered list of cause event IDs.
 */
export class CausalityChain {
  private readonly causes: EventId[];

  constructor(causes: EventId[] = [], private readonly _traceId?: TraceId) {
    this.causes = [...causes];
  }

  get traceId(): TraceId | undefined {
    return this._traceId;
  }

  get causedBy(): EventId[] | undefined {
    return this.causes.length ? [...this.causes] : undefined;
  }

  addCause(eventId: EventId): CausalityChain {
    return new CausalityChain([...this.causes, eventId], this._traceId);
  }

  getRootCause(): EventId | null {
    return this.causes.length ? this.causes[0] : null;
  }

  getImmediateCause(): EventId | null {
    return this.causes.length ? this.causes[this.causes.length - 1] : null;
  }

  getDepth(): number {
    return this.causes.length;
  }

  getCauses(): readonly EventId[] {
    return this.causes;
  }
}

// Backwards compatibility shape used by existing interfaces
export interface CausalityProps {
  traceId?: TraceId;
  causedBy?: EventId[];
}
