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
export declare function createModuleStatus(moduleKey: ModuleKey, moduleType: ModuleType, enabled?: boolean): ModuleStatus;
/**
 * Check if a module is enabled in a list of module statuses
 */
export declare function isModuleEnabled(modules: ModuleStatus[], moduleKey: ModuleKey): boolean;
//# sourceMappingURL=module-status.d.ts.map