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
export declare class ActorIdentity {
    readonly accountId: string;
    readonly actorType: 'user' | 'organization' | 'bot' | 'system';
    constructor(accountId: string, actorType: 'user' | 'organization' | 'bot' | 'system');
    /**
     * Check if this actor can perform a specific action
     * (Placeholder for future permission logic)
     */
    canPerformAction(actionType: string): boolean;
    /**
     * Check if this actor is a human user
     */
    isHumanUser(): boolean;
    /**
     * Check if this actor is an organization
     */
    isOrganization(): boolean;
    /**
     * Check equality with another actor
     */
    equals(other: ActorIdentity): boolean;
    /**
     * Get a string representation for debugging
     */
    toString(): string;
}
//# sourceMappingURL=actor-identity.d.ts.map