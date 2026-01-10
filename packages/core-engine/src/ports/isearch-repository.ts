/**
 * Search Repository Port
 * Defines the contract for search implementations
 */

import { SearchQuery, SearchResponse } from '../queries/search-query';

export interface ISearchRepository {
  /**
   * Execute a search query across multiple entity types
   * @param query The search query with term, filters, and pagination
   * @returns Search results with relevance scores
   */
  search(query: SearchQuery): Promise<SearchResponse>;

  /**
   * Get suggestions for autocomplete (optimized for speed)
   * @param term Partial search term
   * @param entityTypes Entity types to search
   * @param limit Maximum number of suggestions
   * @returns Quick suggestions for autocomplete
   */
  getSuggestions(
    term: string,
    entityTypes: string[],
    limit: number
  ): Promise<SearchResponse>;
}
