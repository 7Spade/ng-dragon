/**
 * Command to create a new partner workspace
 */
export interface CreatePartnerCommand {
  name: string;
  organizationId: string;
  ownerUserId: string;
  description?: string;
}
