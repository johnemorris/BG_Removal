'use client';

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
  requestCount: number;
}

export interface HistoryItem {
  id: string;
  name: string;
  originalUrl: string;
  processedUrl: string;
  timestamp: number;
  width: number;
  height: number;
}

export interface UserState {
  credits: number;
  plan: 'free' | 'starter' | 'pro' | 'business';
  isAnnual: boolean;
  processedCount: number;
  apiKeys: ApiKeyItem[];
  history: HistoryItem[];
}

const STORAGE_KEY = 'clearcut_ai_user_state_v1';

const DEFAULT_STATE: UserState = {
  credits: 3,
  plan: 'free',
  isAnnual: false,
  processedCount: 0,
  apiKeys: [
    {
      id: 'key-default-1',
      name: 'Default Web Sandbox Key',
      key: 'cc_live_94f8a12e38c92841b5a201',
      createdAt: new Date().toISOString(),
      requestCount: 14,
    },
  ],
  history: [],
};

export function getStoredUserState(): UserState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading stored state:', e);
    return DEFAULT_STATE;
  }
}

export function saveStoredUserState(state: UserState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('userStateChange'));
  } catch (e) {
    console.error('Error saving user state:', e);
  }
}

export function deductCredit(): boolean {
  const current = getStoredUserState();
  if (current.credits <= 0) return false;
  current.credits -= 1;
  current.processedCount += 1;
  saveStoredUserState(current);
  return true;
}

export function addCredits(amount: number): void {
  const current = getStoredUserState();
  current.credits += amount;
  saveStoredUserState(current);
}

export function setPlan(plan: 'free' | 'starter' | 'pro' | 'business', additionalCredits: number): void {
  const current = getStoredUserState();
  current.plan = plan;
  current.credits += additionalCredits;
  saveStoredUserState(current);
}

export function addApiKey(name: string): ApiKeyItem {
  const current = getStoredUserState();
  const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const newKey: ApiKeyItem = {
    id: 'key-' + Date.now(),
    name: name.trim() || 'New Secret Key',
    key: `cc_live_${randomHex}`,
    createdAt: new Date().toISOString(),
    requestCount: 0,
  };
  current.apiKeys.unshift(newKey);
  saveStoredUserState(current);
  return newKey;
}

export function deleteApiKey(id: string): void {
  const current = getStoredUserState();
  current.apiKeys = current.apiKeys.filter(k => k.id !== id);
  saveStoredUserState(current);
}

export function addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
  const current = getStoredUserState();
  const newItem: HistoryItem = {
    ...item,
    id: 'hist-' + Date.now(),
    timestamp: Date.now(),
  };
  current.history.unshift(newItem);
  if (current.history.length > 20) {
    current.history = current.history.slice(0, 20);
  }
  saveStoredUserState(current);
}
