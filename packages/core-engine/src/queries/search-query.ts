export type SearchOperator = '==' | 'array-contains' | 'array-contains-any' | 'in' | '>' | '>=' | '<' | '<=';

export interface SearchFilter {
  field: string;
  op: SearchOperator;
  value: unknown;
}

export interface SearchQuery {
  term: string;
  limit?: number;
  cursor?: string;
  filters?: SearchFilter[];
}

export interface NormalizedSearchQuery extends SearchQuery {
  term: string;
  limit: number;
  filters: SearchFilter[];
}

export const normalizeSearchQuery = (input: SearchQuery): NormalizedSearchQuery => {
  const trimmedTerm = (input.term ?? '').trim();
  const limit = input.limit && input.limit > 0 ? Math.min(input.limit, 50) : 20;
  return {
    term: trimmedTerm,
    limit,
    cursor: input.cursor,
    filters: input.filters ?? []
  };
};
