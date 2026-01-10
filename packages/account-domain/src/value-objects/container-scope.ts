export type ContainerScopeType = 'workspace' | 'organization' | 'team' | 'partner' | 'project';

export class ContainerScope {
  constructor(public readonly scopeId: string, public readonly scopeType: ContainerScopeType) {}

  isWithinScope(entityScopeId: string): boolean {
    return this.scopeId === entityScopeId;
  }

  canContain(childScope: ContainerScope): boolean {
    if (this.scopeType === 'workspace') return true;
    if (this.scopeType === 'organization') return ['team', 'partner', 'project'].includes(childScope.scopeType);
    if (this.scopeType === 'team') return childScope.scopeType === 'project';
    return this.scopeId === childScope.scopeId;
  }

  equals(other: ContainerScope): boolean {
    return this.scopeId === other.scopeId && this.scopeType === other.scopeType;
  }
}
