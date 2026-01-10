/**
 * ActorIdentity - The Sole Actor Value Object
 *
 * Represents an Account as the ONLY entity that can trigger events.
 * Per Logical-Container-Role.md:
 * - Only Account is an Actor
 * - Only Account appears in Event.actorAccountId
 * - Logical Container (Workspace) is NOT an actor
 *
 * Actor Types:
 * - user: Human user account
 * - organization: Organization account (legal entity)
 * - bot: Automated bot account
 * - system: System-level account
 */
export class ActorIdentity {
    constructor(accountId, actorType) {
        this.accountId = accountId;
        this.actorType = actorType;
        if (!accountId || accountId.trim().length === 0) {
            throw new Error('Actor account ID cannot be empty');
        }
    }
    /**
     * Check if this actor can perform a specific action
     * (Placeholder for future permission logic)
     */
    canPerformAction(actionType) {
        // System actors can perform any action
        if (this.actorType === 'system') {
            return true;
        }
        // TODO: Implement actual permission checks via ACL
        return true;
    }
    /**
     * Check if this actor is a human user
     */
    isHumanUser() {
        return this.actorType === 'user';
    }
    /**
     * Check if this actor is an organization
     */
    isOrganization() {
        return this.actorType === 'organization';
    }
    /**
     * Check equality with another actor
     */
    equals(other) {
        return this.accountId === other.accountId && this.actorType === other.actorType;
    }
    /**
     * Get a string representation for debugging
     */
    toString() {
        return `${this.actorType}:${this.accountId}`;
    }
}
//# sourceMappingURL=actor-identity.js.map