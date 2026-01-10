/**
 * Usage Examples for Workspace Domain Modules
 * 
 * This file demonstrates how to use all seven modules in the workspace-domain package.
 * All imports are from the main package entry point following the package's export strategy.
 */

import {
  // Overview Module
  OverviewService,
  OverviewData,
  OverviewStats,
  
  // Documents Module
  DocumentsService,
  Document,
  DocumentInput,
  DocumentStatus,
  
  // Tasks Module
  TasksService,
  Task,
  TaskInput,
  TaskStatus,
  
  // Members Module
  MembersService,
  Member,
  MemberInput,
  MemberRole,
  
  // Permissions Module
  PermissionsService,
  PermissionType,
  Permission,
  
  // Audit Module
  AuditService,
  AuditLog,
  AuditAction,
  
  // Settings Module
  SettingsService,
  SettingsData,
  SettingValue,
  
  // Core types
  WorkspaceId,
  AccountId,
} from '@ng-events/workspace-domain';

/**
 * Example 1: Overview Module
 * Get workspace overview with statistics and recent activities
 */
function exampleOverview() {
  const overviewService = new OverviewService();
  const workspaceId: WorkspaceId = 'workspace_123';
  
  // Get complete overview data
  const overview: OverviewData = overviewService.getOverview(workspaceId);
  console.log('Workspace Overview:', overview);
  
  // Get just statistics
  const stats: OverviewStats = overviewService.getStats(workspaceId);
  console.log('Total Documents:', stats.totalDocuments);
  console.log('Total Tasks:', stats.totalTasks);
  console.log('Total Members:', stats.totalMembers);
  
  // Get recent activities
  const recentActivities = overviewService.getRecentActivities(workspaceId, 5);
  console.log('Recent Activities:', recentActivities);
}

/**
 * Example 2: Documents Module
 * Create and manage documents
 */
function exampleDocuments() {
  const documentsService = new DocumentsService();
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  
  // Create a new document
  const documentInput: DocumentInput = {
    title: 'Product Roadmap 2024',
    content: 'Initial draft of the product roadmap...',
    status: 'draft',
    visibility: 'workspace',
    tags: ['roadmap', 'planning', '2024'],
    metadata: {
      department: 'Product',
      priority: 'high',
    },
  };
  
  const newDocument: Document = documentsService.createDocument(
    workspaceId,
    actorId,
    documentInput
  );
  console.log('Created Document:', newDocument.documentId);
  
  // Get all documents
  const documents: Document[] = documentsService.getDocuments(workspaceId);
  console.log('Total Documents:', documents.length);
  
  // Get documents with filters
  const draftDocs = documentsService.getDocuments(workspaceId, {
    status: 'draft',
    limit: 10,
  });
  
  // Update document status
  documentsService.changeStatus(workspaceId, newDocument.documentId, 'published');
}

/**
 * Example 3: Tasks Module
 * Create and manage tasks
 */
function exampleTasks() {
  const tasksService = new TasksService();
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  
  // Create a new task
  const taskInput: TaskInput = {
    title: 'Implement user authentication',
    description: 'Add OAuth2 authentication flow',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user_789',
    dueDate: '2024-02-15T00:00:00Z',
    tags: ['authentication', 'security'],
  };
  
  const newTask: Task = tasksService.createTask(workspaceId, actorId, taskInput);
  console.log('Created Task:', newTask.taskId);
  
  // Get all tasks
  const tasks: Task[] = tasksService.getTasks(workspaceId);
  console.log('Total Tasks:', tasks.length);
  
  // Get filtered tasks
  const highPriorityTasks = tasksService.getTasks(workspaceId, {
    priority: 'high',
    status: 'in-progress',
  });
  
  // Assign task to someone
  tasksService.assignTask(workspaceId, newTask.taskId, 'user_999');
  
  // Change task status
  tasksService.changeStatus(workspaceId, newTask.taskId, 'in-progress');
}

/**
 * Example 4: Members Module
 * Manage workspace members
 */
function exampleMembers() {
  const membersService = new MembersService();
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  
  // Add a new member
  const memberInput: MemberInput = {
    accountId: 'user_789',
    role: 'member',
    accountType: 'user',
    metadata: {
      department: 'Engineering',
      joinedVia: 'invitation',
    },
  };
  
  const newMember: Member = membersService.addMember(workspaceId, actorId, memberInput);
  console.log('Added Member:', newMember.memberId);
  
  // List all members
  const members: Member[] = membersService.listMembers(workspaceId);
  console.log('Total Members:', members.length);
  
  // Get members by role
  const admins = membersService.getMembersByRole(workspaceId, 'admin');
  console.log('Admin Members:', admins.length);
  
  // Update member role
  membersService.updateMemberRole(workspaceId, newMember.memberId, 'manager');
  
  // Remove member
  // membersService.removeMember(workspaceId, newMember.memberId);
}

/**
 * Example 5: Permissions Module
 * Manage workspace permissions
 */
function examplePermissions() {
  const permissionsService = new PermissionsService();
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  const userId: AccountId = 'user_789';
  
  // Set a simple permission
  permissionsService.setPermission(workspaceId, actorId, userId, 'documents.write');
  
  // Grant permission with full options
  const permission: Permission = permissionsService.grantPermission(
    workspaceId,
    actorId,
    {
      userId,
      permission: 'tasks.write',
      scope: 'workspace',
      expiresAt: '2024-12-31T23:59:59Z',
    }
  );
  
  // Get user's permissions
  const userPermissions: PermissionType[] = permissionsService.getPermissions(
    workspaceId,
    userId
  );
  console.log('User Permissions:', userPermissions);
  
  // Check if user has specific permission
  const canWrite = permissionsService.hasPermission(
    workspaceId,
    userId,
    'documents.write'
  );
  console.log('Can Write Documents:', canWrite.hasPermission);
  
  // List all permissions
  const allPermissions = permissionsService.listAllPermissions(workspaceId);
  console.log('Total Permissions:', allPermissions.length);
}

/**
 * Example 6: Audit Module
 * Log and query audit events
 */
function exampleAudit() {
  const auditService = new AuditService();
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  
  // Log an action
  const action: AuditAction = {
    actionType: 'document.created',
    actorId,
    resourceType: 'document',
    resourceId: 'doc_123',
    details: {
      title: 'Product Roadmap',
      status: 'draft',
    },
    severity: 'info',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
  };
  
  auditService.logAction(workspaceId, action);
  
  // Get all audit logs
  const logs: AuditLog[] = auditService.getLogs(workspaceId);
  console.log('Total Audit Logs:', logs.length);
  
  // Get filtered logs
  const documentLogs = auditService.getLogs(workspaceId, {
    resourceType: 'document',
    severity: 'info',
    limit: 50,
  });
  
  // Get logs for a specific resource
  const resourceLogs = auditService.getResourceLogs(
    workspaceId,
    'document',
    'doc_123'
  );
  
  // Get recent logs
  const recentLogs = auditService.getRecentLogs(workspaceId, 10);
  console.log('Recent Audit Logs:', recentLogs);
}

/**
 * Example 7: Settings Module
 * Manage workspace settings
 */
function exampleSettings() {
  const settingsService = new SettingsService();
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  
  // Update a single setting
  settingsService.updateSetting(workspaceId, actorId, 'theme', 'dark');
  
  // Update multiple settings
  settingsService.updateSettings(workspaceId, actorId, [
    { key: 'notifications.email', value: true, category: 'notifications' },
    { key: 'notifications.slack', value: false, category: 'notifications' },
    { key: 'security.2fa', value: true, category: 'security' },
  ]);
  
  // Get all settings
  const settings: SettingsData = settingsService.getSettings(workspaceId);
  console.log('General Settings:', settings.general);
  console.log('Security Settings:', settings.security);
  console.log('Notification Settings:', settings.notifications);
  
  // Get a specific setting
  const theme: SettingValue | undefined = settingsService.getSetting(
    workspaceId,
    'theme'
  );
  console.log('Theme:', theme);
  
  // Get settings by category
  const notificationSettings = settingsService.getSettingsByCategory(
    workspaceId,
    'notifications'
  );
  
  // Validate settings
  const validationResult = settingsService.validateSettings(workspaceId, [
    { key: 'theme', value: 'dark' },
    { key: 'language', value: 'en' },
  ]);
  
  if (validationResult.valid) {
    console.log('Settings are valid');
  } else {
    console.error('Validation errors:', validationResult.errors);
  }
  
  // Reset settings to defaults
  // settingsService.resetSettings(workspaceId, 'appearance');
}

/**
 * Example 8: Complete Workflow
 * Demonstrates using multiple modules together
 */
function exampleCompleteWorkflow() {
  const workspaceId: WorkspaceId = 'workspace_123';
  const actorId: AccountId = 'user_456';
  
  // Initialize services
  const membersService = new MembersService();
  const permissionsService = new PermissionsService();
  const documentsService = new DocumentsService();
  const tasksService = new TasksService();
  const auditService = new AuditService();
  
  // 1. Add a new member
  const newMember = membersService.addMember(workspaceId, actorId, {
    accountId: 'user_789',
    role: 'member',
  });
  
  // 2. Grant permissions to the new member
  permissionsService.setPermission(
    workspaceId,
    actorId,
    newMember.accountId,
    'documents.read'
  );
  
  // 3. Create a document
  const document = documentsService.createDocument(workspaceId, actorId, {
    title: 'Team Guidelines',
    content: 'Our team collaboration guidelines...',
  });
  
  // 4. Create a task to review the document
  const task = tasksService.createTask(workspaceId, actorId, {
    title: 'Review team guidelines document',
    assigneeId: newMember.accountId,
    priority: 'medium',
  });
  
  // 5. Log all these actions for audit
  auditService.logAction(workspaceId, {
    actionType: 'member.added',
    actorId,
    resourceType: 'member',
    resourceId: newMember.memberId,
    severity: 'info',
  });
  
  auditService.logAction(workspaceId, {
    actionType: 'document.created',
    actorId,
    resourceType: 'document',
    resourceId: document.documentId,
    severity: 'info',
  });
  
  auditService.logAction(workspaceId, {
    actionType: 'task.created',
    actorId,
    resourceType: 'task',
    resourceId: task.taskId,
    severity: 'info',
  });
  
  console.log('Workflow completed successfully!');
}

// Run examples (commented out for import-only usage)
// exampleOverview();
// exampleDocuments();
// exampleTasks();
// exampleMembers();
// examplePermissions();
// exampleAudit();
// exampleSettings();
// exampleCompleteWorkflow();
