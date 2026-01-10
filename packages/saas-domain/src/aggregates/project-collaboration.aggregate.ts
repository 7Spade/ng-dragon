/**
 * Project Collaboration Aggregate
 * Event-sourced aggregate for managing cross-organization project collaborators
 */

import { AggregateRoot } from '../../../core-engine/src/aggregates/aggregate-root';
import { DomainEvent } from '../../../account-domain/src/events/domain-event';
import { EventMetadata } from '../../../core-engine/src/value-objects/event-metadata';

export type CollaboratorRole = 'viewer' | 'contributor' | 'maintainer';
export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface Collaborator {
  inviteeId: string; // Can be userId or organizationId
  inviteeType: 'user' | 'organization';
  role: CollaboratorRole;
  status: InvitationStatus;
  invitedAt: Date;
  acceptedAt?: Date;
}

export class ProjectCollaborationAggregate extends AggregateRoot {
  private collaborators: Map<string, Collaborator> = new Map();
  private projectId: string;
  private projectName: string;
  private ownerOrganizationId: string;

  constructor(projectId: string, projectName: string, ownerOrganizationId: string) {
    super();
    this.projectId = projectId;
    this.projectName = projectName;
    this.ownerOrganizationId = ownerOrganizationId;
  }

  /**
   * Invite a collaborator to the project
   */
  inviteCollaborator(
    inviteeId: string,
    inviteeType: 'user' | 'organization',
    role: CollaboratorRole,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    if (this.collaborators.has(inviteeId)) {
      const existing = this.collaborators.get(inviteeId);
      if (existing && existing.status === 'pending') {
        throw new Error(`Invitation already pending for ${inviteeId}`);
      }
      if (existing && existing.status === 'accepted') {
        throw new Error(`${inviteeId} is already a collaborator`);
      }
    }

    // Create event
    const event = new DomainEvent(
      'CollaboratorInvited',
      {
        projectId: this.projectId,
        projectName: this.projectName,
        ownerOrganizationId: this.ownerOrganizationId,
        inviteeId,
        inviteeType,
        role,
        invitedAt: new Date()
      },
      metadata
    );

    // Apply event
    this.applyEvent(event);

    return { event };
  }

  /**
   * Accept a collaboration invitation
   */
  acceptInvitation(
    inviteeId: string,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    const collaborator = this.collaborators.get(inviteeId);
    if (!collaborator) {
      throw new Error(`No invitation found for ${inviteeId}`);
    }

    if (collaborator.status !== 'pending') {
      throw new Error(`Invitation is not pending for ${inviteeId}`);
    }

    // Create event
    const event = new DomainEvent(
      'CollaboratorAccepted',
      {
        projectId: this.projectId,
        inviteeId,
        role: collaborator.role,
        acceptedAt: new Date()
      },
      metadata
    );

    // Apply event
    this.applyEvent(event);

    return { event };
  }

  /**
   * Remove a collaborator from the project
   */
  removeCollaborator(
    inviteeId: string,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    if (!this.collaborators.has(inviteeId)) {
      throw new Error(`Collaborator ${inviteeId} not found`);
    }

    // Create event
    const event = new DomainEvent(
      'CollaboratorRemoved',
      {
        projectId: this.projectId,
        inviteeId,
        removedAt: new Date()
      },
      metadata
    );

    // Apply event
    this.applyEvent(event);

    return { event };
  }

  /**
   * Change a collaborator's role
   */
  changeCollaboratorRole(
    inviteeId: string,
    newRole: CollaboratorRole,
    metadata: EventMetadata
  ): { event: DomainEvent } {
    // Validation
    const collaborator = this.collaborators.get(inviteeId);
    if (!collaborator) {
      throw new Error(`Collaborator ${inviteeId} not found`);
    }

    if (collaborator.status !== 'accepted') {
      throw new Error(`Cannot change role for non-accepted collaborator`);
    }

    if (collaborator.role === newRole) {
      throw new Error(`Collaborator already has role ${newRole}`);
    }

    // Create event
    const event = new DomainEvent(
      'CollaboratorRoleChanged',
      {
        projectId: this.projectId,
        inviteeId,
        oldRole: collaborator.role,
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
   * Get all collaborators
   */
  getCollaborators(): Collaborator[] {
    const result: Collaborator[] = [];
    this.collaborators.forEach(collab => {
      result.push(collab);
    });
    return result;
  }

  /**
   * Get pending invitations
   */
  getPendingInvitations(): Collaborator[] {
    const result: Collaborator[] = [];
    this.collaborators.forEach(collab => {
      if (collab.status === 'pending') {
        result.push(collab);
      }
    });
    return result;
  }

  /**
   * Apply event to update internal state
   */
  protected applyEvent(event: DomainEvent): void {
    switch (event.type) {
      case 'CollaboratorInvited':
        this.collaborators.set(event.payload.inviteeId, {
          inviteeId: event.payload.inviteeId,
          inviteeType: event.payload.inviteeType,
          role: event.payload.role,
          status: 'pending',
          invitedAt: event.payload.invitedAt
        });
        break;

      case 'CollaboratorAccepted':
        const pending = this.collaborators.get(event.payload.inviteeId);
        if (pending) {
          pending.status = 'accepted';
          pending.acceptedAt = event.payload.acceptedAt;
        }
        break;

      case 'CollaboratorRemoved':
        this.collaborators.delete(event.payload.inviteeId);
        break;

      case 'CollaboratorRoleChanged':
        const collaborator = this.collaborators.get(event.payload.inviteeId);
        if (collaborator) {
          collaborator.role = event.payload.newRole;
        }
        break;
    }

    this.version++;
  }
}
