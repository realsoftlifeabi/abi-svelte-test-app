import { writable } from 'svelte/store';
import type { User } from './types';

// Theme store for light/dark mode
type Theme = 'light' | 'dark';

// Load theme from localStorage or use system preference
const loadTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Use system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const theme = writable<Theme>(loadTheme());

// Apply theme to document and persist changes
if (typeof window !== 'undefined') {
  theme.subscribe((value) => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem('theme', value);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const stored = localStorage.getItem('theme');
    if (!stored) { // Only auto-switch if user hasn't manually set preference
      theme.set(e.matches ? 'dark' : 'light');
    }
  });
}

// Load users from localStorage or use default data
const loadUsers = (): User[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored users:', e);
      }
    }
  }
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' }
  ];
};

// Load nextId from localStorage or use default
const loadNextId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('nextId');
    if (stored) {
      try {
        return parseInt(stored, 10);
      } catch (e) {
        console.error('Error parsing stored nextId:', e);
      }
    }
  }
  return 5;
};

export const users = writable<User[]>(loadUsers());
export const nextId = writable<number>(loadNextId());

// Subscribe to users store and persist changes
if (typeof window !== 'undefined') {
  users.subscribe((value) => {
    localStorage.setItem('users', JSON.stringify(value));
  });

  nextId.subscribe((value) => {
    localStorage.setItem('nextId', value.toString());
  });
}
