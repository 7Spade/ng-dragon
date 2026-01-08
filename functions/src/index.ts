import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

interface CreateOrganizationRequest {
  organizationName: string;
}

interface WorkspaceSnapshot {
  workspaceId: string;
  accountId: string;
  workspaceType: 'Organization';
  modules: any[];
  createdAt: string;
  name: string;
}

interface WorkspaceCreatedEvent {
  eventType: 'WorkspaceCreated';
  aggregateId: string;
  accountId: string;
  workspaceId: string;
  payload: WorkspaceSnapshot;
  metadata: {
    actorId: string;
    traceId: string;
    occurredAt: string;
  };
}

/**
 * Cloud Function to create an organization
 * Uses firebase-admin to write to Firestore
 */
export const createOrganization = functions.https.onCall(
  async (data: CreateOrganizationRequest, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    const { organizationName } = data;

    if (!organizationName || typeof organizationName !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a valid organization name.'
      );
    }

    const accountId = context.auth.uid;
    const workspaceId = generateWorkspaceId();
    const timestamp = new Date().toISOString();

    // Create workspace snapshot
    const snapshot: WorkspaceSnapshot = {
      workspaceId,
      accountId,
      workspaceType: 'Organization',
      modules: [],
      createdAt: timestamp,
      name: organizationName
    };

    // Create workspace event
    const event: WorkspaceCreatedEvent = {
      eventType: 'WorkspaceCreated',
      aggregateId: workspaceId,
      accountId,
      workspaceId,
      payload: snapshot,
      metadata: {
        actorId: accountId,
        traceId: workspaceId,
        occurredAt: timestamp
      }
    };

    try {
      // Write to Firestore using firebase-admin
      const batch = db.batch();

      // Write event to workspace-events collection
      const eventRef = db.collection('workspace-events').doc();
      batch.set(eventRef, event);

      // Write snapshot to workspaces collection
      const snapshotRef = db.collection('workspaces').doc(workspaceId);
      batch.set(snapshotRef, snapshot, { merge: true });

      // Commit the batch
      await batch.commit();

      console.log(`Organization created: ${organizationName} (ID: ${workspaceId})`);

      return {
        success: true,
        workspaceId,
        organizationName,
        message: `Organization "${organizationName}" created successfully`
      };
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to create organization',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

function generateWorkspaceId(): string {
  // Generate a UUID-like ID
  return `ws-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
