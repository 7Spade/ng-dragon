/**
 * Re-export Firebase workspace repository for persistence layer
 * This maintains backward compatibility while enforcing proper boundaries
 */
export { WorkspaceRepositoryFirebase as FirestoreWorkspaceRepository } from '../../firebase-platform/workspace.repository.firebase';
