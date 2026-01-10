import { WorkspaceType } from './workspace-type';

export type ScopeType = 'workspace' | 'organization' | 'team' | 'project' | 'partner';

export class ContainerScope {
  constructor(public readonly scopeId: string, public readonly scopeType: ScopeType | WorkspaceType) {}

  isWithinScope(entityScopeId: string): boolean {
    return this.scopeId === entityScopeId;
  }

  canContain(childScope: ContainerScope): boolean {
    if (this.scopeType === 'workspace' || this.scopeType === 'organization') return true;
    if (this.scopeType === 'team') return ['project', 'partner'].includes(childScope.scopeType as string);
    return this.scopeId === childScope.scopeId;
  }

  equals(other: ContainerScope): boolean {
    return this.scopeId === other.scopeId && this.scopeType === other.scopeType;
  }
}
