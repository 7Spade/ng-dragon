/**
 * Tasks Module Types
 * Provides types for task management
 */

import { WorkspaceId, AccountId } from '../../types/identifiers';

/**
 * Task status
 */
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';

/**
 * Task priority
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task input for creation
 */
export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: AccountId;
  dueDate?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Task entity
 */
export interface Task {
  taskId: string;
  workspaceId: WorkspaceId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: AccountId;
  dueDate?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdBy: AccountId;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * Task query options
 */
export interface TaskQueryOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: AccountId;
  tags?: string[];
  limit?: number;
  offset?: number;
}
