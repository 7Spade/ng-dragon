export function toEventMetadata(context) {
    return {
        actorId: context.actorId,
        traceId: context.traceId,
        causedBy: context.causedBy,
        occurredAt: context.occurredAt ?? new Date().toISOString(),
    };
}
//# sourceMappingURL=domain-event.js.map