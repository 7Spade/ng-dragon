/**
 * Workspace type value object
 * Defines the different types of workspaces in the system
 */
export type WorkspaceType = 'personal' | 'organization' | 'team' | 'partner' | 'project';
/**
 * Check if a given string is a valid workspace type
 */
export declare function isValidWorkspaceType(value: string): value is WorkspaceType;
/**
 * Get display label for workspace type
 */
export declare function getWorkspaceTypeLabel(type: WorkspaceType): string;
/**
 * Get icon name for workspace type
 */
export declare function getWorkspaceTypeIcon(type: WorkspaceType): string;
//# sourceMappingURL=workspace-type.d.ts.map