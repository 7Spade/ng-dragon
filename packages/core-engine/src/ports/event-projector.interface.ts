/**
 * Event Projector - Minimal skeleton for building read models from events
 * 
 * Responsibilities:
 * - Subscribe to events
 * - Build/update read models (projections)
 * - Handle event denormalization
 * 
 * NOT responsible for:
 * - Event storage (done by Event Store)
 * - Command handling (done by aggregates)
 * - Business logic enforcement
 */

import { StoredEvent } from './event-store.interface';

export interface Projection {
  readonly id: string;
  readonly version: number;
  readonly lastEventId: string;
  readonly updatedAt: Date;
}

export interface ProjectionState {
  readonly projectionName: string;
  readonly lastProcessedEventId: string;
  readonly lastProcessedTimestamp: Date;
  readonly eventsProcessed: number;
}

export interface IEventProjector<TProjection extends Projection> {
  /**
   * Get projection name (for tracking)
   */
  getProjectionName(): string;

  /**
   * Project single event to update read model
   */
  project(event: StoredEvent, currentProjection?: TProjection): Promise<TProjection>;

  /**
   * Rebuild projection from scratch (for projection reset)
   */
  rebuild(events: readonly StoredEvent[]): Promise<TProjection>;

  /**
   * Get current projection state (for resume)
   */
  getState(): Promise<ProjectionState>;

  /**
   * Check if event should be projected
   */
  canProject(event: StoredEvent): boolean;
}

/**
 * Base Event Projector implementation
 */
export abstract class EventProjector<TProjection extends Projection>
  implements IEventProjector<TProjection>
{
  constructor(protected readonly projectionName: string) {}

  getProjectionName(): string {
    return this.projectionName;
  }

  async rebuild(events: readonly StoredEvent[]): Promise<TProjection> {
    let projection: TProjection | undefined;

    for (const event of events) {
      if (this.canProject(event)) {
        projection = await this.project(event, projection);
      }
    }

    if (!projection) {
      throw new Error(`No projectable events found for ${this.projectionName}`);
    }

    return projection;
  }

  abstract project(
    event: StoredEvent,
    currentProjection?: TProjection
  ): Promise<TProjection>;

  abstract getState(): Promise<ProjectionState>;

  abstract canProject(event: StoredEvent): boolean;
}
