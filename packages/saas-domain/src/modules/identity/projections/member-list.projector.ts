/**
 * MemberListProjector - Build read model for workspace members
 * 
 * Responsibilities:
 * - Project MemberAdded/Removed/RoleChanged events into member list
 * - Maintain denormalized view for fast queries
 * - Support incremental updates
 * 
 * Per AGENTS.md:
 * - Projections are read models derived from events
 * - Built incrementally as events arrive
 * - Can be rebuilt from event stream
 */

import {
  EventProjector,
  Projection,
  ProjectionState,
  StoredEvent,
} from '../../../../../core-engine/src/ports/event-projector.interface';

export interface MemberProjection extends Projection {
  id: string; // workspaceId
  members: Array<{
    memberId: string;
    accountId: string;
    roleType: string;
    isActive: boolean;
    joinedAt: string;
  }>;
  version: number;
  lastEventId: string;
  updatedAt: Date;
}

export class MemberListProjector extends EventProjector<MemberProjection> {
  private state: ProjectionState = {
    projectionName: 'MemberList',
    lastProcessedEventId: '',
    lastProcessedTimestamp: new Date(0),
    eventsProcessed: 0,
  };

  constructor() {
    super('MemberList');
  }

  /**
   * Project single event to update member list
   */
  async project(
    event: StoredEvent,
    currentProjection?: MemberProjection
  ): Promise<MemberProjection> {
    const workspaceId = (event.payload as any).workspaceId;

    // Initialize projection if first event
    if (!currentProjection) {
      currentProjection = {
        id: workspaceId,
        members: [],
        version: 0,
        lastEventId: '',
        updatedAt: new Date(),
      };
    }

    let members = [...currentProjection.members];

    // Handle different event types
    switch (event.eventType) {
      case 'MemberAdded': {
        const payload = event.payload as any;
        members.push({
          memberId: payload.memberId,
          accountId: payload.accountId,
          roleType: payload.roleType,
          isActive: true,
          joinedAt: event.storedAt.toISOString(),
        });
        break;
      }

      case 'MemberRemoved': {
        const payload = event.payload as any;
        members = members.filter((m) => m.accountId !== payload.accountId);
        break;
      }

      case 'MemberRoleChanged': {
        const payload = event.payload as any;
        members = members.map((m) =>
          m.accountId === payload.accountId
            ? { ...m, roleType: payload.newRole }
            : m
        );
        break;
      }

      default:
        // Ignore unknown events
        break;
    }

    // Update state tracking
    this.state = {
      ...this.state,
      lastProcessedEventId: event.eventId,
      lastProcessedTimestamp: event.storedAt,
      eventsProcessed: this.state.eventsProcessed + 1,
    };

    return {
      ...currentProjection,
      members,
      version: currentProjection.version + 1,
      lastEventId: event.eventId,
      updatedAt: event.storedAt,
    };
  }

  /**
   * Get current projection state
   */
  async getState(): Promise<ProjectionState> {
    return this.state;
  }

  /**
   * Check if event should be projected
   */
  canProject(event: StoredEvent): boolean {
    const memberEvents = ['MemberAdded', 'MemberRemoved', 'MemberRoleChanged'];
    return memberEvents.includes(event.eventType);
  }
}
