/**
 * Workspace Type 列舉
 * 
 * 定義 Workspace 的類型
 */
export enum WorkspaceType {
  /**
   * 個人工作區
   */
  Personal = 'personal',

  /**
   * 團隊工作區
   */
  Team = 'team',

  /**
   * 企業工作區
   */
  Enterprise = 'enterprise',
}

/**
 * 檢查是否為個人工作區
 */
export function isPersonalWorkspace(type: WorkspaceType): boolean {
  return type === WorkspaceType.Personal;
}

/**
 * 檢查是否為團隊或企業工作區
 */
export function isCollaborativeWorkspace(type: WorkspaceType): boolean {
  return type === WorkspaceType.Team || type === WorkspaceType.Enterprise;
}

/**
 * 獲取工作區類型的顯示名稱
 */
export function getWorkspaceTypeDisplayName(type: WorkspaceType): string {
  const displayNames: Record<WorkspaceType, string> = {
    [WorkspaceType.Personal]: '個人工作區',
    [WorkspaceType.Team]: '團隊工作區',
    [WorkspaceType.Enterprise]: '企業工作區',
  };
  return displayNames[type];
}

/**
 * 獲取工作區類型的描述
 */
export function getWorkspaceTypeDescription(type: WorkspaceType): string {
  const descriptions: Record<WorkspaceType, string> = {
    [WorkspaceType.Personal]: '適合個人使用的工作區,管理個人專案和任務',
    [WorkspaceType.Team]: '適合小型團隊協作,支援多人共同工作',
    [WorkspaceType.Enterprise]: '適合大型組織,提供進階功能和無限配額',
  };
  return descriptions[type];
}
