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
 */
export declare class ContainerScope {
    readonly scopeId: string;
    readonly scopeType: 'workspace' | 'organization' | 'team' | 'project';
    constructor(scopeId: string, scopeType: 'workspace' | 'organization' | 'team' | 'project');
    /**
     * Check if an entity is within this scope
     */
    isWithinScope(entityScopeId: string): boolean;
    /**
     * Check if this scope can contain another scope (hierarchy check)
     * workspace > organization > team/project
     */
    canContain(childScope: ContainerScope): boolean;
    /**
     * Check equality with another scope
     */
    equals(other: ContainerScope): boolean;
    /**
     * Get a string representation for debugging
     */
    toString(): string;
}
//# sourceMappingURL=container-scope.d.ts.map