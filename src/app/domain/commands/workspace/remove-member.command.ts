import { WorkspaceScopedCommand } from '../base/command.base';

/**
 * Remove Member Command 負載
 */
export interface RemoveMemberPayload {
  readonly membershipId: string;
  readonly reason?: string;
}

/**
 * Remove Member Command
 * 
 * 移除工作區成員的命令
 */
export class RemoveMemberCommand extends WorkspaceScopedCommand<RemoveMemberPayload> {
  readonly commandType = 'workspace.member.remove' as const;

  /**
   * 創建命令
   */
  static create(props: {
    commandId: string;
    actorId: string;
    workspaceId: string;
    payload: RemoveMemberPayload;
    correlationId?: string;
  }): RemoveMemberCommand {
    return new RemoveMemberCommand({
      commandId: props.commandId,
      actorId: props.actorId,
      workspaceId: props.workspaceId,
      payload: props.payload,
      correlationId: props.correlationId,
    });
  }
}
