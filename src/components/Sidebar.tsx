'use client';

import React from 'react';
import { Language } from '@/types';
import { translations } from '@/lib/translations';
import {
  LayoutDashboard,
  Truck,
  Users,
  CalendarDays,
  FileText,
  CreditCard,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  lang: Language;
  activeView: string;
  onNavigate: (view: string) => void;
  pendingInvoicesCount: number;
  todayJobsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  activeView,
  onNavigate,
  pendingInvoicesCount,
  todayJobsCount,
}) => {
  const t = translations[lang];

  const navItems = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'field',
      label: t.nav.fieldMode,
      icon: Truck,
      badge: todayJobsCount > 0 ? todayJobsCount : null,
      badgeColor: 'bg-lime-500 text-emerald-950',
    },
    {
      id: 'clients',
      label: t.nav.clients,
      icon: Users,
      badge: null,
    },
    {
      id: 'jobs',
      label: t.nav.jobs,
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'quotes',
      label: t.nav.quotes,
      icon: FileText,
      badge: null,
    },
    {
      id: 'invoices',
      label: t.nav.invoices,
      icon: CreditCard,
      badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : null,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4 justify-between">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'fr' ? 'Menu Principal' : 'Main Navigation'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-lime-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-emerald-700 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Footer / Tip in Sidebar */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-lime-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rive-Sud de Montréal</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {lang === 'fr'
              ? 'Longueuil, Brossard, Boucherville, Saint-Lambert, Candiac & environs.'
              : 'Serving Longueuil, Brossard, Boucherville, Saint-Lambert, Candiac & area.'}
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex justify-around items-center text-[10px] text-slate-400 shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg relative ${
                isActive ? 'text-lime-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
              {item.badge !== null && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-lime-400 ring-2 ring-slate-900" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => onNavigate('invoices')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg relative ${
            activeView === 'invoices' ? 'text-lime-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span>{lang === 'fr' ? 'Factures' : 'Invoices'}</span>
          {pendingInvoicesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
          )}
        </button>
      </nav>
    </>
  );
};
