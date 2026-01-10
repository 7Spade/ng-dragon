/**
 * Global Search Query Value Object
 * Used for searching across User, Organization, and Project entities
 */

export type SearchEntityType = 'user' | 'organization' | 'project';

export interface SearchFilters {
  tags?: string[];
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
}

export class SearchQuery {
  constructor(
    public readonly term: string,
    public readonly entityTypes: SearchEntityType[],
    public readonly limit: number = 20,
    public readonly offset: number = 0,
    public readonly filters?: SearchFilters
  ) {
    if (!term || term.trim().length === 0) {
      throw new Error('Search term cannot be empty');
    }
    
    if (entityTypes.length === 0) {
      throw new Error('At least one entity type must be specified');
    }
    
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
  }

  static create(
    term: string,
    entityTypes: SearchEntityType[],
    options?: { limit?: number; offset?: number; filters?: SearchFilters }
  ): SearchQuery {
    return new SearchQuery(
      term,
      entityTypes,
      options?.limit,
      options?.offset,
      options?.filters
    );
  }
}

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  name: string;
  description?: string;
  avatarUrl?: string;
  metadata?: Record<string, any>;
  score: number; // Relevance score
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}
