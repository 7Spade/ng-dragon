export interface WorkspaceSettingsProps {
  timezone?: string;
  locale?: string;
  planTier?: string;
}

export class WorkspaceSettings {
  constructor(public readonly props: WorkspaceSettingsProps = {}) {}
}
