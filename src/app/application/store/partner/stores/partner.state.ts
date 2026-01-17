import { Partner } from '@domain/partner/entities/partner.entity';

export interface PartnerState {
  partners: Partner[];
  selectedPartner: Partner | null;
  loading: boolean;
  error: string | null;
}

export const initialPartnerState: PartnerState = {
  partners: [],
  selectedPartner: null,
  loading: false,
  error: null,
};
