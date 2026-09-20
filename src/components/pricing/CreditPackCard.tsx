'use client';

import React from 'react';
import { CreditPack } from '@/lib/constants/pricing';
import { Zap } from 'lucide-react';

interface CreditPackCardProps {
  pack: CreditPack;
  onSelectPack: (pack: CreditPack) => void;
}

export const CreditPackCard: React.FC<CreditPackCardProps> = ({
  pack,
  onSelectPack,
}) => {
  return (
    <div
      onClick={() => onSelectPack(pack)}
      className={`relative p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
        pack.popular
          ? 'glass-panel-glow border-2 border-teal-400 shadow-glow-teal'
          : 'glass-panel hover:border-white/20 shadow-dark-card'
      }`}
    >
      {pack.savings && (
        <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-400 text-slate-950">
          {pack.savings}
        </span>
      )}

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-teal-400">
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold uppercase tracking-wider">Pay-As-You-Go</span>
        </div>

        <div className="text-3xl font-extrabold text-white tracking-tight">
          {pack.credits} <span className="text-sm font-semibold text-slate-400">Credits</span>
        </div>

        <div className="text-2xl font-extrabold text-teal-300">
          ${pack.price}
        </div>

        <p className="text-xs text-slate-400">
          {pack.pricePerCredit} • Valid for 2 full years
        </p>
      </div>

      <button
        type="button"
        className="mt-6 w-full py-2.5 rounded-xl border border-white/15 hover:border-teal-400 hover:bg-teal-500/10 text-slate-200 hover:text-teal-300 text-xs font-bold transition-all"
      >
        Buy {pack.credits} Credits
      </button>
    </div>
  );
};
