import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

interface SidebarState {
  expanded: boolean;
  mobileOpen: boolean;
  expandedSubItems: Set<string>;
}

const initialState: SidebarState = {
  expanded: true,
  mobileOpen: false,
  expandedSubItems: new Set(),
};

export const SidebarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ expanded, expandedSubItems }) => ({
    sidebarWidth: computed(() => (expanded() ? 240 : 64)),
    showText: computed(() => expanded()),
    isSubItemExpanded: computed(() => (id: string) => expandedSubItems().has(id)),
  })),
  withMethods((store) => ({
    toggle(): void {
      patchState(store, { expanded: !store.expanded() });
    },
    setExpanded(expanded: boolean): void {
      patchState(store, { expanded });
    },
    toggleMobile(): void {
      patchState(store, { mobileOpen: !store.mobileOpen() });
    },
    closeMobile(): void {
      patchState(store, { mobileOpen: false });
    },
    toggleSubItem(id: string): void {
      const expandedItems = new Set(store.expandedSubItems());
      if (expandedItems.has(id)) {
        expandedItems.delete(id);
      } else {
        expandedItems.add(id);
      }
      patchState(store, { expandedSubItems: expandedItems });
    },
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
