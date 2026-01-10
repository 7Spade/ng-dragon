import { ContainerScope } from '@account-domain';
import { AffectedEntity } from './affected-entity';
import { CausalityChain } from './causality-chain';

export class EventMetadata {
  constructor(
    public readonly eventId: string,
    public readonly traceId: string,
    public readonly actorAccountId: string,
    public readonly containerScope: ContainerScope,
    public readonly causality: CausalityChain,
    public readonly occurredAt: Date,
    public readonly affects: AffectedEntity[] = []
  ) {}

  withAdditionalCause(eventId: string): EventMetadata {
    const nextCausality = new CausalityChain();
    this.causality.getCauses().forEach(c => nextCausality.addCause(c));
    nextCausality.addCause(eventId);
    return new EventMetadata(
      this.eventId,
      this.traceId,
      this.actorAccountId,
      this.containerScope,
      nextCausality,
      this.occurredAt,
      this.affects
    );
  }

  withAdditionalAffect(entity: AffectedEntity): EventMetadata {
    return new EventMetadata(
      this.eventId,
      this.traceId,
      this.actorAccountId,
      this.containerScope,
      this.causality,
      this.occurredAt,
      [...this.affects, entity]
    );
  }
}
