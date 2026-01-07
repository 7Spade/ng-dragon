import { OrganizationAggregate } from '../aggregates/organization.aggregate';
import { DomainEvent } from '../events/domain-event';
import { OrganizationDomainEvent } from '../events/organization-events';

export interface OrganizationEventStore {
  append(event: OrganizationDomainEvent): Promise<void>;
  appendMany(events: OrganizationDomainEvent[]): Promise<void>;
  load(organizationId: string): Promise<OrganizationDomainEvent[]>;
  listAll(): Promise<OrganizationDomainEvent[]>;
}

export interface OrganizationRepository {
  load(organizationId: string): Promise<OrganizationAggregate | null>;
  save(aggregate: OrganizationAggregate, events: DomainEvent<unknown>[]): Promise<void>;
}
