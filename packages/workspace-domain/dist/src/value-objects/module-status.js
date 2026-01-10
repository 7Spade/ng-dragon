/**
 * Module status value object
 */
/**
 * Create a module status instance
 */
export function createModuleStatus(moduleKey, moduleType, enabled = false) {
    return { moduleKey, moduleType, enabled };
}
/**
 * Check if a module is enabled in a list of module statuses
 */
export function isModuleEnabled(modules, moduleKey) {
    const module = modules.find(m => m.moduleKey === moduleKey);
    return module?.enabled ?? false;
}
//# sourceMappingURL=module-status.js.map