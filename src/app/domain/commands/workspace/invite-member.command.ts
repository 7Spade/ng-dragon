import { WorkspaceScopedCommand } from '../base/command.base';

/**
 * Invite Member Command 負載
 */
export interface InviteMemberPayload {
  readonly accountId: string;
  readonly role: string;
  readonly permissions?: string[];
  readonly message?: string;
}

/**
 * Invite Member Command
 * 
 * 邀請成員加入工作區的命令
 */
export class InviteMemberCommand extends WorkspaceScopedCommand<InviteMemberPayload> {
  readonly commandType = 'workspace.member.invite' as const;

  /**
   * 創建命令
   */
  static create(props: {
    commandId: string;
    actorId: string;
    workspaceId: string;
    payload: InviteMemberPayload;
    correlationId?: string;
  }): InviteMemberCommand {
    return new InviteMemberCommand({
      commandId: props.commandId,
      actorId: props.actorId,
      workspaceId: props.workspaceId,
      payload: props.payload,
      correlationId: props.correlationId,
    });
  }
}
