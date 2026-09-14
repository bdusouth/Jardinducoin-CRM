'use client';

import React from 'react';
import {
  Client,
  Job,
  Quote,
  Invoice,
  Language,
} from '@/types';
import { translations } from '@/lib/translations';
import {
  DollarSign,
  FileCheck,
  Users,
  AlertCircle,
  Truck,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface DashboardViewProps {
  lang: Language;
  clients: Client[];
  jobs: Job[];
  quotes: Quote[];
  invoices: Invoice[];
  onNavigate: (view: string) => void;
  onQuickAction: (action: 'client' | 'job' | 'quote' | 'invoice') => void;
  onCompleteJob: (jobId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  clients,
  jobs,
  quotes,
  invoices,
  onNavigate,
  onQuickAction,
  onCompleteJob,
}) => {
  const t = translations[lang];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayJobs = jobs.filter((j) => j.date === todayStr);
  const completedTodayCount = todayJobs.filter((j) => j.status === 'completed').length;

  // Financial calculations
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);

  const pendingQuotes = quotes.filter((q) => q.status === 'sent' || q.status === 'draft');
  const pendingQuotesValue = pendingQuotes.reduce((sum, q) => sum + q.total, 0);

  const unpaidInvoices = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue');
  const unpaidInvoicesTotal = unpaidInvoices.reduce((sum, i) => sum + i.total, 0);

  const activeClientsCount = clients.filter((c) => c.status === 'active').length;

  // Sector breakdown
  const sectorCounts: Record<string, number> = {};
  clients.forEach((c) => {
    sectorCounts[c.sector] = (sectorCounts[c.sector] || 0) + 1;
  });

  const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-lime-300 border border-emerald-700/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Saison Paysagère 2026' : '2026 Landscaping Season'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t.dashboard.title}
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl">
            {t.dashboard.subtitle}
          </p>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('field')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all active:scale-95 text-sm"
          >
            <Truck className="w-4 h-4" />
            <span>{t.nav.fieldMode}</span>
            <span className="bg-emerald-950 text-white text-xs px-2 py-0.5 rounded-full ml-1">
              {todayJobs.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.revenueMonth}
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${totalRevenue.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{paidInvoices.length} {lang === 'fr' ? 'factures réglées' : 'paid invoices'}</span>
            </div>
          </div>
        </div>

        {/* Pending Invoices / To Collect */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.unpaidInvoices}
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${unpaidInvoicesTotal.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
              {unpaidInvoices.length} {lang === 'fr' ? 'en attente de paiement' : 'awaiting payment'}
            </div>
          </div>
        </div>

        {/* Pending Quotes Value */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.pendingQuotes}
            </span>
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${pendingQuotesValue.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
              {pendingQuotes.length} {lang === 'fr' ? 'devis à concrétiser' : 'quotes open'}
            </div>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.activeClients}
            </span>
            <div className="p-2 bg-lime-100 dark:bg-lime-950/60 text-lime-700 dark:text-lime-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {activeClientsCount}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {sortedSectors.length} {lang === 'fr' ? 'villes desservies sur la Rive-Sud' : 'South Shore cities'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Route & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Route Column (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.dashboard.todayRoute}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {completedTodayCount} / {todayJobs.length} {lang === 'fr' ? 'chantiers terminés aujourd’hui' : 'jobs completed today'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('field')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition"
            >
              <span>{lang === 'fr' ? 'Ouvrir Mode Camion' : 'Open Field View'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          {todayJobs.length > 0 && (
            <div className="mt-4 mb-4">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedTodayCount / todayJobs.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Today Job List */}
          {todayJobs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
              <p className="text-sm max-w-md mx-auto">{t.dashboard.noJobsToday}</p>
              <button
                onClick={() => onQuickAction('job')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow hover:bg-emerald-500 transition"
              >
                <span>+ {t.dashboard.newJob}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {todayJobs.map((job) => {
                const isCompleted = job.status === 'completed';
                const serviceLabel =
                  job.customServiceName ||
                  t.services[job.serviceType] ||
                  job.serviceType;

                return (
                  <div
                    key={job.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-400'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {job.clientName}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {job.sector}
                        </span>
                        {job.hasDogs && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            🐕 Chien
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {serviceLabel}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {t.timeSlots[job.timeSlot]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="text-right mr-2 hidden sm:block">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          ${job.price.toFixed(2)}
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.jobStatus.completed}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onCompleteJob(job.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.fieldMode.markDone}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sectors & Quick Links */}
        <div className="space-y-6">
          {/* South Shore Sectors Overview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t.dashboard.jobsBySector}</span>
            </h3>

            <div className="space-y-3">
              {sortedSectors.slice(0, 6).map(([sector, count]) => {
                const pct = Math.round((count / (clients.length || 1)) * 100);
                return (
                  <div key={sector} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{sector}</span>
                      <span className="text-slate-500 font-normal">
                        {count} {lang === 'fr' ? 'clients' : 'clients'} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Create Buttons */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-6 rounded-2xl border border-slate-800 text-white shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              {t.dashboard.quickActions}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onQuickAction('job')}
                className="p-3 bg-emerald-800/60 hover:bg-emerald-700/80 rounded-xl text-left border border-emerald-700/50 transition"
              >
                <div className="text-lime-300 font-bold text-xs">+ {lang === 'fr' ? 'Travail' : 'Job'}</div>
                <div className="text-[11px] text-emerald-200/80">{lang === 'fr' ? 'Planifier visite' : 'Schedule visit'}</div>
              </button>
              <button
                onClick={() => onQuickAction('quote')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700 transition"
              >
                <div className="text-blue-300 font-bold text-xs">+ {lang === 'fr' ? 'Devis' : 'Quote'}</div>
                <div className="text-[11px] text-slate-300">{lang === 'fr' ? 'Soumission TPS/TVQ' : 'Estimate'}</div>
              </button>
              <button
                onClick={() => onQuickAction('client')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700 transition"
              >
                <div className="text-amber-300 font-bold text-xs">+ {lang === 'fr' ? 'Client' : 'Client'}</div>
                <div className="text-[11px] text-slate-300">{lang === 'fr' ? 'Nouvelle adresse' : 'New address'}</div>
              </button>
              <button
                onClick={() => onQuickAction('invoice')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700 transition"
              >
                <div className="text-emerald-300 font-bold text-xs">+ {lang === 'fr' ? 'Facture' : 'Invoice'}</div>
                <div className="text-[11px] text-slate-300">{lang === 'fr' ? 'Facturer Interac' : 'Bill client'}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
