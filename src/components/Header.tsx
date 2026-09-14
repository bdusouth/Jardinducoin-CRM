'use client';

import React from 'react';
import { Language } from '@/types';
import { translations } from '@/lib/translations';
import {
  Sprout,
  Calendar,
  Languages,
  Truck,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onQuickAction: (action: 'client' | 'job' | 'quote' | 'invoice') => void;
  todayJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onNavigate,
  onQuickAction,
  todayJobsCount,
}) => {
  const t = translations[lang];
  const todayFormatted = new Date().toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-emerald-950/95 backdrop-blur-md text-white border-b border-emerald-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="bg-gradient-to-tr from-emerald-500 to-lime-400 p-2.5 rounded-xl shadow-inner text-emerald-950 flex items-center justify-center">
              <Sprout className="w-6 h-6 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  {t.app.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                  {t.app.badge}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 hidden md:block leading-tight">
                {t.app.tagline}
              </p>
            </div>
          </div>

          {/* Quick Date & Field Shortcut */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-emerald-200/90 bg-emerald-900/50 px-3 py-1.5 rounded-lg border border-emerald-800/60">
              <Calendar className="w-4 h-4 text-lime-400" />
              <span className="capitalize font-medium text-xs">{todayFormatted}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Action Button (Mobile & Desktop) */}
            <button
              onClick={() => onNavigate('field')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.fieldMode}</span>
              <span className="sm:hidden">Route</span>
              {todayJobsCount > 0 && (
                <span className="bg-emerald-950 text-white text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ml-1">
                  {todayJobsCount}
                </span>
              )}
            </button>

            {/* Quick New Creation dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium border border-emerald-700 transition">
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span className="hidden md:inline">{t.dashboard.quickActions}</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => onQuickAction('job')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center space-x-2"
                >
                  <span>🌱</span>
                  <span>{t.dashboard.newJob}</span>
                </button>
                <button
                  onClick={() => onQuickAction('client')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center space-x-2"
                >
                  <span>👤</span>
                  <span>{t.dashboard.newClient}</span>
                </button>
                <button
                  onClick={() => onQuickAction('quote')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center space-x-2"
                >
                  <span>📄</span>
                  <span>{t.dashboard.newQuote}</span>
                </button>
                <button
                  onClick={() => onQuickAction('invoice')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center space-x-2"
                >
                  <span>💳</span>
                  <span>{t.dashboard.newInvoice}</span>
                </button>
              </div>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-bold border border-emerald-700/80 transition"
              title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
            >
              <Languages className="w-3.5 h-3.5 text-lime-400" />
              <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
