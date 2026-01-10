/**
 * Settings Module Types
 * Provides types for workspace settings management
 */

import { WorkspaceId, AccountId } from '../../types/identifiers';

/**
 * Settings category
 */
export type SettingsCategory = 'general' | 'security' | 'notifications' | 'integrations' | 'appearance';

/**
 * Setting value type
 */
export type SettingValue = string | number | boolean | Record<string, any> | any[];

/**
 * Setting entry
 */
export interface SettingEntry {
  key: string;
  value: SettingValue;
  category: SettingsCategory;
  description?: string;
  updatedBy?: AccountId;
  updatedAt?: string;
}

/**
 * Complete settings data for a workspace
 */
export interface SettingsData {
  workspaceId: WorkspaceId;
  general: Record<string, SettingValue>;
  security: Record<string, SettingValue>;
  notifications: Record<string, SettingValue>;
  integrations: Record<string, SettingValue>;
  appearance: Record<string, SettingValue>;
  lastUpdated: string;
}

/**
 * Setting update input
 */
export interface SettingUpdateInput {
  key: string;
  value: SettingValue;
  category?: SettingsCategory;
}

/**
 * Settings validation result
 */
export interface SettingsValidationResult {
  valid: boolean;
  errors?: string[];
}
