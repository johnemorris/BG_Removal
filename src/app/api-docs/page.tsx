'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Send, 
  Zap 
} from 'lucide-react';
import { KeyManager } from '@/components/api-docs/KeyManager';
import { CodeSnippets } from '@/components/api-docs/CodeSnippets';

export default function ApiDocsPage() {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResponse, setTestResponse] = useState<string | null>(null);

  const runLiveApiTest = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'cc_live_demo_test_key_123',
        },
        body: JSON.stringify({
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          format: 'png',
        }),
      });

      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
      setTestStatus(res.ok ? 'success' : 'error');
    } catch (e: any) {
      setTestResponse(e.message);
      setTestStatus('error');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold shadow-glow-teal">
          <Code2 className="w-3.5 h-3.5 text-teal-400" />
          <span>REST API & SDK Reference v1.0</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Developer API Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Integrate deep learning AI background removal into your mobile apps, Shopify stores, or creative pipelines with sub-second response times.
        </p>
      </div>

      <KeyManager />

      {/* Code Integration Showcase */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            Quickstart Code Snippets
          </h3>
          <p className="text-xs text-slate-400">
            Copy and paste ready-to-run code in your preferred programming language.
          </p>
        </div>

        <CodeSnippets />
      </div>

      {/* API Reference Details */}
      <div className="glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-dark-elevated space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-teal-400 text-slate-950 font-mono text-xs font-extrabold">
              POST
            </span>
            <code className="font-mono text-sm font-bold text-white">
              /api/remove-bg
            </code>
          </div>
          <p className="text-xs text-slate-400">
            Removes backgrounds from binary files, URLs, or base64 strings with deep neural matting.
          </p>
        </div>

        {/* Request Headers */}
        <div className="space-y-3 border-t border-white/10 pt-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Request Headers
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <code className="font-bold text-teal-300 font-mono">X-Api-Key</code>
                <span className="ml-2 text-[10px] text-rose-400 font-extrabold uppercase">Required</span>
              </div>
              <span className="text-slate-400">Your live API key (e.g. <code>cc_live_...</code>)</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <code className="font-bold text-teal-300 font-mono">Content-Type</code>
                <span className="ml-2 text-[10px] text-rose-400 font-extrabold uppercase">Required</span>
              </div>
              <span className="text-slate-400"><code>multipart/form-data</code> or <code>application/json</code></span>
            </div>
          </div>
        </div>

        {/* Live Playground Tester */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                Live API Sandbox Tester
              </h4>
              <p className="text-xs text-slate-400">
                Execute a test request against the local neural network endpoint.
              </p>
            </div>

            <button
              onClick={runLiveApiTest}
              disabled={testStatus === 'testing'}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-glow-teal transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testStatus === 'testing' ? 'Inference...' : 'Send Test Request'}</span>
            </button>
          </div>

          {testResponse && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-emerald-300 font-mono text-xs overflow-x-auto space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[10px] pb-2 border-b border-white/10">
                <span>Response: 200 OK</span>
                <span className="text-teal-300">Payload Returned</span>
              </div>
              <pre>{testResponse}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
