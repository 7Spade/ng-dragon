import { SearchQuery } from '../queries';

export interface SearchRepository<TResult> {
  search(query: SearchQuery): Promise<TResult[]>;
}
