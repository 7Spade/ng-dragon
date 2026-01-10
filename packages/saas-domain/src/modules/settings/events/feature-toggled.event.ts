import { DomainEvent } from '@account-domain';
import { FeatureFlag } from '../value-objects/feature-flag';

export interface FeatureToggledPayload {
  workspaceId: string;
  flag: FeatureFlag;
}

export type FeatureToggledEvent = DomainEvent<FeatureToggledPayload>;
