import { CommandBase } from '../base/command.base';

/**
 * Create Workspace Command 負載
 */
export interface CreateWorkspacePayload {
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly type: string;
  readonly avatar?: string;
  readonly color?: string;
  readonly icon?: string;
  readonly accountId?: string;
  readonly contextId?: string;
}

/**
 * Create Workspace Command
 * 
 * 創建新工作區的命令
 */
export class CreateWorkspaceCommand extends CommandBase<CreateWorkspacePayload> {
  readonly commandType = 'workspace.create' as const;

  /**
   * 創建命令
   */
  static create(props: {
    commandId: string;
    actorId: string;
    payload: CreateWorkspacePayload;
    correlationId?: string;
  }): CreateWorkspaceCommand {
    return new CreateWorkspaceCommand({
      commandId: props.commandId,
      actorId: props.actorId,
      payload: props.payload,
      correlationId: props.correlationId,
    });
  }
}
