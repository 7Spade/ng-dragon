/**
 * TeamId value object to ensure non-empty identifiers and centralize generation.
 * Pure domain construct: no platform dependencies.
 */
export class TeamId {
  private constructor(private readonly _value: string) {}

  static generate(): TeamId {
    const random = Math.random().toString(36).slice(2, 10);
    const value = `team-${Date.now()}-${random}`;
    return new TeamId(value);
  }

  static from(value: string): TeamId {
    if (!value || value.trim().length === 0) {
      throw new Error('TeamId cannot be empty');
    }
    return new TeamId(value.trim());
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
