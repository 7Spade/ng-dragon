/**
 * MembershipApplicationService - Application Service for Membership Module
 * 
 * Responsibilities:
 * - Orchestrate member management use cases
 * - Load and save aggregates via event store
 * - Publish domain events
 * 
 * Per AGENTS.md:
 * - Application layer orchestrates domain logic
 * - Uses core-engine event store
 * - Does NOT contain business rules (those are in aggregate)
 */

import { IEventStore } from '../../../../../core-engine/src/ports/event-store.interface';
import { MembershipAggregate, MemberAddedPayload, MemberRemovedPayload, MemberRoleChangedPayload } from '../aggregates/membership.aggregate';
import { EventContext } from '../../../../../account-domain/src/events/domain-event';
import { mapToEventMetadata } from '../../../../../core-engine/src/mappers/domain-event-mapper';

export interface AddMemberCommand {
  workspaceId: string;
  accountId: string;
  roleType: string;
  actorId: string;
  traceId?: string;
  causedBy?: string[];
}

export interface RemoveMemberCommand {
  workspaceId: string;
  accountId: string;
  actorId: string;
  traceId?: string;
  causedBy?: string[];
}

export interface ChangeMemberRoleCommand {
  workspaceId: string;
  accountId: string;
  newRole: string;
  actorId: string;
  traceId?: string;
  causedBy?: string[];
}

export class MembershipApplicationService {
  constructor(private readonly eventStore: IEventStore) {}

  /**
   * Add a member to workspace
   */
  async addMember(command: AddMemberCommand): Promise<string> {
    // Load current state from event stream
    const eventStream = await this.eventStore.getEventStream(
      command.workspaceId,
      'Membership',
      0
    );

    // Replay events to rebuild aggregate
    let aggregate: MembershipAggregate;
    if (eventStream.events.length === 0) {
      // Bootstrap new aggregate
      aggregate = MembershipAggregate.bootstrap(command.workspaceId);
    } else {
      // Rebuild from events (simplified - should use replayer)
      aggregate = MembershipAggregate.bootstrap(command.workspaceId);
      // TODO: Use EventReplayer to properly rebuild state
    }

    // Execute business logic
    const context: EventContext = {
      actorId: command.actorId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: new Date().toISOString(),
    };

    const { aggregate: nextAggregate, event } = aggregate.addMember(
      command.accountId,
      command.roleType,
      context
    );

    // Convert event to store format
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metadata = mapToEventMetadata(event, eventId);

    // Append event to stream
    await this.eventStore.appendEvents<MemberAddedPayload>(
      command.workspaceId,
      'Membership',
      [
        {
          eventType: event.eventType,
          payload: event.payload,
          metadata,
        },
      ],
      {
        expectedVersion: eventStream.currentVersion,
      }
    );

    return event.payload.memberId;
  }

  /**
   * Remove a member from workspace
   */
  async removeMember(command: RemoveMemberCommand): Promise<void> {
    const eventStream = await this.eventStore.getEventStream(
      command.workspaceId,
      'Membership',
      0
    );

    if (eventStream.events.length === 0) {
      throw new Error(`No membership found for workspace ${command.workspaceId}`);
    }

    // Rebuild aggregate (simplified)
    const aggregate = MembershipAggregate.bootstrap(command.workspaceId);
    // TODO: Use EventReplayer

    const context: EventContext = {
      actorId: command.actorId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: new Date().toISOString(),
    };

    const { event } = aggregate.removeMember(command.accountId, context);

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metadata = mapToEventMetadata(event, eventId);

    await this.eventStore.appendEvents<MemberRemovedPayload>(
      command.workspaceId,
      'Membership',
      [
        {
          eventType: event.eventType,
          payload: event.payload,
          metadata,
        },
      ],
      {
        expectedVersion: eventStream.currentVersion,
      }
    );
  }

  /**
   * Change member role
   */
  async changeMemberRole(command: ChangeMemberRoleCommand): Promise<void> {
    const eventStream = await this.eventStore.getEventStream(
      command.workspaceId,
      'Membership',
      0
    );

    if (eventStream.events.length === 0) {
      throw new Error(`No membership found for workspace ${command.workspaceId}`);
    }

    const aggregate = MembershipAggregate.bootstrap(command.workspaceId);
    // TODO: Use EventReplayer

    const context: EventContext = {
      actorId: command.actorId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: new Date().toISOString(),
    };

    const { event } = aggregate.changeMemberRole(
      command.accountId,
      command.newRole,
      context
    );

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metadata = mapToEventMetadata(event, eventId);

    await this.eventStore.appendEvents<MemberRoleChangedPayload>(
      command.workspaceId,
      'Membership',
      [
        {
          eventType: event.eventType,
          payload: event.payload,
          metadata,
        },
      ],
      {
        expectedVersion: eventStream.currentVersion,
      }
    );
  }
}
