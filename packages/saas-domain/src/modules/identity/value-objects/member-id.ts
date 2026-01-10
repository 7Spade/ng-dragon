export class MemberId {
  constructor(public readonly value: string) {}

  equals(other: MemberId): boolean {
    return this.value === other.value;
  }
}
