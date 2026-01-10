/**
 * DomainEventMapper - Bridge between account-domain's DomainEvent and core-engine's EventMetadata
 * 
 * Purpose: Convert simpler domain events to richer core-engine event metadata
 * Enables causality tracking and event sourcing across the platform
 * 
 * Per AGENTS.md:
 * - core-engine provides event infrastructure
 * - account-domain uses it for business events
 * - This mapper bridges the two
 */

import { ContainerScope } from '../../../account-domain/src/value-objects/container-scope';
import { EventMetadata } from '../value-objects/event-metadata';
import { CausalityChain } from '../value-objects/causality-chain';
import { AffectedEntity } from '../value-objects/affected-entity';

/**
 * Minimal domain event structure (from account-domain)
 */
export interface SimpleDomainEvent {
  eventType: string;
  aggregateId: string;
  accountId?: string;
  workspaceId?: string;
  moduleKey?: string;
  metadata: {
    actorId: string;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
}

/**
 * Map simple domain event metadata to rich EventMetadata
 */
export function mapToEventMetadata(
  event: SimpleDomainEvent,
  eventId: string
): EventMetadata {
  // Create container scope from event context
  const containerScope = new ContainerScope(
    event.workspaceId ?? null,
    event.moduleKey ?? null
  );

  // Create causality chain from causedBy array
  const causality = new CausalityChain(event.metadata.causedBy ?? []);

  // Extract affected entities (can be enhanced)
  const affects: AffectedEntity[] = [];
  if (event.aggregateId) {
    affects.push(
      new AffectedEntity(
        event.aggregateId,
        event.eventType,
        'modified'
      )
    );
  }

  return new EventMetadata(
    eventId,
    event.metadata.traceId ?? `trace-${Date.now()}`,
    event.metadata.actorId,
    containerScope,
    causality,
    new Date(event.metadata.occurredAt),
    affects
  );
}

/**
 * Create EventMetadata from scratch for new events
 */
export function createEventMetadata(
  eventId: string,
  actorAccountId: string,
  workspaceId?: string,
  moduleKey?: string,
  causedBy?: string[],
  traceId?: string
): EventMetadata {
  const containerScope = new ContainerScope(
    workspaceId ?? null,
    moduleKey ?? null
  );

  const causality = new CausalityChain(causedBy ?? []);

  return new EventMetadata(
    eventId,
    traceId ?? `trace-${Date.now()}`,
    actorAccountId,
    containerScope,
    causality,
    new Date(),
    []
  );
}
