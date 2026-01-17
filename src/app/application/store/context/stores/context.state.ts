import { ContextState } from '@domain/context/entities/context.entity';

export const initialContextState: ContextState = {
  current: null,
  available: {
    organizations: [],
    teams: [],
    partners: [],
  },
  history: [],
};
