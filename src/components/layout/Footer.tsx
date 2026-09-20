import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, CheckCircle2, Lock } from 'lucide-react';
import { FOOTER_LINKS } from '@/lib/constants/navigation';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-white">Privacy First & GDPR Compliant</strong>
                <span>All photos are automatically purged after processing.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-white">100% Automated AI Segmentation</strong>
                <span>Sub-second inference with fine hair and edge preservation.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-white">Commercial License Included</strong>
                <span>High-resolution 4K exports for e-commerce, print & marketing.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">ClearCut AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The professional AI background removal platform for e-commerce sellers, design agencies, photographers, and developers. Fast, precise, and privacy-preserving.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
              <span>© {new Date().getFullYear()} ClearCut AI Inc.</span>
              <span>All rights reserved.</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.product.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-teal-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Features
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.features.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-teal-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Developers & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.resources.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-teal-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
