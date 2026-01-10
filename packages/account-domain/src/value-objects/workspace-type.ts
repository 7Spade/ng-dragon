// WorkspaceType distinguishes workspace containers for modules and entities.
// organization aligns to company-level, project for single product, personal for individual scope.
// team / partner capture collaborative scopes without owning identity.
export type WorkspaceType = 'organization' | 'project' | 'personal' | 'team' | 'partner';
