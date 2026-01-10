/**
 * Module status value object
 */

import { ModuleKey } from '../types/identifiers';

export type ModuleType = string;

export interface ModuleStatus {
  moduleKey: ModuleKey;
  moduleType: ModuleType;
  enabled: boolean;
}

/**
 * Create a module status instance
 */
export function createModuleStatus(
  moduleKey: ModuleKey,
  moduleType: ModuleType,
  enabled: boolean = false
): ModuleStatus {
  return { moduleKey, moduleType, enabled };
}

/**
 * Check if a module is enabled in a list of module statuses
 */
export function isModuleEnabled(modules: ModuleStatus[], moduleKey: ModuleKey): boolean {
  const module = modules.find(m => m.moduleKey === moduleKey);
  return module?.enabled ?? false;
}
