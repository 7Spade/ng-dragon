import { AccountId } from '@account-domain/src/types/identifiers';

export interface CreateOrganizationCommand {
  accountId: AccountId;
  displayName: string;
  traceId?: string;
}
