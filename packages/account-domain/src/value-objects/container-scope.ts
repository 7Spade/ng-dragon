/**
 * ContainerScope - Logical Container Value Object
 * 
 * Represents a Workspace as a logical scope/boundary, NOT an actor.
 * Per Logical-Container-Role.md:
 * - Workspace is a Context/Scope/Boundary
 * - Answers "Where?" not "Who?"
 * - Never appears in Event.actorAccountId
 * 
 * Dependency: Account → Workspace → Module → Entity
 * 
 * Implements IContainerScope from core-engine for compatibility
 */
import type { IContainerScope } from '@core-engine';

export class ContainerScope implements IContainerScope {
  constructor(
    public readonly scopeId: string,
    public readonly scopeType: 'workspace' | 'organization' | 'team' | 'project'
  ) {
    if (!scopeId || scopeId.trim().length === 0) {
      throw new Error('Container scope ID cannot be empty');
    }
  }

  /**
   * Check if an entity is within this scope
   */
  isWithinScope(entityScopeId: string): boolean {
    return this.scopeId === entityScopeId;
  }

  /**
   * Check if this scope can contain another scope (hierarchy check)
   * workspace > organization > team/project
   */
  canContain(childScope: ContainerScope): boolean {
    const hierarchy: Record<string, number> = {
      workspace: 0,
      organization: 1,
      team: 2,
      project: 2
    };

    return hierarchy[this.scopeType] < hierarchy[childScope.scopeType];
  }

  /**
   * Check equality with another scope
   */
  equals(other: ContainerScope): boolean {
    return this.scopeId === other.scopeId && this.scopeType === other.scopeType;
  }

  /**
   * Get a string representation for debugging
   */
  toString(): string {
    return `${this.scopeType}:${this.scopeId}`;
  }
}
