/**
 * Members Module Types
 * Provides types for workspace member management
 */

import { WorkspaceId, AccountId } from '../../types/identifiers';
import { MemberRole } from '../../value-objects/member-role';

/**
 * Member status
 */
export type MemberStatus = 'active' | 'inactive' | 'invited' | 'suspended';

/**
 * Member input for adding to workspace
 */
export interface MemberInput {
  accountId: AccountId;
  role: MemberRole;
  accountType?: 'user' | 'service';
  metadata?: Record<string, any>;
}

/**
 * Member entity
 */
export interface Member {
  memberId: string;
  workspaceId: WorkspaceId;
  accountId: AccountId;
  role: MemberRole;
  accountType: 'user' | 'service';
  status: MemberStatus;
  metadata: Record<string, any>;
  addedBy: AccountId;
  addedAt: string;
  updatedAt: string;
}

/**
 * Member query options
 */
export interface MemberQueryOptions {
  role?: MemberRole;
  status?: MemberStatus;
  accountType?: 'user' | 'service';
  limit?: number;
  offset?: number;
}

/**
 * Member invitation
 */
export interface MemberInvitation {
  invitationId: string;
  workspaceId: WorkspaceId;
  email: string;
  role: MemberRole;
  invitedBy: AccountId;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}
