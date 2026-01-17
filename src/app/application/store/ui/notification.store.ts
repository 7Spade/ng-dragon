import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

interface NotificationState {
  notifications: Array<{ id: string; read: boolean }>;
  drawerOpen: boolean;
  isLoading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  drawerOpen: false,
  isLoading: false,
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ notifications }) => ({
    unreadCount: computed(() => notifications().filter((n) => !n.read).length),
    hasUnread: computed(() => notifications().some((n) => !n.read)),
  })),
  withMethods((store) => ({
    toggleDrawer(): void {
      patchState(store, { drawerOpen: !store.drawerOpen() });
    },
    closeDrawer(): void {
      patchState(store, { drawerOpen: false });
    },
    addNotification(notification: { id: string; read: boolean }): void {
      patchState(store, { notifications: [notification, ...store.notifications()] });
    },
    markAsRead(notificationId: string): void {
      patchState(store, {
        notifications: store.notifications().map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        ),
      });
    },
    markAllAsRead(): void {
      patchState(store, {
        notifications: store.notifications().map((notification) => ({
          ...notification,
          read: true,
        })),
      });
    },
  }))
);
