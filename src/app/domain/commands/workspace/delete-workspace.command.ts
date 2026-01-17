import { WorkspaceScopedCommand } from '../base/command.base';

/**
 * Delete Workspace Command 負載
 */
export interface DeleteWorkspacePayload {
  readonly reason?: string;
}

/**
 * Delete Workspace Command
 * 
 * 刪除工作區的命令
 */
export class DeleteWorkspaceCommand extends WorkspaceScopedCommand<DeleteWorkspacePayload> {
  readonly commandType = 'workspace.delete' as const;

  /**
   * 創建命令
   */
  static create(props: {
    commandId: string;
    actorId: string;
    workspaceId: string;
    payload?: DeleteWorkspacePayload;
    correlationId?: string;
  }): DeleteWorkspaceCommand {
    return new DeleteWorkspaceCommand({
      commandId: props.commandId,
      actorId: props.actorId,
      workspaceId: props.workspaceId,
      payload: props.payload || {},
      correlationId: props.correlationId,
    });
  }
}
