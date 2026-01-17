import { Timestamp } from '../../shared/value-objects';

/**
 * 命令基類
 * 
 * 所有命令都應繼承此基類
 * 
 * 設計原則:
 * - 意圖明確: 命令名稱清楚表達意圖 (CreateWorkspace, UpdateWorkspace 等)
 * - 不可變性: 命令一旦創建就不可變
 * - 完整資訊: 包含執行命令所需的所有資訊
 * - 追蹤性: 包含追蹤資訊用於審計
 * 
 * @template TPayload - 命令負載的類型
 */
export abstract class CommandBase<TPayload = unknown> {
  /**
   * 命令類型 (唯一識別命令種類)
   */
  abstract readonly commandType: string;
  
  /**
   * 命令 ID (唯一識別)
   */
  readonly commandId: string;
  
  /**
   * 命令創建時間
   */
  readonly createdAt: Timestamp;
  
  /**
   * 執行命令的帳戶 ID
   */
  readonly actorId: string;
  
  /**
   * 工作區 ID (WorkspaceScoped 命令必填)
   */
  readonly workspaceId?: string;
  
  /**
   * 關聯 ID (用於追蹤相關命令)
   */
  readonly correlationId?: string;
  
  /**
   * 命令負載 (業務數據)
   */
  readonly payload: TPayload;

  constructor(props: {
    commandId: string;
    actorId: string;
    workspaceId?: string;
    correlationId?: string;
    payload: TPayload;
  }) {
    this.commandId = props.commandId;
    this.createdAt = Timestamp.now();
    this.actorId = props.actorId;
    this.workspaceId = props.workspaceId;
    this.correlationId = props.correlationId;
    this.payload = props.payload;
    
    // 確保命令不可變
    Object.freeze(this.payload);
    Object.freeze(this);
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): {
    commandType: string;
    commandId: string;
    createdAt: Date;
    actorId: string;
    workspaceId?: string;
    correlationId?: string;
    payload: TPayload;
  } {
    return {
      commandType: this.commandType,
      commandId: this.commandId,
      createdAt: this.createdAt.toDate(),
      actorId: this.actorId,
      workspaceId: this.workspaceId,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }

  /**
   * 轉換為字串
   */
  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

/**
 * WorkspaceScoped 命令基類
 * 
 * 所有與工作區相關的命令都應繼承此基類
 * 確保命令包含 workspaceId
 */
export abstract class WorkspaceScopedCommand<
  TPayload = unknown
> extends CommandBase<TPayload> {
  constructor(props: {
    commandId: string;
    actorId: string;
    workspaceId: string;
    correlationId?: string;
    payload: TPayload;
  }) {
    if (!props.workspaceId) {
      throw new Error(
        'WorkspaceScoped command must have workspaceId'
      );
    }
    
    super(props);
  }

  /**
   * 獲取工作區 ID (覆寫父類,確保非 undefined)
   */
  override get workspaceId(): string {
    return super.workspaceId!;
  }
}
