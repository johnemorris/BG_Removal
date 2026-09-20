'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  PlusCircle, 
  Zap 
} from 'lucide-react';
import { MAIN_NAV } from '@/lib/constants/navigation';
import { getStoredUserState, UserState } from '@/lib/store/userStore';

interface HeaderProps {
  onOpenUpgradeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenUpgradeModal }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    setUserState(getStoredUserState());

    const handleStateChange = () => {
      setUserState(getStoredUserState());
    };

    window.addEventListener('userStateChange', handleStateChange);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('userStateChange', handleStateChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const credits = userState?.credits ?? 3;
  const currentPlan = userState?.plan ?? 'free';

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-studio-950/85 backdrop-blur-xl border-b border-white/10 py-2.5 shadow-2xl'
            : 'bg-studio-950/60 backdrop-blur-md border-b border-white/5 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2.5 group focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
              aria-label="ClearCut AI Homepage"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-glow-teal group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">ClearCut</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 uppercase tracking-widest shadow-xs">
                  PRO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-1"
              aria-label="Main Navigation"
            >
              {MAIN_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? 'text-white bg-white/10 shadow-inner border border-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1.5 text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar: Credits & Upgrade */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Credit Badge */}
            <button
              onClick={onOpenUpgradeModal}
              className="group flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-teal-500/40 transition-all text-xs font-medium text-slate-300 focus-visible:ring-2 focus-visible:ring-primary"
              title="Click to view & add credits"
            >
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#00f5d4] animate-pulse" />
              <span>
                <strong className="text-white font-bold">{credits}</strong> HD Credits
              </span>
              <PlusCircle className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Upgrade CTA */}
            <button
              onClick={onOpenUpgradeModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 text-xs font-extrabold shadow-glow-teal hover:shadow-glow-cyan transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{currentPlan === 'free' ? 'Upgrade to Pro' : 'Manage Sub'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenUpgradeModal}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white"
            >
              <span>{credits} Cr</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full bg-studio-900 border-t border-white/15 rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <span className="font-extrabold text-white">ClearCut AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-4 space-y-1">
              {MAIN_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-teal-300 bg-teal-500/10 border border-teal-500/20'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-400">
                  <span className="block font-semibold text-white">Your Wallet</span>
                  <span>{credits} HD credits remaining</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 uppercase border border-teal-500/30">
                  {currentPlan}
                </span>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUpgradeModal?.();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-glow-teal text-center"
              >
                Get More Credits & Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
