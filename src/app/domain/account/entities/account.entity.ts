/**
 * Account = Identity (User | Organization | Team | Partner | Bot)
 * Maps to @angular/fire/auth (Authentication | Token | Session | Claims)
 */

export enum AccountType {
  User = 'user',
  Organization = 'organization',
  Team = 'team',
  Partner = 'partner',
  Bot = 'bot',
}

export interface Account {
  id: string;
  type: AccountType;
  name?: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  photoURL?: string;
  orgLogo?: string;
  companyName?: string;
  memberCount?: number;
  partnerLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: Date;
  updatedAt: Date;

  // Claims for authorization
  customClaims?: Record<string, any>;

  // Metadata
  metadata?: {
    lastLoginAt?: Date;
    emailVerified?: boolean;
    disabled?: boolean;
  };
}

export interface UserAccount extends Account {
  type: AccountType.User;
  email: string;
}

export interface OrganizationAccount extends Account {
  type: AccountType.Organization;
  organizationId: string;
}

export interface BotAccount extends Account {
  type: AccountType.Bot;
  serviceAccountId: string;
}

export interface SubUnitAccount extends Account {
  type: AccountType.Team | AccountType.Partner;
  parentOrganizationId: string;
}
