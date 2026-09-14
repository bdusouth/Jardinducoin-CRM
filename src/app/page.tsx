'use client';

import React, { useState, useEffect } from 'react';
import {
  Client,
  Job,
  Quote,
  Invoice,
  CompanySettings,
  Language,
} from '@/types';
import {
  getStoredClients,
  saveClients,
  getStoredJobs,
  saveJobs,
  getStoredQuotes,
  saveQuotes,
  getStoredInvoices,
  saveInvoices,
  getStoredSettings,
  saveSettings,
  getStoredLanguage,
  saveLanguage,
} from '@/lib/storage';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { FieldModeView } from '@/components/FieldModeView';
import { ClientsView } from '@/components/ClientsView';
import { JobsView } from '@/components/JobsView';
import { QuotesView } from '@/components/QuotesView';
import { InvoicesView } from '@/components/InvoicesView';
import { SettingsView } from '@/components/SettingsView';
import { PrintDocumentModal } from '@/components/PrintDocumentModal';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [lang, setLang] = useState<Language>('fr');
  const [activeView, setActiveView] = useState<string>('dashboard');

  // State
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(getStoredSettings());

  // Print modal state
  const [printDoc, setPrintDoc] = useState<Quote | Invoice | null>(null);
  const [printType, setPrintType] = useState<'quote' | 'invoice'>('quote');

  // Quick Action Modal openers
  const [quickCreateClient, setQuickCreateClient] = useState(false);
  const [quickCreateJob, setQuickCreateJob] = useState(false);
  const [quickCreateQuote, setQuickCreateQuote] = useState(false);
  const [quickCreateInvoice, setQuickCreateInvoice] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    setIsClient(true);
    setLang(getStoredLanguage());
    setClients(getStoredClients());
    setJobs(getStoredJobs());
    setQuotes(getStoredQuotes());
    setInvoices(getStoredInvoices());
    setSettings(getStoredSettings());
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const handleReloadAll = () => {
    setClients(getStoredClients());
    setJobs(getStoredJobs());
    setQuotes(getStoredQuotes());
    setInvoices(getStoredInvoices());
    setSettings(getStoredSettings());
  };

  // Client handlers
  const handleSaveClient = (client: Client) => {
    const existingIndex = clients.findIndex((c) => c.id === client.id);
    let updated: Client[];
    if (existingIndex >= 0) {
      updated = [...clients];
      updated[existingIndex] = client;
    } else {
      updated = [client, ...clients];
    }
    setClients(updated);
    saveClients(updated);
  };

  const handleDeleteClient = (clientId: string) => {
    const updated = clients.filter((c) => c.id !== clientId);
    setClients(updated);
    saveClients(updated);
  };

  // Job handlers
  const handleSaveJob = (job: Job) => {
    const existingIndex = jobs.findIndex((j) => j.id === job.id);
    let updated: Job[];
    if (existingIndex >= 0) {
      updated = [...jobs];
      updated[existingIndex] = job;
    } else {
      updated = [job, ...jobs];
    }
    setJobs(updated);
    saveJobs(updated);
  };

  const handleDeleteJob = (jobId: string) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    setJobs(updated);
    saveJobs(updated);
  };

  const handleCompleteJob = (jobId: string) => {
    const updated = jobs.map((j) =>
      j.id === jobId
        ? {
            ...j,
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
          }
        : j
    );
    setJobs(updated);
    saveJobs(updated);
  };

  // Quote handlers
  const handleSaveQuote = (quote: Quote) => {
    const existingIndex = quotes.findIndex((q) => q.id === quote.id);
    let updated: Quote[];
    if (existingIndex >= 0) {
      updated = [...quotes];
      updated[existingIndex] = quote;
    } else {
      updated = [quote, ...quotes];
    }
    setQuotes(updated);
    saveQuotes(updated);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updated = quotes.filter((q) => q.id !== quoteId);
    setQuotes(updated);
    saveQuotes(updated);
  };

  const handleConvertToInvoice = (quote: Quote) => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-6)}`,
      invoiceNumber: `FAC-2026-${(invoices.length + 145).toString().padStart(3, '0')}`,
      quoteId: quote.id,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      address: quote.address,
      sector: quote.sector,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: quote.items,
      subtotal: quote.subtotal,
      tps: quote.tps,
      tvq: quote.tvq,
      total: quote.total,
      applyTaxes: quote.applyTaxes,
      status: 'sent',
      notes: quote.notes || 'Virement Interac à paiement@jardinducoin.ca',
      createdAt: new Date().toISOString(),
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);

    // Update quote status to invoiced
    const updatedQuotes = quotes.map((q) =>
      q.id === quote.id ? { ...q, status: 'invoiced' as const } : q
    );
    setQuotes(updatedQuotes);
    saveQuotes(updatedQuotes);

    // Switch view to invoices
    setActiveView('invoices');
  };

  // Invoice handlers
  const handleSaveInvoice = (invoice: Invoice) => {
    const existingIndex = invoices.findIndex((i) => i.id === invoice.id);
    let updated: Invoice[];
    if (existingIndex >= 0) {
      updated = [...invoices];
      updated[existingIndex] = invoice;
    } else {
      updated = [invoice, ...invoices];
    }
    setInvoices(updated);
    saveInvoices(updated);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const updated = invoices.filter((i) => i.id !== invoiceId);
    setInvoices(updated);
    saveInvoices(updated);
  };

  const handleMarkPaid = (invoiceId: string, method: string, notes?: string) => {
    const updated = invoices.map((i) =>
      i.id === invoiceId
        ? {
            ...i,
            status: 'paid' as const,
            paymentMethod: method as any,
            paymentDate: new Date().toISOString().split('T')[0],
            paidAmount: i.total,
            notes: notes ? `${i.notes || ''} [Paiement: ${notes}]` : i.notes,
          }
        : i
    );
    setInvoices(updated);
    saveInvoices(updated);
  };

  // Settings
  const handleSaveSettings = (newSettings: CompanySettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Quick action router
  const handleQuickAction = (action: 'client' | 'job' | 'quote' | 'invoice') => {
    if (action === 'client') {
      setActiveView('clients');
      setQuickCreateClient(true);
    } else if (action === 'job') {
      setActiveView('jobs');
      setQuickCreateJob(true);
    } else if (action === 'quote') {
      setActiveView('quotes');
      setQuickCreateQuote(true);
    } else if (action === 'invoice') {
      setActiveView('invoices');
      setQuickCreateInvoice(true);
    }
  };

  // Print handlers
  const handlePreviewQuote = (quote: Quote) => {
    setPrintDoc(quote);
    setPrintType('quote');
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setPrintDoc(invoice);
    setPrintType('invoice');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayJobsCount = jobs.filter((j) => j.date === todayStr && j.status !== 'completed').length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').length;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-black">
        Chargement de Jardin du Coin CRM...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-emerald-950">
      {/* Top Navigation Bar */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={setActiveView}
        onQuickAction={handleQuickAction}
        todayJobsCount={todayJobsCount}
      />

      {/* Main Workspace with Sidebar & Dynamic View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          lang={lang}
          activeView={activeView}
          onNavigate={setActiveView}
          pendingInvoicesCount={pendingInvoicesCount}
          todayJobsCount={todayJobsCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeView === 'dashboard' && (
            <DashboardView
              lang={lang}
              clients={clients}
              jobs={jobs}
              quotes={quotes}
              invoices={invoices}
              onNavigate={setActiveView}
              onQuickAction={handleQuickAction}
              onCompleteJob={handleCompleteJob}
            />
          )}

          {activeView === 'field' && (
            <FieldModeView
              lang={lang}
              jobs={jobs}
              onCompleteJob={handleCompleteJob}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'clients' && (
            <ClientsView
              lang={lang}
              clients={clients}
              jobs={jobs}
              quotes={quotes}
              invoices={invoices}
              onSaveClient={handleSaveClient}
              onDeleteClient={handleDeleteClient}
              isCreateOpen={quickCreateClient}
              onCloseCreate={() => setQuickCreateClient(false)}
            />
          )}

          {activeView === 'jobs' && (
            <JobsView
              lang={lang}
              jobs={jobs}
              clients={clients}
              onSaveJob={handleSaveJob}
              onDeleteJob={handleDeleteJob}
              onCompleteJob={handleCompleteJob}
              isCreateOpen={quickCreateJob}
              onCloseCreate={() => setQuickCreateJob(false)}
            />
          )}

          {activeView === 'quotes' && (
            <QuotesView
              lang={lang}
              quotes={quotes}
              clients={clients}
              onSaveQuote={handleSaveQuote}
              onDeleteQuote={handleDeleteQuote}
              onConvertToInvoice={handleConvertToInvoice}
              onPreviewPrint={handlePreviewQuote}
              isCreateOpen={quickCreateQuote}
              onCloseCreate={() => setQuickCreateQuote(false)}
            />
          )}

          {activeView === 'invoices' && (
            <InvoicesView
              lang={lang}
              invoices={invoices}
              clients={clients}
              onSaveInvoice={handleSaveInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onMarkPaid={handleMarkPaid}
              onPreviewPrint={handlePreviewInvoice}
              isCreateOpen={quickCreateInvoice}
              onCloseCreate={() => setQuickCreateInvoice(false)}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              lang={lang}
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onDataResetOrImported={handleReloadAll}
            />
          )}
        </main>
      </div>

      {/* Print Document Modal */}
      {printDoc && (
        <PrintDocumentModal
          lang={lang}
          document={printDoc}
          type={printType}
          settings={settings}
          onClose={() => setPrintDoc(null)}
        />
      )}
    </div>
  );
}
