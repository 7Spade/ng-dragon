export type ActivityCategory = 'member' | 'access' | 'settings' | 'workspace' | 'module' | 'security';

export class ActivityType {
  constructor(public readonly category: ActivityCategory, public readonly name: string) {}
}
