// WorkspaceType distinguishes workspace containers for modules and entities.
// organization: company-level workspace
// team: sub-workspace within an organization
// partner: external collaborator workspace
// project: single product workspace
// personal: individual user workspace
export type WorkspaceType = 'organization' | 'team' | 'partner' | 'project' | 'personal';
