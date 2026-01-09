/**
 * ActivityType Value Object
 * 
 * Classification of activities for audit purposes.
 */
export type ActivityCategory = 
  | 'member'      // Member operations
  | 'access'      // Permission/role changes
  | 'settings'    // Configuration updates
  | 'workspace'   // Workspace lifecycle
  | 'module'      // Module operations
  | 'security';   // Security events

export class ActivityType {
  constructor(
    public readonly category: ActivityCategory,
    public readonly action: string
  ) {}

  static MEMBER_ADDED = new ActivityType('member', 'added');
  static MEMBER_REMOVED = new ActivityType('member', 'removed');
  static ROLE_ASSIGNED = new ActivityType('access', 'role_assigned');
  static PERMISSION_GRANTED = new ActivityType('access', 'permission_granted');
  static SETTINGS_UPDATED = new ActivityType('settings', 'updated');
  static FEATURE_TOGGLED = new ActivityType('settings', 'feature_toggled');
  static WORKSPACE_CREATED = new ActivityType('workspace', 'created');
  static LOGIN_SUCCESS = new ActivityType('security', 'login');
  static LOGIN_FAILED = new ActivityType('security', 'login_failed');

  equals(other: ActivityType): boolean {
    return this.category === other.category && this.action === other.action;
  }

  toString(): string {
    return `${this.category}.${this.action}`;
  }
}
