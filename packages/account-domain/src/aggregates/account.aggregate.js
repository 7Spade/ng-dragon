import { toEventMetadata } from '../events/domain-event';
export class AccountAggregate {
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    static create(input, context) {
        const createdAt = input.createdAt ?? new Date().toISOString();
        const snapshot = {
            accountId: input.accountId,
            accountType: input.accountType,
            displayName: input.displayName,
            createdAt,
            workspaceIds: input.workspaceIds ?? [],
        };
        const event = {
            eventType: 'AccountCreated',
            aggregateId: snapshot.accountId,
            accountId: snapshot.accountId,
            payload: {
                accountId: snapshot.accountId,
                accountType: snapshot.accountType,
                displayName: snapshot.displayName,
                createdAt: snapshot.createdAt,
            },
            metadata: toEventMetadata({ ...context, occurredAt: context.occurredAt ?? snapshot.createdAt }),
        };
        return { aggregate: new AccountAggregate(snapshot), event };
    }
    createWorkspace(workspaceId, workspaceType, context) {
        const nextSnapshot = {
            ...this.snapshot,
            workspaceIds: [...this.snapshot.workspaceIds, workspaceId],
        };
        const event = {
            eventType: 'WorkspaceCreated',
            aggregateId: this.snapshot.accountId,
            accountId: this.snapshot.accountId,
            workspaceId,
            payload: {
                workspaceId,
                workspaceType,
                accountId: this.snapshot.accountId,
            },
            metadata: toEventMetadata(context),
        };
        return { aggregate: new AccountAggregate(nextSnapshot), event };
    }
    get state() {
        return this.snapshot;
    }
}
//# sourceMappingURL=account.aggregate.js.map