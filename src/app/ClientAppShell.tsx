'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckoutModal } from '@/components/pricing/CheckoutModal';
import { openUpgradeModal } from '@/lib/store/modalStore';

export const ClientAppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlanId, setCheckoutPlanId] = useState('pro');

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.planId) {
        setCheckoutPlanId(e.detail.planId);
      }
      setCheckoutOpen(true);
    };

    window.addEventListener('openUpgradeModal', handleOpen);
    return () => window.removeEventListener('openUpgradeModal', handleOpen);
  }, []);

  return (
    <>
      <Header onOpenUpgradeModal={() => openUpgradeModal('pro')} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        defaultPlanId={checkoutPlanId}
      />
    </>
  );
};
