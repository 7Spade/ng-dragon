import { workspaceapplicationservice } from '@ng-events/saas-domain';

import { FirestoreWorkspaceRepository } from './firestore-workspace.repository';

export const createWorkspaceApplicationService = (): workspaceapplicationservice =>
  new workspaceapplicationservice(new FirestoreWorkspaceRepository());
