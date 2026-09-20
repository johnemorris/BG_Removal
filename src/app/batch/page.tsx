'use client';

import React from 'react';
import { BatchQueue } from '@/components/batch/BatchQueue';
import { Layers } from 'lucide-react';
import { openUpgradeModal } from '@/lib/store/modalStore';

export default function BatchPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>High-Throughput E-Commerce Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Batch Background Removal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Process multiple product photos or portraits simultaneously. Apply uniform Amazon pure white backgrounds or custom studio drop shadows across your entire collection.
        </p>
      </div>

      {/* Batch Processing Queue */}
      <BatchQueue onOpenUpgradeModal={() => openUpgradeModal('pro')} />
    </div>
  );
}
