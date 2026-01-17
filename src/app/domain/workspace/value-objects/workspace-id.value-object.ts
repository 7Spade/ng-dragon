import { StringId } from '../../shared/value-objects';

/**
 * Workspace ID 值物件
 * 
 * 封裝 Workspace 的唯一識別ID
 * 基於 Firestore 文檔 ID 格式
 */
export class WorkspaceId extends StringId {
  /**
   * 從字串創建 WorkspaceId
   */
  static override create(value: string): WorkspaceId {
    const id = new WorkspaceId(value);
    return id;
  }

  /**
   * 類型保護
   */
  static isWorkspaceId(value: unknown): value is WorkspaceId {
    return value instanceof WorkspaceId;
  }
}
