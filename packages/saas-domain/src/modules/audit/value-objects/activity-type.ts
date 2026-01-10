export type ActivityCategory =
  | 'member'
  | 'access'
  | 'settings'
  | 'workspace'
  | 'module'
  | 'security'
  | 'audit';

export class ActivityType {
  constructor(public readonly category: ActivityCategory, public readonly action: string) {}

  toString(): string {
    return `${this.category}:${this.action}`;
  }
}
