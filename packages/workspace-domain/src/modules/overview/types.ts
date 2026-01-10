/**
 * Overview Module Types
 * Provides types for workspace overview data
 */

import { WorkspaceId } from '../../types/identifiers';

/**
 * Overview statistics data
 */
export interface OverviewStats {
  totalDocuments: number;
  totalTasks: number;
  totalMembers: number;
  activeTasksCount: number;
  completedTasksCount: number;
  recentActivityCount: number;
}

/**
 * Recent activity item
 */
export interface RecentActivity {
  activityId: string;
  type: 'document' | 'task' | 'member' | 'permission' | 'setting';
  title: string;
  description?: string;
  timestamp: string;
  actorId: string;
}

/**
 * Complete overview data for a workspace
 */
export interface OverviewData {
  workspaceId: WorkspaceId;
  stats: OverviewStats;
  recentActivities: RecentActivity[];
  lastUpdated: string;
}
