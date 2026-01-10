/**
 * Team Aggregate
 * Event-sourced aggregate for managing team membership within an organization
 */

import { AggregateRoot } from '../../../core-engine/src/aggregates/aggregate-root';
import { DomainEvent } from '../../../account-domain/src/events/domain-event';
import { EventMetadata } from '../../../core-engine/src/value-objects/event-metadata';

export type TeamMemberRole = 'lead' | 'member' | 'guest';

export interface TeamMember {
  accountId: string;
  role: TeamMemberRole;
  joinedAt: Date;
}

export class TeamAggregate extends AggregateRoot {
  private members: Map<string, TeamMember> = new Map();
  private teamId: string;
  private teamName: string;
  private organizationId: string;

  constructor(teamId: string, teamName: string, organizationId: string) {
    super();
    this.teamId = teamId;
    this.teamName = teamName;
    this.organizationId = organizationId;
  }

  /**
   * Add a member to the team
   */
  addMember(
    accountId: string,
    role: TeamMemberRole,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    if (this.members.has(accountId)) {
      throw new Error(`Member ${accountId} already exists in team`);
    }

    // Create event
    const event = new DomainEvent(
      'TeamMemberAdded',
      {
        teamId: this.teamId,
        teamName: this.teamName,
        organizationId: this.organizationId,
        accountId,
        role,
        addedAt: new Date()
      },
      metadata
    );

    // Apply event
    this.applyEvent(event);

    return { event };
  }

  /**
   * Remove a member from the team
   */
  removeMember(
    accountId: string,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    if (!this.members.has(accountId)) {
      throw new Error(`Member ${accountId} not found in team`);
    }

    // Create event
    const event = new DomainEvent(
      'TeamMemberRemoved',
      {
        teamId: this.teamId,
        organizationId: this.organizationId,
        accountId,
        removedAt: new Date()
      },
      metadata
    );

    // Apply event
    this.applyEvent(event);

    return { event };
  }

  /**
   * Change a member's role
   */
  changeMemberRole(
    accountId: string,
    newRole: TeamMemberRole,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    const member = this.members.get(accountId);
    if (!member) {
      throw new Error(`Member ${accountId} not found in team`);
    }

    if (member.role === newRole) {
      throw new Error(`Member already has role ${newRole}`);
    }

    // Create event
    const event = new DomainEvent(
      'TeamMemberRoleChanged',
      {
        teamId: this.teamId,
        organizationId: this.organizationId,
        accountId,
        oldRole: member.role,
        newRole,
        changedAt: new Date()
      },
      metadata
    );

    // Apply event
    this.applyEvent(event);

    return { event };
  }

  /**
   * Get all team members
   */
  getMembers(): TeamMember[] {
    const result: TeamMember[] = [];
    this.members.forEach(member => {
      result.push(member);
    });
    return result;
  }

  /**
   * Check if account is a member
   */
  isMember(accountId: string): boolean {
    return this.members.has(accountId);
  }

  /**
   * Apply event to update internal state
   */
  protected applyEvent(event: DomainEvent): void {
    switch (event.type) {
      case 'TeamMemberAdded':
        this.members.set(event.payload.accountId, {
          accountId: event.payload.accountId,
          role: event.payload.role,
          joinedAt: event.payload.addedAt
        });
        break;

      case 'TeamMemberRemoved':
        this.members.delete(event.payload.accountId);
        break;

      case 'TeamMemberRoleChanged':
        const member = this.members.get(event.payload.accountId);
        if (member) {
          member.role = event.payload.newRole;
        }
        break;
    }

    this.version++;
  }
}
