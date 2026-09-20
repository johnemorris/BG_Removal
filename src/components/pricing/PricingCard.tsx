'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PricingPlan } from '@/lib/constants/pricing';

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isAnnual,
  onSelectPlan,
}) => {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div
      className={`relative flex flex-col justify-between p-7 rounded-3xl transition-all duration-300 ${
        plan.popular
          ? 'glass-panel-glow border-2 border-teal-400 shadow-glow-teal scale-102 z-10'
          : 'glass-panel hover:border-white/20 shadow-dark-card hover:shadow-dark-elevated'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-glow-teal">
          {plan.badge}
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
        </div>

        <p className="text-xs text-slate-400 min-h-[36px] mb-5 leading-relaxed">
          {plan.tagline}
        </p>

        {/* Price display */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            ${price}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            / month
          </span>
        </div>

        <div className="text-xs font-bold text-teal-300 mb-6 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>
            {plan.credits} HD Credits ({plan.costPerImage} / image)
          </span>
        </div>

        {/* Feature List */}
        <ul className="space-y-3 text-xs text-slate-300 mb-8 border-t border-white/10 pt-6">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onSelectPlan(plan)}
        className={`w-full py-3 rounded-xl text-xs font-extrabold transition-all shadow-sm active:scale-98 ${
          plan.popular
            ? 'bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal hover:brightness-110'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
};
