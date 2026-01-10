/**
 * AffectedEntity - Tracks entities affected by an event
 * 
 * Used in EventMetadata.affects[] to track cross-entity impact
 * Enables understanding which entities are modified by an event
 */
export class AffectedEntity {
  constructor(
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly changeType: 'created' | 'updated' | 'deleted' | 'referenced'
  ) {
    if (!entityType || entityType.trim().length === 0) {
      throw new Error('Entity type cannot be empty');
    }
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('Entity ID cannot be empty');
    }
  }

  /**
   * Check equality with another affected entity
   */
  equals(other: AffectedEntity): boolean {
    return (
      this.entityType === other.entityType &&
      this.entityId === other.entityId &&
      this.changeType === other.changeType
    );
  }

  /**
   * Get a string representation for debugging
   */
  toString(): string {
    return `${this.changeType}:${this.entityType}:${this.entityId}`;
  }
}
