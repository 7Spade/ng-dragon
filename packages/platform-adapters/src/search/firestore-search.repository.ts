/**
 * Firestore Search Repository Implementation
 * Implements global search across User, Organization, and Project collections
 * 
 * Note: Requires Firestore composite indexes for efficient queries
 */

import { Firestore, collection, query, where, limit as firestoreLimit, getDocs } from 'firebase/firestore';
import { ISearchRepository } from '../../core-engine/src/ports/isearch-repository';
import { SearchQuery, SearchResponse, SearchResult, SearchEntityType } from '../../core-engine/src/queries/search-query';

export class FirestoreSearchRepository implements ISearchRepository {
  constructor(private readonly firestore: Firestore) {}

  async search(searchQuery: SearchQuery): Promise<SearchResponse> {
    const results: SearchResult[] = [];

    // Execute parallel searches across all requested entity types
    const searchPromises = searchQuery.entityTypes.map(entityType =>
      this.searchByEntityType(entityType, searchQuery)
    );

    const entityResults = await Promise.all(searchPromises);

    // Flatten and sort by relevance score
    for (let i = 0; i < entityResults.length; i++) {
      results.push(...entityResults[i]);
    }

    results.sort((a, b) => b.score - a.score);

    // Apply pagination
    const paginatedResults = results.slice(
      searchQuery.offset,
      searchQuery.offset + searchQuery.limit
    );

    return {
      results: paginatedResults,
      total: results.length,
      hasMore: searchQuery.offset + searchQuery.limit < results.length
    };
  }

  async getSuggestions(
    term: string,
    entityTypes: string[],
    limitCount: number
  ): Promise<SearchResponse> {
    const searchQuery = SearchQuery.create(term, entityTypes as SearchEntityType[], {
      limit: limitCount
    });

    return this.search(searchQuery);
  }

  private async searchByEntityType(
    entityType: SearchEntityType,
    searchQuery: SearchQuery
  ): Promise<SearchResult[]> {
    const collectionName = this.getCollectionName(entityType);
    const collectionRef = collection(this.firestore, collectionName);

    // Build query with term matching
    // Note: Firestore doesn't have full-text search, so we use prefix matching
    // For production, consider using Algolia or Elasticsearch
    const term = searchQuery.term.toLowerCase();
    const q = query(
      collectionRef,
      where('searchTerms', 'array-contains', term),
      firestoreLimit(searchQuery.limit)
    );

    const snapshot = await getDocs(q);
    const results: SearchResult[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      results.push({
        id: doc.id,
        type: entityType,
        name: data.name || data.displayName || '',
        description: data.description || data.bio || '',
        avatarUrl: data.avatarUrl || data.photoURL || '',
        metadata: {
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          memberCount: data.memberCount,
          projectCount: data.projectCount
        },
        score: this.calculateRelevanceScore(term, data)
      });
    });

    return results;
  }

  private getCollectionName(entityType: SearchEntityType): string {
    switch (entityType) {
      case 'user':
        return 'accounts';
      case 'organization':
        return 'organizations';
      case 'project':
        return 'projects';
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  private calculateRelevanceScore(term: string, data: any): number {
    let score = 0;

    // Exact name match scores highest
    if (data.name && data.name.toLowerCase() === term) {
      score += 100;
    }

    // Name starts with term
    if (data.name && data.name.toLowerCase().startsWith(term)) {
      score += 50;
    }

    // Name contains term
    if (data.name && data.name.toLowerCase().indexOf(term) !== -1) {
      score += 25;
    }

    // Description contains term
    if (data.description && data.description.toLowerCase().indexOf(term) !== -1) {
      score += 10;
    }

    // Boost for popular entities
    if (data.memberCount) {
      score += Math.min(data.memberCount, 20);
    }

    return score;
  }
}
