'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2 
} from 'lucide-react';
import { 
  ApiKeyItem, 
  getStoredUserState, 
  addApiKey, 
  deleteApiKey 
} from '@/lib/store/userStore';

export const KeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const state = getStoredUserState();
    setKeys(state.apiKeys || []);
  }, []);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const created = addApiKey(newKeyName.trim());
    setKeys((prev) => [created, ...prev]);
    setNewKeyName('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    deleteApiKey(id);
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-dark-elevated space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Key className="w-4 h-4 text-teal-400" />
            Active API Secret Keys
          </h3>
          <p className="text-xs text-slate-400">
            Authenticate your backend pipelines, mobile apps, or Shopify webhooks.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow-teal transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
        </button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreateKey}
          className="p-4 rounded-2xl bg-white/5 border border-teal-500/30 space-y-3"
        >
          <label className="text-xs font-semibold text-slate-200 block">
            API Key Label
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Production Shopify Sync, Webhook Worker..."
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-white/15 text-xs outline-none bg-studio-950 text-white focus:border-teal-400"
              required
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-glow-teal"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Keys List */}
      <div className="space-y-3">
        {keys.map((k) => (
          <div
            key={k.id}
            className="p-4 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-white">{k.name}</span>
                <span className="text-[10px] text-teal-300 bg-teal-500/20 font-extrabold px-2 py-0.5 rounded-full border border-teal-500/30">
                  Live
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
                <span>{k.key.substring(0, 14)}••••••••••••••••</span>
                <button
                  onClick={() => handleCopy(k.id, k.key)}
                  className="text-slate-400 hover:text-teal-300 p-0.5"
                  title="Copy full key"
                >
                  {copiedId === k.id ? (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <div className="text-right text-slate-400">
                <span className="block text-[11px]">Requests: {k.requestCount}</span>
                <span className="text-[10px] text-slate-500">
                  Created {new Date(k.createdAt).toLocaleDateString()}
                </span>
              </div>

              {keys.length > 1 && (
                <button
                  onClick={() => handleDelete(k.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
                  title="Revoke Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
