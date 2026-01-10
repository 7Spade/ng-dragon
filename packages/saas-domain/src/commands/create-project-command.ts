/**
 * CreateProjectCommand
 * Creates a new project workspace (logical container) with 4 base modules activated
 * 
 * Architecture: Account → Workspace → Module → Entity
 * Project is a logical container, not an actor
 * All actions performed by Account (actorAccountId)
 */

export interface CreateProjectCommand {
  // Project identification
  workspaceId: string;          // Unique project identifier
  projectName: string;          // Project display name
  description?: string;         // Optional project description
  
  // Ownership
  accountId: string;            // Owner account (who creates the project)
  organizationId?: string;      // Optional parent organization
  
  // Actor context
  actorId: string;              // Who is performing this action
  
  // Event sourcing metadata
  traceId: string;              // Event tracing identifier
  causedBy: string[];           // Causality chain
  modules: string[];            // Modules to activate (4 base modules by default)
  
  // Timestamp
  createdAt: string;            // ISO 8601 timestamp
}
