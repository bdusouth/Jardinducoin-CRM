'use client';

import React, { useState } from 'react';
import { Quote, Client, Language, LineItem, ServiceType, QuoteStatus } from '@/types';
import { translations } from '@/lib/translations';
import { calculateTaxes } from '@/lib/storage';
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Printer,
  FileCheck,
  Trash2,
  Edit2,
  X,
  ArrowRight,
  Receipt,
} from 'lucide-react';

interface QuotesViewProps {
  lang: Language;
  quotes: Quote[];
  clients: Client[];
  onSaveQuote: (quote: Quote) => void;
  onDeleteQuote: (quoteId: string) => void;
  onConvertToInvoice: (quote: Quote) => void;
  onPreviewPrint: (quote: Quote) => void;
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  lang,
  quotes,
  clients,
  onSaveQuote,
  onDeleteQuote,
  onConvertToInvoice,
  onPreviewPrint,
  isCreateOpen = false,
  onCloseCreate,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(isCreateOpen);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  // Form state
  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [quoteDate, setQuoteDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [applyTaxes, setApplyTaxes] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Estimation valide 30 jours.');
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'item-1',
      description: 'Tonte de pelouse régulière',
      serviceType: 'lawn_mowing',
      quantity: 1,
      unit: 'visite',
      unitPrice: 45.0,
      total: 45.0,
    },
  ]);

  const handleOpenNew = () => {
    setEditingQuote(null);
    setClientId(clients[0]?.id || '');
    setQuoteDate(new Date().toISOString().split('T')[0]);
    setValidityDays(30);
    setApplyTaxes(true);
    setNotes('Estimation valide 30 jours. Dépôt de 25% requis pour les projets d’aménagement.');
    setItems([
      {
        id: `item-${Date.now()}`,
        description: 'Tonte de pelouse & finitions',
        serviceType: 'lawn_mowing',
        quantity: 1,
        unit: 'visite',
        unitPrice: 48.0,
        total: 48.0,
      },
    ]);
    setShowModal(true);
  };

  const handleOpenEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setClientId(quote.clientId);
    setQuoteDate(quote.date);
    setApplyTaxes(quote.applyTaxes);
    setNotes(quote.notes || '');
    setItems([...quote.items]);
    setShowModal(true);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unit: 'forfait',
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(val) : item.quantity;
      const p = field === 'unitPrice' ? Number(val) : item.unitPrice;
      item.total = Math.round(q * p * 100) / 100;
    }
    updated[index] = item;
    setItems(updated);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const subtotal = calculateSubtotal();
  const taxResults = calculateTaxes(subtotal, applyTaxes);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const validUntilDate = new Date(quoteDate);
    validUntilDate.setDate(validUntilDate.getDate() + validityDays);

    const quoteNumber =
      editingQuote?.quoteNumber ||
      `DEV-2026-${(quotes.length + 101).toString().padStart(3, '0')}`;

    const newOrUpdated: Quote = {
      id: editingQuote ? editingQuote.id : `quo-${Date.now().toString().slice(-6)}`,
      quoteNumber,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      address: client.address,
      sector: client.sector,
      date: quoteDate,
      validUntil: validUntilDate.toISOString().split('T')[0],
      items,
      subtotal: taxResults.subtotal,
      tps: taxResults.tps,
      tvq: taxResults.tvq,
      total: taxResults.total,
      applyTaxes,
      notes,
      status: editingQuote ? editingQuote.status : 'sent',
      createdAt: editingQuote?.createdAt || new Date().toISOString(),
    };

    onSaveQuote(newOrUpdated);
    setShowModal(false);
    if (onCloseCreate) onCloseCreate();
  };

  const filteredQuotes = quotes.filter((q) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      q.quoteNumber.toLowerCase().includes(query) ||
      q.clientName.toLowerCase().includes(query) ||
      q.sector.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === 'all' || q.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>{t.quotes.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.quotes.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.quotes.addNew}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.quotes.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'fr' ? 'Tous les statuts' : 'All statuses'}</option>
            <option value="draft">{t.quoteStatus.draft}</option>
            <option value="sent">{t.quoteStatus.sent}</option>
            <option value="accepted">{t.quoteStatus.accepted}</option>
            <option value="invoiced">{t.quoteStatus.invoiced}</option>
          </select>
        </div>
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuotes.map((quote) => {
          const isAccepted = quote.status === 'accepted';
          const isInvoiced = quote.status === 'invoiced';

          return (
            <div
              key={quote.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {quote.quoteNumber}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {quote.clientName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      📍 {quote.address} ({quote.sector})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-white block">
                      ${quote.total.toFixed(2)}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isAccepted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isInvoiced
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {t.quoteStatus[quote.status]}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs">
                  {quote.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="truncate pr-2">• {it.description}</span>
                      <span className="font-semibold shrink-0">${it.total.toFixed(2)}</span>
                    </div>
                  ))}
                  {quote.applyTaxes && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 flex justify-between">
                      <span>TPS: ${quote.tps.toFixed(2)} | TVQ: ${quote.tvq.toFixed(2)}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Total TTC</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => onPreviewPrint(quote)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.quotes.previewPrint}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {!isInvoiced && (
                    <button
                      onClick={() => onConvertToInvoice(quote)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{t.quotes.convertToInvoice}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(quote)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                    title={t.common.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(lang === 'fr' ? 'Supprimer ce devis ?' : 'Delete this quote?')) {
                        onDeleteQuote(quote.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Quote Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingQuote ? t.quotes.form.titleEdit : t.quotes.form.titleNew}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.quotes.form.selectClient} *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.address} ({c.sector})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.quotes.form.quoteDate}
                  </label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-800 dark:text-white">
                    {t.quotes.form.itemsList}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-500"
                  >
                    {t.quotes.form.addItem}
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          required
                          placeholder={t.quotes.form.description}
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Qté"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          step="0.5"
                          placeholder="Prix ($)"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-1 font-bold text-right text-slate-800 dark:text-white">
                        ${(item.total || 0).toFixed(2)}
                      </div>

                      <div className="col-span-1 text-right">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:text-rose-700 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Calculations Block */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={applyTaxes}
                    onChange={(e) => setApplyTaxes(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>{t.quotes.form.applyTaxes}</span>
                </label>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1 text-right text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{t.quotes.form.subtotal}:</span>
                    <span className="font-bold">${taxResults.subtotal.toFixed(2)}</span>
                  </div>
                  {applyTaxes && (
                    <>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>{t.quotes.form.tps}:</span>
                        <span>${taxResults.tps.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>{t.quotes.form.tvq}:</span>
                        <span>${taxResults.tvq.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>{t.quotes.form.grandTotal}:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">${taxResults.total.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.quotes.form.notes}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  {t.quotes.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
