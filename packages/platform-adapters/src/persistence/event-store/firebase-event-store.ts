import {
  AppendEventsRequest,
  AppendEventsResponse,
  EventEnvelope,
  EventStore,
  ListEventsParams,
  ReplayOptions
} from '@core-engine';

import { firestore } from '../../firebase-platform/firestore';

const EVENT_STREAMS_COLLECTION = 'event-streams';

export class FirebaseEventStore implements EventStore {
  private readonly db = firestore();

  async appendEvents<TPayload = unknown>(request: AppendEventsRequest<TPayload>): Promise<AppendEventsResponse> {
    const now = new Date().toISOString();
    return this.db.runTransaction(async tx => {
      const streamRef = this.db.collection(EVENT_STREAMS_COLLECTION).doc(request.aggregateId);
      const streamState = await tx.get(streamRef);
      const currentSequence = (streamState.exists ? (streamState.get('lastSequence') as number) : 0) ?? 0;

      if (request.expectedSequence !== undefined && currentSequence !== request.expectedSequence) {
        throw new Error(`Version mismatch: expected sequence ${request.expectedSequence}, found ${currentSequence}`);
      }

      const eventsRef = streamRef.collection('events');
      let nextSequence = currentSequence;

      request.events.forEach(write => {
        nextSequence += 1;
        const envelope: EventEnvelope<TPayload> = {
          id: `evt-${request.aggregateId}-${nextSequence}` as EventEnvelope<TPayload>['id'],
          aggregateId: request.aggregateId,
          aggregateType: request.aggregateType ?? write.event.eventType,
          sequence: nextSequence,
          event: write.event,
          metadata: {
            actorId: write.event.metadata.actorId,
            traceId: write.event.metadata.traceId,
            causedBy: write.event.metadata.causedBy,
            occurredAt: write.event.metadata.occurredAt ?? now
          },
          affectedEntities: write.affectedEntities
        };

        tx.set(eventsRef.doc(envelope.id), envelope);
      });

      tx.set(streamRef, { lastSequence: nextSequence, aggregateType: request.aggregateType ?? null, updatedAt: now }, { merge: true });
      return { nextSequence };
    });
  }

  async listEvents<TPayload = unknown>(params: ListEventsParams): Promise<Array<EventEnvelope<TPayload>>> {
    const streamRef = this.db
      .collection(EVENT_STREAMS_COLLECTION)
      .doc(params.aggregateId)
      .collection('events') as FirebaseFirestore.CollectionReference<EventEnvelope<TPayload>>;

    let queryRef: FirebaseFirestore.Query<EventEnvelope<TPayload>> = streamRef;
    if (params.afterSequence !== undefined) {
      queryRef = queryRef.where('sequence', '>', params.afterSequence);
    }
    queryRef = queryRef.orderBy('sequence', 'asc');
    if (params.limit !== undefined) {
      queryRef = queryRef.limit(params.limit);
    }

    const snapshot = await queryRef.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async replay<TPayload = unknown>(options: ReplayOptions<TPayload>): Promise<void> {
    const batchSize = options.batchSize ?? options.limit ?? 100;
    let afterSequence = options.afterSequence ?? 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const batch = await this.listEvents<TPayload>({
        aggregateId: options.aggregateId,
        afterSequence,
        limit: batchSize
      });
      if (!batch.length) break;

      await options.onEvents(batch);
      afterSequence = batch[batch.length - 1].sequence;

      if (batch.length < batchSize) break;
    }
  }
}
