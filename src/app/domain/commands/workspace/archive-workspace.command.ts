import { WorkspaceScopedCommand } from '../base/command.base';

/**
 * Archive Workspace Command 負載
 */
export interface ArchiveWorkspacePayload {
  readonly reason?: string;
}

/**
 * Archive Workspace Command
 * 
 * 歸檔工作區的命令
 */
export class ArchiveWorkspaceCommand extends WorkspaceScopedCommand<ArchiveWorkspacePayload> {
  readonly commandType = 'workspace.archive' as const;

  /**
   * 創建命令
   */
  static create(props: {
    commandId: string;
    actorId: string;
    workspaceId: string;
    payload?: ArchiveWorkspacePayload;
    correlationId?: string;
  }): ArchiveWorkspaceCommand {
    return new ArchiveWorkspaceCommand({
      commandId: props.commandId,
      actorId: props.actorId,
      workspaceId: props.workspaceId,
      payload: props.payload || {},
      correlationId: props.correlationId,
    });
  }
}
