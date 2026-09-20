'use client';

export function openUpgradeModal(planId: string = 'pro') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('openUpgradeModal', { detail: { planId } }));
  }
}
