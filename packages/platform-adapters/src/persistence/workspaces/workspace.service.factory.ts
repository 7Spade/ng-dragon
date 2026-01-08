import { WorkspaceApplicationService } from '@saas-domain/src/application/WorkspaceApplicationService';

import { FirestoreWorkspaceRepository } from './firestore-workspace.repository';

export const createWorkspaceApplicationService = (): WorkspaceApplicationService =>
  new WorkspaceApplicationService(new FirestoreWorkspaceRepository());
