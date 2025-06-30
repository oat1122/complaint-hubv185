import test from 'node:test';
import assert from 'node:assert';
import { useNotificationStore } from '../build/lib/notification.js';

function resetStore() {
  useNotificationStore.setState({ notifications: [], unreadCount: 0 });
}

test('markAsRead only decrements when unread', () => {
  resetStore();
  const store = useNotificationStore.getState();
  store.addNotification({ title: 't', message: 'm', type: 'info' });
  const id = useNotificationStore.getState().notifications[0].id;
  assert.strictEqual(useNotificationStore.getState().unreadCount, 1);

  store.markAsRead(id);
  assert.strictEqual(useNotificationStore.getState().unreadCount, 0);

  store.markAsRead(id);
  assert.strictEqual(useNotificationStore.getState().unreadCount, 0);
});

test('removeNotification prevents negative counts', () => {
  resetStore();
  const store = useNotificationStore.getState();
  store.addNotification({ title: 't', message: 'm', type: 'info' });
  const id = useNotificationStore.getState().notifications[0].id;
  store.removeNotification(id);
  assert.strictEqual(useNotificationStore.getState().unreadCount, 0);

  // Remove again when no unread notifications should not go negative
  store.removeNotification(id);
  assert.strictEqual(useNotificationStore.getState().unreadCount, 0);
});
