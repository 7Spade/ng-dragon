/**
 * MemberId Value Object
 * 
 * Unique identifier for a workspace member.
 * Immutable value object following DDD principles.
 */
export class MemberId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('MemberId cannot be empty');
    }
  }

  static create(value: string): MemberId {
    return new MemberId(value);
  }

  static generate(): MemberId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return new MemberId(`mem-${timestamp}-${random}`);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MemberId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
