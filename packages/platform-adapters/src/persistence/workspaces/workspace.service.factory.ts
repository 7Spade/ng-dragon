import { WorkspaceApplicationService } from '@saas-domain';
import { FirestoreWorkspaceRepository } from './firestore-workspace.repository';

export const createWorkspaceApplicationService = (): WorkspaceApplicationService =>
  new WorkspaceApplicationService(new FirestoreWorkspaceRepository());
