import { writable } from 'svelte/store';

const messageStore = writable<string | null>(null);

export function notify(message: string) {
  messageStore.set(message);
  // Auto-clear notification after 3 seconds
  setTimeout(() => messageStore.set(null), 3000);
}

export { messageStore };