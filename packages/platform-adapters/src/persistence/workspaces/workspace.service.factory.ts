import { WorkspaceApplicationService } from '@core-engine/src/use-cases/workspace.application-service';
import { FirestoreWorkspaceRepository } from './firestore-workspace.repository';

export const createWorkspaceApplicationService = (): WorkspaceApplicationService =>
  new WorkspaceApplicationService(new FirestoreWorkspaceRepository());
