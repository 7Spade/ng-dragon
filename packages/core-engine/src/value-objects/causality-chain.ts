/**
 * CausalityChain - Event Causality Tracking Value Object
 * 
 * Per Causality-Belongs-Where.md:
 * - Causality belongs to Event metadata, not Account/Workspace/Module
 * - Causality is the relationship between events
 * - Enables event replay and audit trails
 * 
 * Flow: Account → Workspace → Module → Entity → Event → Causality
 */
export class CausalityChain {
  private readonly causes: string[] = [];

  constructor(initialCauses: string[] = []) {
    this.causes = [...initialCauses];
  }

  /**
   * Add a new cause (parent event) to the chain
   * Returns a new CausalityChain instance (immutable)
   */
  addCause(eventId: string): CausalityChain {
    if (!eventId || eventId.trim().length === 0) {
      throw new Error('Event ID for causality cannot be empty');
    }
    return new CausalityChain([...this.causes, eventId]);
  }

  /**
   * Get the root cause (first event in the chain)
   */
  getRootCause(): string | null {
    return this.causes.length > 0 ? this.causes[0] : null;
  }

  /**
   * Get the immediate cause (last event in the chain)
   */
  getImmediateCause(): string | null {
    return this.causes.length > 0 ? this.causes[this.causes.length - 1] : null;
  }

  /**
   * Get the depth of the causality chain
   */
  getDepth(): number {
    return this.causes.length;
  }

  /**
   * Get all causes in the chain (readonly)
   */
  getCauses(): readonly string[] {
    return this.causes;
  }

  /**
   * Check if this event was caused by a specific event
   */
  wasCausedBy(eventId: string): boolean {
    return this.causes.includes(eventId);
  }

  /**
   * Get a string representation for debugging
   */
  toString(): string {
    if (this.causes.length === 0) {
      return '[no causality]';
    }
    return this.causes.join(' → ');
  }
}
