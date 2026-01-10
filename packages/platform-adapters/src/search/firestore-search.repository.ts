import { normalizeSearchQuery, SearchQuery, SearchRepository } from '@core-engine';

import { getCollection } from '../firebase-platform/firestore';

const DEFAULT_COLLECTION = 'search-index';

export class FirestoreSearchRepository<TResult extends Record<string, unknown> = Record<string, unknown>>
  implements SearchRepository<TResult>
{
  constructor(private readonly collectionName: string = DEFAULT_COLLECTION) {}

  async search(query: SearchQuery): Promise<TResult[]> {
    const normalized = normalizeSearchQuery(query);
    if (!normalized.term) return [];

    const ref = getCollection<TResult>(this.collectionName)
      .where('terms', 'array-contains', normalized.term.toLowerCase())
      .limit(normalized.limit);

    const snapshot = await ref.get();
    return snapshot.docs.map(doc => doc.data() as TResult);
  }
}
