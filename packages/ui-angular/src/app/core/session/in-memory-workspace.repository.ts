import { Injectable } from '@angular/core';
import { DomainEvent } from '@account-domain/src/events/domain-event';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { WorkspaceRepository } from '@core-engine/src/ports/workspace.repository';

interface WorkspaceView extends WorkspaceSnapshot {
  ownerId: string;
}

@Injectable({ providedIn: 'root' })
export class InMemoryWorkspaceRepository implements WorkspaceRepository {
  private readonly events = new Map<string, DomainEvent<unknown>[]>();
  private readonly snapshots = new Map<string, WorkspaceSnapshot>();
  private readonly owners = new Map<string, string>();

  async appendEvents(workspaceId: string, events: DomainEvent<unknown>[]): Promise<void> {
    const existing = this.events.get(workspaceId) ?? [];
    this.events.set(workspaceId, [...existing, ...events]);
  }

  async loadEvents(workspaceId: string): Promise<DomainEvent<unknown>[]> {
    return this.events.get(workspaceId) ?? [];
  }

  async saveSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    this.snapshots.set(snapshot.workspaceId, snapshot);
    this.owners.set(snapshot.workspaceId, snapshot.accountId);
  }

  async getSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    return this.snapshots.get(workspaceId) ?? null;
  }

  async list(): Promise<WorkspaceView[]> {
    return Array.from(this.snapshots.values()).map(snapshot => ({ ...snapshot, ownerId: this.owners.get(snapshot.workspaceId) || snapshot.accountId }));
  }
}
