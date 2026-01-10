import { DomainEvent } from '@account-domain';

export interface MemberRemovedPayload {
  memberId: string;
  workspaceId: string;
}

export type MemberRemovedEvent = DomainEvent<MemberRemovedPayload>;
