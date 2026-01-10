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
export class ContainerScope {
    constructor(scopeId, scopeType) {
        this.scopeId = scopeId;
        this.scopeType = scopeType;
        if (!scopeId || scopeId.trim().length === 0) {
            throw new Error('Container scope ID cannot be empty');
        }
    }
    /**
     * Check if an entity is within this scope
     */
    isWithinScope(entityScopeId) {
        return this.scopeId === entityScopeId;
    }
    /**
     * Check if this scope can contain another scope (hierarchy check)
     * workspace > organization > team/project
     */
    canContain(childScope) {
        const hierarchy = {
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
    equals(other) {
        return this.scopeId === other.scopeId && this.scopeType === other.scopeType;
    }
    /**
     * Get a string representation for debugging
     */
    toString() {
        return `${this.scopeType}:${this.scopeId}`;
    }
}
//# sourceMappingURL=container-scope.js.map