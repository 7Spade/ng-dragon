import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreSearchRepository } from '../../../../../platform-adapters/src/search/firestore-search.repository';
import { SearchResponse, SearchEntityType } from '../../../../../core-engine/src/queries/search-query';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private firestore = inject(Firestore);
  private searchRepository: FirestoreSearchRepository;

  constructor() {
    this.searchRepository = new FirestoreSearchRepository(this.firestore);
  }

  async search(
    term: string,
    entityTypes: SearchEntityType[],
    limit: number = 20
  ): Promise<SearchResponse> {
    return this.searchRepository.getSuggestions(term, entityTypes, limit);
  }
}
