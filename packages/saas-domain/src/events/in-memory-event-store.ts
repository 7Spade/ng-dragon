import { OrganizationEventStore } from '../repositories/organization-repository';
import { OrganizationDomainEvent } from './organization-events';

export class InMemoryOrganizationEventStore implements OrganizationEventStore {
  private readonly events: OrganizationDomainEvent[] = [];

  async append(event: OrganizationDomainEvent): Promise<void> {
    this.events.push(event);
  }

  async appendMany(events: OrganizationDomainEvent[]): Promise<void> {
    this.events.push(...events);
  }

  async load(organizationId: string): Promise<OrganizationDomainEvent[]> {
    return this.events.filter((event) => event.aggregateId === organizationId);
  }

  async listAll(): Promise<OrganizationDomainEvent[]> {
    return [...this.events];
  }
}
