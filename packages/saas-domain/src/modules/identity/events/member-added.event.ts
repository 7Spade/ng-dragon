import { DomainEvent } from '@account-domain';

export type MemberAddedPayload = {
  memberId: string;
  workspaceId: string;
  accountId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
};

export type MemberAddedEvent = DomainEvent<MemberAddedPayload>;
