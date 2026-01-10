export class CausalityChain {
  private readonly causes: string[] = [];

  addCause(eventId: string): CausalityChain {
    this.causes.push(eventId);
    return this;
  }

  getRootCause(): string | null {
    return this.causes.at(0) ?? null;
  }

  getImmediateCause(): string | null {
    return this.causes.at(-1) ?? null;
  }

  getDepth(): number {
    return this.causes.length;
  }

  getCauses(): readonly string[] {
    return this.causes;
  }
}
