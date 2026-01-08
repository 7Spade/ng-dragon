import express from 'express';
import path from 'path';
import { WorkspaceRepositoryFirebase } from '../../platform-adapters/src/firebase-platform/workspace.repository.firebase';
import { WorkspaceApplicationService } from '../../saas-domain/src/application/WorkspaceApplicationService';
import { WorkspaceFactory } from '../../saas-domain/src/domain/WorkspaceFactory';
import { CreateOrganizationCommand } from '../../saas-domain/src/commands/CreateOrganizationCommand';

const app = express();
const PORT = process.env.PORT || 4200;

// Initialize workspace service with firebase-admin repository
const workspaceRepository = new WorkspaceRepositoryFirebase();
const workspaceFactory = new WorkspaceFactory();
const workspaceService = new WorkspaceApplicationService(workspaceRepository, workspaceFactory);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/ng-alain/browser')));

// API endpoint to create organization using firebase-admin via platform-adapters
app.post('/api/organizations', async (req, res) => {
  try {
    const { organizationName, accountId } = req.body;

    if (!organizationName || !accountId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const workspaceId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const command: CreateOrganizationCommand = {
      workspaceId,
      accountId,
      organizationName,
      actorId: accountId,
      traceId: workspaceId,
      createdAt: new Date().toISOString()
    };

    // Use WorkspaceApplicationService which uses WorkspaceRepositoryFirebase (firebase-admin)
    const event = await workspaceService.createOrganization(command);

    console.log(`Organization created via firebase-admin: ${organizationName} (ID: ${workspaceId})`);

    res.json({
      success: true,
      workspaceId: event.workspaceId,
      organizationName,
      message: `Organization "${organizationName}" created successfully`
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({
      error: 'Failed to create organization',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/ng-alain/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using firebase-admin via platform-adapters/WorkspaceRepositoryFirebase`);
});
