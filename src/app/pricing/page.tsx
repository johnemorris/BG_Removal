'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { SUBSCRIPTION_PLANS, CREDIT_PACKS, PRICING_FAQS, PricingPlan, CreditPack } from '@/lib/constants/pricing';
import { PricingCard } from '@/components/pricing/PricingCard';
import { CreditPackCard } from '@/components/pricing/CreditPackCard';
import { openUpgradeModal } from '@/lib/store/modalStore';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === 'free') {
      window.location.href = '/';
      return;
    }
    openUpgradeModal(plan.id);
  };

  const handleSelectPack = (pack: CreditPack) => {
    openUpgradeModal('pack');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold shadow-glow-teal">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-current" />
          <span>Transparent Creator & Team Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Sleek Pricing. Instant Scale.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Start for free with 3 HD credits. Scale up with subscriptions starting at $0.09 per cutout or buy pay-as-you-go credit packs.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center space-x-3 text-xs font-bold">
          <span className={!isAnnual ? 'text-white' : 'text-slate-400'}>Monthly</span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-teal-500 shadow-glow-teal"
            role="switch"
            aria-checked={isAnnual}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ease-in-out ${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center space-x-1.5">
            <span className={isAnnual ? 'text-white' : 'text-slate-400'}>Annual</span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 shadow-glow-teal">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isAnnual={isAnnual}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* Pay-As-You-Go Credit Packs Section */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Prefer Pay-As-You-Go?
          </h2>
          <p className="text-xs text-slate-400">
            One-time purchase without recurring fees. Valid for 2 full years for web studio and API access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <CreditPackCard
              key={pack.id}
              pack={pack}
              onSelectPack={handleSelectPack}
            />
          ))}
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Plan Feature Comparison
          </h2>
          <p className="text-xs text-slate-400">
            Detailed breakdown of capabilities across all plan tiers.
          </p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-dark-elevated">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-white font-extrabold">
                <tr>
                  <th className="py-4 px-6">Feature</th>
                  <th className="py-4 px-4 text-center">Free</th>
                  <th className="py-4 px-4 text-center">Starter</th>
                  <th className="py-4 px-4 text-center text-teal-300 bg-teal-500/10">Pro</th>
                  <th className="py-4 px-4 text-center">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Monthly HD Credits</td>
                  <td className="py-3.5 px-4 text-center">3</td>
                  <td className="py-3.5 px-4 text-center">40</td>
                  <td className="py-3.5 px-4 text-center font-bold text-teal-300 bg-teal-500/10">200</td>
                  <td className="py-3.5 px-4 text-center font-bold text-white">800</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Standard Web Previews</td>
                  <td className="py-3.5 px-4 text-center">Unlimited</td>
                  <td className="py-3.5 px-4 text-center">Unlimited</td>
                  <td className="py-3.5 px-4 text-center bg-teal-500/10 text-teal-300 font-bold">Unlimited</td>
                  <td className="py-3.5 px-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Max Export Resolution</td>
                  <td className="py-3.5 px-4 text-center">1080p</td>
                  <td className="py-3.5 px-4 text-center">4K Ultra HD</td>
                  <td className="py-3.5 px-4 text-center font-bold text-teal-300 bg-teal-500/10">4K Ultra HD</td>
                  <td className="py-3.5 px-4 text-center font-bold text-white">4K Ultra HD</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Realistic AI Drop Shadows</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold">✓</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold bg-teal-500/10">✓</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Touch-Up Refinement Brush</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold">✓</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold bg-teal-500/10">✓</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Batch Processing Max Size</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center">5 images</td>
                  <td className="py-3.5 px-4 text-center font-bold text-teal-300 bg-teal-500/10">20 images</td>
                  <td className="py-3.5 px-4 text-center font-bold text-white">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Developer REST API</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center">50 req/min</td>
                  <td className="py-3.5 px-4 text-center text-teal-300 bg-teal-500/10 font-bold">500 req/min</td>
                  <td className="py-3.5 px-4 text-center text-white">Dedicated SLA</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-white">Commercial License</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">Personal only</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold">✓</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold bg-teal-500/10">✓</td>
                  <td className="py-3.5 px-4 text-center text-teal-400 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">
            Have questions about billing or how ClearCut AI works? We&apos;ve got answers.
          </p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all shadow-dark-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-teal-300"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-teal-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
