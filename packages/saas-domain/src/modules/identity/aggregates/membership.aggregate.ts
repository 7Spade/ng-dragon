/**
 * MembershipAggregate - Event-Sourced Aggregate for Workspace Membership
 * 
 * Per Module(業務模組).md:
 * - Identity/Members is one of the 4 base modules
 * - Handles workspace membership lifecycle
 * - Tracks member roles and status
 * 
 * Per AGENTS.md:
 * - Membership USES Account, doesn't own it
 * - Membership belongs to Workspace scope
 * - Events record complete causality chain
 * 
 * Events:
 * - MemberAdded
 * - MemberRemoved
 * - MemberRoleChanged
 * - MemberActivated
 * - MemberDisabled
 */

import { DomainEvent, EventContext, toEventMetadata } from '../../../../../account-domain/src/events/domain-event';
import { MemberId } from '../value-objects/member-id';
import { Membership } from '../value-objects/membership';
import { Member } from '../entities/member.entity';

export interface MembershipSnapshot {
  workspaceId: string;
  members: Member[];
  version: number;
}

export interface MemberAddedPayload {
  memberId: string;
  workspaceId: string;
  accountId: string;
  roleType: string;
  addedByAccountId: string;
}

export interface MemberRemovedPayload {
  memberId: string;
  workspaceId: string;
  accountId: string;
  removedByAccountId: string;
}

export interface MemberRoleChangedPayload {
  memberId: string;
  workspaceId: string;
  oldRole: string;
  newRole: string;
  changedByAccountId: string;
}

export class MembershipAggregate {
  constructor(private readonly snapshot: MembershipSnapshot) {}

  /**
   * Bootstrap empty membership for new workspace
   */
  static bootstrap(workspaceId: string): MembershipAggregate {
    return new MembershipAggregate({
      workspaceId,
      members: [],
      version: 0,
    });
  }

  /**
   * Add a member to the workspace
   */
  addMember(
    accountId: string,
    roleType: string,
    context: EventContext
  ): {
    aggregate: MembershipAggregate;
    event: DomainEvent<MemberAddedPayload>;
  } {
    // Check if already a member
    if (this.snapshot.members.some((m) => m.accountId === accountId)) {
      throw new Error(`Account ${accountId} is already a member of workspace ${this.snapshot.workspaceId}`);
    }

    const memberId = new MemberId(`member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const membership = Membership.create();
    const newMember = new Member(
      memberId,
      this.snapshot.workspaceId,
      accountId,
      membership,
      roleType
    );

    const nextSnapshot: MembershipSnapshot = {
      ...this.snapshot,
      members: [...this.snapshot.members, newMember],
      version: this.snapshot.version + 1,
    };

    const payload: MemberAddedPayload = {
      memberId: memberId.getValue(),
      workspaceId: this.snapshot.workspaceId,
      accountId,
      roleType,
      addedByAccountId: context.actorId,
    };

    const event: DomainEvent<MemberAddedPayload> = {
      eventType: 'MemberAdded',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'identity',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new MembershipAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Remove a member from the workspace
   */
  removeMember(
    accountId: string,
    context: EventContext
  ): {
    aggregate: MembershipAggregate;
    event: DomainEvent<MemberRemovedPayload>;
  } {
    const member = this.snapshot.members.find((m) => m.accountId === accountId);
    if (!member) {
      throw new Error(`Account ${accountId} is not a member of workspace ${this.snapshot.workspaceId}`);
    }

    const nextSnapshot: MembershipSnapshot = {
      ...this.snapshot,
      members: this.snapshot.members.filter((m) => m.accountId !== accountId),
      version: this.snapshot.version + 1,
    };

    const payload: MemberRemovedPayload = {
      memberId: member.memberId.getValue(),
      workspaceId: this.snapshot.workspaceId,
      accountId,
      removedByAccountId: context.actorId,
    };

    const event: DomainEvent<MemberRemovedPayload> = {
      eventType: 'MemberRemoved',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'identity',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new MembershipAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Change member role
   */
  changeMemberRole(
    accountId: string,
    newRole: string,
    context: EventContext
  ): {
    aggregate: MembershipAggregate;
    event: DomainEvent<MemberRoleChangedPayload>;
  } {
    const member = this.snapshot.members.find((m) => m.accountId === accountId);
    if (!member) {
      throw new Error(`Account ${accountId} is not a member of workspace ${this.snapshot.workspaceId}`);
    }

    const updatedMember = member.changeRole(newRole);
    const nextSnapshot: MembershipSnapshot = {
      ...this.snapshot,
      members: this.snapshot.members.map((m) =>
        m.accountId === accountId ? updatedMember : m
      ),
      version: this.snapshot.version + 1,
    };

    const payload: MemberRoleChangedPayload = {
      memberId: member.memberId.getValue(),
      workspaceId: this.snapshot.workspaceId,
      oldRole: member.roleType,
      newRole,
      changedByAccountId: context.actorId,
    };

    const event: DomainEvent<MemberRoleChangedPayload> = {
      eventType: 'MemberRoleChanged',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'identity',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new MembershipAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Get current state
   */
  get state(): MembershipSnapshot {
    return this.snapshot;
  }

  /**
   * Get member by account ID
   */
  getMemberByAccountId(accountId: string): Member | undefined {
    return this.snapshot.members.find((m) => m.accountId === accountId);
  }

  /**
   * Check if account is a member
   */
  isMember(accountId: string): boolean {
    return this.snapshot.members.some((m) => m.accountId === accountId);
  }

  /**
   * Get all active members
   */
  getActiveMembers(): Member[] {
    return this.snapshot.members.filter((m) => m.isActive());
  }

  /**
   * Get total member count
   */
  getMemberCount(): number {
    return this.snapshot.members.length;
  }
}
