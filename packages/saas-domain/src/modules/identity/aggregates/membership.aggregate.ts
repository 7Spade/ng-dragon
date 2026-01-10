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
    // Check if already a member (avoid Array.some)
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId === accountId) {
        throw new Error(`Account ${accountId} is already a member of workspace ${this.snapshot.workspaceId}`);
      }
    }

    const memberId = MemberId.generate();
    const membership = new Membership('active', new Date());
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
    // Find member without Array.find
    let member: Member | undefined;
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId === accountId) {
        member = this.snapshot.members[i];
        break;
      }
    }
    
    if (!member) {
      throw new Error(`Account ${accountId} is not a member of workspace ${this.snapshot.workspaceId}`);
    }

    // Filter members without Array.filter
    const nextMembers: Member[] = [];
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId !== accountId) {
        nextMembers.push(this.snapshot.members[i]);
      }
    }

    const nextSnapshot: MembershipSnapshot = {
      ...this.snapshot,
      members: nextMembers,
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
    // Find member without Array.find
    let member: Member | undefined;
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId === accountId) {
        member = this.snapshot.members[i];
        break;
      }
    }
    
    if (!member) {
      throw new Error(`Account ${accountId} is not a member of workspace ${this.snapshot.workspaceId}`);
    }

    const updatedMember = member.changeRole(newRole);
    
    // Map members without Array.map
    const nextMembers: Member[] = [];
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId === accountId) {
        nextMembers.push(updatedMember);
      } else {
        nextMembers.push(this.snapshot.members[i]);
      }
    }
    
    const nextSnapshot: MembershipSnapshot = {
      ...this.snapshot,
      members: nextMembers,
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
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId === accountId) {
        return this.snapshot.members[i];
      }
    }
    return undefined;
  }

  /**
   * Check if account is a member
   */
  isMember(accountId: string): boolean {
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].accountId === accountId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all active members
   */
  getActiveMembers(): Member[] {
    const activeMembers: Member[] = [];
    for (let i = 0; i < this.snapshot.members.length; i++) {
      if (this.snapshot.members[i].isActive()) {
        activeMembers.push(this.snapshot.members[i]);
      }
    }
    return activeMembers;
  }

  /**
   * Get total member count
   */
  getMemberCount(): number {
    return this.snapshot.members.length;
  }
}
