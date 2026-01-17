import { StringId } from '../../shared/value-objects';

/**
 * Membership ID 值物件
 * 
 * 封裝 WorkspaceMembership 的唯一識別ID
 * 基於 Firestore 文檔 ID 格式
 */
export class MembershipId extends StringId {
  /**
   * 從字串創建 MembershipId
   */
  static override create(value: string): MembershipId {
    const id = new MembershipId(value);
    return id;
  }

  /**
   * 類型保護
   */
  static isMembershipId(value: unknown): value is MembershipId {
    return value instanceof MembershipId;
  }

  /**
   * 從組合鍵創建 MembershipId
   * 格式: {workspaceId}_{accountId}
   */
  static fromComposite(workspaceId: string, accountId: string): MembershipId {
    return MembershipId.create(`${workspaceId}_${accountId}`);
  }

  /**
   * 解析組合鍵
   * @returns { workspaceId, accountId }
   */
  parseComposite(): { workspaceId: string; accountId: string } | null {
    const parts = this.value.split('_');
    if (parts.length !== 2) {
      return null;
    }
    return {
      workspaceId: parts[0],
      accountId: parts[1],
    };
  }
}
