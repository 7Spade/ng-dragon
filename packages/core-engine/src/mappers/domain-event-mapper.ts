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
  // Default to workspace scope if workspaceId exists
  const scopeId = event.workspaceId ?? event.aggregateId;
  const scopeType: 'workspace' | 'organization' | 'team' | 'project' = 'workspace';
  const containerScope = new ContainerScope(scopeId, scopeType);

  // Create causality chain from causedBy array
  const causality = new CausalityChain(event.metadata.causedBy ?? []);

  // Extract affected entities (can be enhanced)
  const affects: AffectedEntity[] = [];
  if (event.aggregateId) {
    // Determine change type from event type
    let changeType: 'created' | 'updated' | 'deleted' | 'referenced' = 'updated';
    if (event.eventType.indexOf('Created') !== -1 || event.eventType.indexOf('Added') !== -1) {
      changeType = 'created';
    } else if (event.eventType.indexOf('Deleted') !== -1 || event.eventType.indexOf('Removed') !== -1) {
      changeType = 'deleted';
    }

    affects.push(
      new AffectedEntity(
        event.eventType,
        event.aggregateId,
        changeType
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
  const scopeId = workspaceId ?? 'default';
  const scopeType: 'workspace' | 'organization' | 'team' | 'project' = 'workspace';
  const containerScope = new ContainerScope(scopeId, scopeType);

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
