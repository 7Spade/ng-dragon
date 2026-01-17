import { WorkspaceScopedCommand } from '../base/command.base';

/**
 * Update Workspace Command 負載
 */
export interface UpdateWorkspacePayload {
  readonly name?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly type?: string;
  readonly avatar?: string;
  readonly color?: string;
  readonly icon?: string;
}

/**
 * Update Workspace Command
 * 
 * 更新工作區資訊的命令
 */
export class UpdateWorkspaceCommand extends WorkspaceScopedCommand<UpdateWorkspacePayload> {
  readonly commandType = 'workspace.update' as const;

  /**
   * 創建命令
   */
  static create(props: {
    commandId: string;
    actorId: string;
    workspaceId: string;
    payload: UpdateWorkspacePayload;
    correlationId?: string;
  }): UpdateWorkspaceCommand {
    return new UpdateWorkspaceCommand({
      commandId: props.commandId,
      actorId: props.actorId,
      workspaceId: props.workspaceId,
      payload: props.payload,
      correlationId: props.correlationId,
    });
  }
}
