'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  X, 
  Zap, 
  Lock, 
  ShieldCheck 
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from '@/lib/constants/pricing';
import { addCredits, setPlan } from '@/lib/store/userStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  defaultPlanId = 'pro',
}) => {
  const [tab, setTab] = useState<'subscription' | 'credits'>('subscription');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [selectedPackId, setSelectedPackId] = useState<string>('pack-50');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 600));

    if (tab === 'subscription') {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[2];
      setPlan(plan.id as any, plan.credits);
      setSuccessMessage(`Successfully upgraded to ${plan.name} plan! Added ${plan.credits} HD credits to your wallet.`);
    } else {
      const pack = CREDIT_PACKS.find(p => p.id === selectedPackId) || CREDIT_PACKS[1];
      addCredits(pack.credits);
      setSuccessMessage(`Payment successful! Added ${pack.credits} HD credits to your balance.`);
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-studio-950 text-white rounded-3xl shadow-dark-elevated border border-white/15 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center shadow-glow-teal">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight">
                Refill Wallet & Upgrade
              </h3>
              <p className="text-xs text-slate-400">
                Unlock 4K Ultra-HD, batch processing, and commercial licensing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
            <button
              onClick={() => {
                setTab('subscription');
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'subscription'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Subscriptions
            </button>
            <button
              onClick={() => {
                setTab('credits');
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'credits'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pay As You Go Packs
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {successMessage ? (
            <div className="p-6 text-center space-y-4 bg-teal-500/10 rounded-3xl border border-teal-500/30">
              <div className="w-12 h-12 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-glow-teal">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-base">You&apos;re all set!</h4>
                <p className="text-xs text-slate-300">{successMessage}</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-glow-teal"
              >
                Back to Studio
              </button>
            </div>
          ) : (
            <>
              {tab === 'subscription' ? (
                <div className="space-y-3">
                  {SUBSCRIPTION_PLANS.filter(p => p.monthlyPrice > 0).map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-teal-400 bg-teal-500/10 shadow-glow-teal'
                            : 'border-white/10 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-white">{plan.name}</span>
                            {plan.badge && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-400 text-slate-950">
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            <strong className="text-teal-300">{plan.credits} credits</strong> / mo ({plan.costPerImage} per image)
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xl font-extrabold text-white">
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-xs text-slate-400">/mo</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {CREDIT_PACKS.map((pack) => {
                    const isSelected = selectedPackId === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'border-teal-400 bg-teal-500/10 shadow-glow-teal'
                            : 'border-white/10 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {pack.credits} Credits
                          </span>
                          {pack.savings && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-teal-400 text-slate-950">
                              {pack.savings}
                            </span>
                          )}
                        </div>
                        <div className="text-xl font-extrabold text-teal-300">
                          ${pack.price}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {pack.pricePerCredit}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Instant Demo Sandbox Payment</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">256-Bit Encrypted</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-glow-teal flex items-center justify-center space-x-2 transition-all active:scale-98"
                >
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>
                    {isProcessing ? 'Processing Transaction...' : 'Complete One-Click Purchase'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-center text-[11px] text-slate-500">
          30-day money-back guarantee • Cancel anytime with 1-click
        </div>
      </div>
    </div>
  );
};
