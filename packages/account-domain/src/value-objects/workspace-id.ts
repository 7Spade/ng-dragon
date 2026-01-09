// WorkspaceId value object to enforce non-empty IDs and centralized generation.
export class WorkspaceId {
  private constructor(private readonly _value: string) {}

  static generate(): WorkspaceId {
    const random = Math.random().toString(36).slice(2, 10);
    const value = `ws-${Date.now()}-${random}`;
    return new WorkspaceId(value);
  }

  static from(value: string): WorkspaceId {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkspaceId cannot be empty');
    }
    return new WorkspaceId(value.trim());
  }

  get value(): string {
    return this._value;
  }
}
