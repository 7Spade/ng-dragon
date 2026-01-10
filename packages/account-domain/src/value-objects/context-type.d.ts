export type ContextType = 'user' | 'organization' | 'team' | 'partner';
export interface ContextInfo {
    type: ContextType;
    id: string | null;
    name?: string;
}
//# sourceMappingURL=context-type.d.ts.map