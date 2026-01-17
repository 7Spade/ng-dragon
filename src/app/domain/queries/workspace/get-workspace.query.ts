import { WorkspaceScopedQuery } from '../base/query.base';

/**
 * Get Workspace Query 參數
 */
export interface GetWorkspaceParams {
  readonly workspaceId: string;
}

/**
 * Get Workspace Query
 * 
 * 獲取單個工作區的查詢
 */
export class GetWorkspaceQuery extends WorkspaceScopedQuery<GetWorkspaceParams> {
  readonly queryType = 'workspace.get' as const;

  /**
   * 創建查詢
   */
  static create(props: {
    queryId: string;
    actorId: string;
    workspaceId: string;
    correlationId?: string;
  }): GetWorkspaceQuery {
    return new GetWorkspaceQuery({
      queryId: props.queryId,
      actorId: props.actorId,
      workspaceId: props.workspaceId,
      params: {
        workspaceId: props.workspaceId,
      },
      correlationId: props.correlationId,
    });
  }
}
