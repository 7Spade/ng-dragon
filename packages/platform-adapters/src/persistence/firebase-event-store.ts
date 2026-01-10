/**
 * Firebase Event Store Implementation
 * 
 * Responsibilities:
 * - Append-only event storage in Firestore
 * - Optimistic concurrency control
 * - Event retrieval by aggregate or scope
 * - Support for event replay
 * 
 * Per AGENTS.md:
 * - platform-adapters is the ONLY place for Firebase SDK
 * - Implements core-engine's IEventStore interface
 * - Provides persistence for event sourcing
 * 
 * Firestore Structure:
 * /events/{eventId}
 *   - eventType, aggregateId, aggregateType
 *   - payload, metadata
 *   - version, storedAt
 * /event-streams/{aggregateType}/{aggregateId}
 *   - currentVersion
 *   - lastEventId
 * 
 * Security:
 * - Events are immutable (append-only)
 * - Use transactions for optimistic concurrency
 */

import {
  Firestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
  QueryConstraint,
} from 'firebase/firestore';

import {
  IEventStore,
  StoredEvent,
  EventStream,
  AppendEventsOptions,
} from '../../../core-engine/src/ports/event-store.interface';
import { EventMetadata } from '../../../core-engine/src/value-objects/event-metadata';

export class FirebaseEventStore implements IEventStore {
  private readonly eventsCollection = 'events';
  private readonly streamsCollection = 'event-streams';

  constructor(private readonly firestore: Firestore) {}

  /**
   * Append events to a stream with optimistic concurrency control
   */
  async appendEvents<TPayload>(
    aggregateId: string,
    aggregateType: string,
    events: Array<{
      eventType: string;
      payload: TPayload;
      metadata: EventMetadata;
    }>,
    options?: AppendEventsOptions
  ): Promise<void> {
    const streamDocRef = doc(
      this.firestore,
      this.streamsCollection,
      `${aggregateType}/${aggregateId}`
    );

    await runTransaction(this.firestore, async (transaction) => {
      // Get current stream version
      const streamDoc = await transaction.get(streamDocRef);
      const currentVersion = streamDoc.exists() ? streamDoc.data().currentVersion : 0;

      // Check optimistic concurrency
      if (options?.expectedVersion !== undefined && currentVersion !== options.expectedVersion) {
        throw new Error(
          `Concurrency conflict: expected version ${options.expectedVersion}, got ${currentVersion}`
        );
      }

      // Append each event
      let version = currentVersion;
      const eventsCollectionRef = collection(this.firestore, this.eventsCollection);
      
      for (const event of events) {
        version++;
        const eventDoc = {
          eventType: event.eventType,
          aggregateId,
          aggregateType,
          payload: event.payload,
          metadata: this.serializeMetadata(event.metadata),
          version,
          storedAt: Timestamp.now(),
        };

        const eventRef = doc(eventsCollectionRef);
        transaction.set(eventRef, eventDoc);
      }

      // Update stream metadata
      const streamData = {
        currentVersion: version,
        lastEventId: events[events.length - 1]?.metadata.eventId ?? '',
        aggregateId,
        aggregateType,
        updatedAt: Timestamp.now(),
      };

      if (streamDoc.exists()) {
        transaction.update(streamDocRef, streamData);
      } else {
        transaction.set(streamDocRef, {
          ...streamData,
          createdAt: Timestamp.now(),
        });
      }
    });
  }

  /**
   * Get all events for an aggregate (for replay)
   */
  async getEventStream(
    aggregateId: string,
    aggregateType: string,
    fromVersion?: number
  ): Promise<EventStream> {
    const eventsCollectionRef = collection(this.firestore, this.eventsCollection);
    
    const constraints: QueryConstraint[] = [
      where('aggregateId', '==', aggregateId),
      where('aggregateType', '==', aggregateType),
      orderBy('version', 'asc'),
    ];

    if (fromVersion !== undefined) {
      constraints.push(where('version', '>', fromVersion));
    }

    const q = query(eventsCollectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const events: StoredEvent[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        eventId: doc.id,
        eventType: data.eventType,
        aggregateId: data.aggregateId,
        aggregateType: data.aggregateType,
        payload: data.payload,
        metadata: this.deserializeMetadata(data.metadata),
        version: data.version,
        storedAt: data.storedAt.toDate(),
      });
    });

    // Get stream metadata
    const streamDocRef = doc(
      this.firestore,
      this.streamsCollection,
      `${aggregateType}/${aggregateId}`
    );
    const streamDoc = await getDoc(streamDocRef);
    const currentVersion = streamDoc.exists() ? streamDoc.data().currentVersion : 0;

    return {
      streamId: `${aggregateType}/${aggregateId}`,
      aggregateId,
      aggregateType,
      events,
      currentVersion,
    };
  }

  /**
   * Get events by event type (for projections)
   */
  async getEventsByType(eventType: string, fromTimestamp?: Date): Promise<StoredEvent[]> {
    const eventsCollectionRef = collection(this.firestore, this.eventsCollection);
    
    const constraints: QueryConstraint[] = [
      where('eventType', '==', eventType),
      orderBy('storedAt', 'asc'),
    ];

    if (fromTimestamp) {
      constraints.push(where('storedAt', '>=', Timestamp.fromDate(fromTimestamp)));
    }

    const q = query(eventsCollectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const events: StoredEvent[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        eventId: doc.id,
        eventType: data.eventType,
        aggregateId: data.aggregateId,
        aggregateType: data.aggregateType,
        payload: data.payload,
        metadata: this.deserializeMetadata(data.metadata),
        version: data.version,
        storedAt: data.storedAt.toDate(),
      });
    });

    return events;
  }

  /**
   * Get all events in container scope (for workspace replay)
   */
  async getEventsInScope(
    scopeId: string,
    scopeType: string,
    fromTimestamp?: Date
  ): Promise<StoredEvent[]> {
    const eventsCollectionRef = collection(this.firestore, this.eventsCollection);
    
    // Query by scope in metadata
    const constraints: QueryConstraint[] = [
      where(`metadata.containerScope.${scopeType}`, '==', scopeId),
      orderBy('storedAt', 'asc'),
    ];

    if (fromTimestamp) {
      constraints.push(where('storedAt', '>=', Timestamp.fromDate(fromTimestamp)));
    }

    const q = query(eventsCollectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const events: StoredEvent[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        eventId: doc.id,
        eventType: data.eventType,
        aggregateId: data.aggregateId,
        aggregateType: data.aggregateType,
        payload: data.payload,
        metadata: this.deserializeMetadata(data.metadata),
        version: data.version,
        storedAt: data.storedAt.toDate(),
      });
    });

    return events;
  }

  /**
   * Serialize EventMetadata for Firestore storage
   */
  private serializeMetadata(metadata: EventMetadata): Record<string, unknown> {
    return {
      eventId: metadata.eventId,
      traceId: metadata.traceId,
      actorAccountId: metadata.actorAccountId,
      containerScope: {
        scopeId: metadata.containerScope.scopeId,
        scopeType: metadata.containerScope.scopeType,
      },
      causality: {
        causes: metadata.causality.getCauses(),
      },
      occurredAt: Timestamp.fromDate(metadata.occurredAt),
      affects: metadata.affects.map((a) => ({
        entityId: a.entityId,
        entityType: a.entityType,
        changeType: a.changeType,
      })),
    };
  }

  /**
   * Deserialize Firestore data to EventMetadata
   * Note: This is a simplified version - full reconstruction would require importing classes
   */
  private deserializeMetadata(data: any): EventMetadata {
    // In a real implementation, we'd fully reconstruct EventMetadata
    // For now, return a plain object that matches the interface
    return data as EventMetadata;
  }
}
