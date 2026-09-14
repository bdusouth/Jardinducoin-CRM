'use client';

import React, { useState } from 'react';
import { Invoice, Client, Language, LineItem, InvoiceStatus } from '@/types';
import { translations } from '@/lib/translations';
import { calculateTaxes } from '@/lib/storage';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  DollarSign,
  Trash2,
  Edit2,
  X,
  Sparkles,
  ArrowDownCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InvoicesViewProps {
  lang: Language;
  invoices: Invoice[];
  clients: Client[];
  onSaveInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onMarkPaid: (invoiceId: string, method: string, notes?: string) => void;
  onPreviewPrint: (invoice: Invoice) => void;
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  lang,
  invoices,
  clients,
  onSaveInvoice,
  onDeleteInvoice,
  onMarkPaid,
  onPreviewPrint,
  isCreateOpen = false,
  onCloseCreate,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(isCreateOpen);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Payment Recording Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'interac' | 'cash' | 'check' | 'credit_card'>('interac');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Invoice Form State
  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [applyTaxes, setApplyTaxes] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Virement Interac: paiement@jardinducoin.ca');
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'item-1',
      description: 'Forfait mensuel de tonte de pelouse (4 passages)',
      serviceType: 'lawn_mowing',
      quantity: 4,
      unit: 'visite',
      unitPrice: 48.0,
      total: 192.0,
    },
  ]);

  const handleOpenNew = () => {
    setEditingInvoice(null);
    setClientId(clients[0]?.id || '');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setApplyTaxes(true);
    setNotes('Virement Interac: paiement@jardinducoin.ca');
    setItems([
      {
        id: `item-${Date.now()}`,
        description: 'Forfait de tonte ou entretien paysager',
        serviceType: 'lawn_mowing',
        quantity: 1,
        unit: 'visite',
        unitPrice: 45.0,
        total: 45.0,
      },
    ]);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setClientId(inv.clientId);
    setIssueDate(inv.issueDate);
    setDueDate(inv.dueDate);
    setApplyTaxes(inv.applyTaxes);
    setNotes(inv.notes || '');
    setItems([...inv.items]);
    setShowCreateModal(true);
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

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxResults = calculateTaxes(subtotal, applyTaxes);

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const invoiceNumber =
      editingInvoice?.invoiceNumber ||
      `FAC-2026-${(invoices.length + 145).toString().padStart(3, '0')}`;

    const newOrUpdated: Invoice = {
      id: editingInvoice ? editingInvoice.id : `inv-${Date.now().toString().slice(-6)}`,
      invoiceNumber,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      address: client.address,
      sector: client.sector,
      issueDate,
      dueDate,
      items,
      subtotal: taxResults.subtotal,
      tps: taxResults.tps,
      tvq: taxResults.tvq,
      total: taxResults.total,
      applyTaxes,
      status: editingInvoice ? editingInvoice.status : 'sent',
      notes,
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
    };

    onSaveInvoice(newOrUpdated);
    setShowCreateModal(false);
    if (onCloseCreate) onCloseCreate();
  };

  const handleConfirmPayment = () => {
    if (!payingInvoice) return;
    onMarkPaid(payingInvoice.id, paymentMethod, paymentNotes);
    setPayingInvoice(null);
    setPaymentNotes('');
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.clientName.toLowerCase().includes(query) ||
      inv.sector.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>{t.invoices.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.invoices.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.invoices.addNew}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.invoices.searchPlaceholder}
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
            <option value="sent">{t.invoiceStatus.sent}</option>
            <option value="paid">{t.invoiceStatus.paid}</option>
            <option value="overdue">{t.invoiceStatus.overdue}</option>
            <option value="draft">{t.invoiceStatus.draft}</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredInvoices.map((inv) => {
          const isPaid = inv.status === 'paid';
          const isOverdue = inv.status === 'overdue';

          return (
            <div
              key={inv.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isPaid
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  : isOverdue
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400'
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {inv.invoiceNumber}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    {inv.clientName}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {inv.sector}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>
                    {t.invoices.issueDate}: <strong className="text-slate-700 dark:text-slate-300">{inv.issueDate}</strong>
                  </span>
                  <span>
                    {t.invoices.dueDate}: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>{inv.dueDate}</strong>
                  </span>
                  {inv.paymentMethod && (
                    <span className="text-emerald-600 font-semibold">
                      ✓ {inv.paymentMethod.toUpperCase()} le {inv.paymentDate}
                    </span>
                  )}
                </div>

                {/* Items brief */}
                <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                  {inv.items.map((it) => it.description).join(', ')}
                </div>
              </div>

              {/* Right Amounts & Actions */}
              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white block">
                    ${inv.total.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full inline-block ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isOverdue
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {t.invoiceStatus[inv.status]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewPrint(inv)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  {!isPaid && (
                    <button
                      onClick={() => setPayingInvoice(inv)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1 transition"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{t.invoices.markPaid}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(inv)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                    title={t.common.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(lang === 'fr' ? 'Supprimer cette facture ?' : 'Delete this invoice?')) {
                        onDeleteInvoice(inv.id);
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

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {t.invoices.paymentModal.title}
                </h2>
                <p className="text-xs text-slate-500 font-mono font-bold">
                  {payingInvoice.invoiceNumber} — {payingInvoice.clientName}
                </p>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-center">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 block">
                {lang === 'fr' ? 'Montant à encaisser' : 'Amount to collect'}
              </span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                ${payingInvoice.total.toFixed(2)} CAD
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.invoices.paymentModal.method}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'interac', label: t.invoices.paymentModal.interac, icon: '📲' },
                    { id: 'cash', label: t.invoices.paymentModal.cash, icon: '💵' },
                    { id: 'check', label: t.invoices.paymentModal.check, icon: '📝' },
                    { id: 'credit_card', label: t.invoices.paymentModal.creditCard, icon: '💳' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition flex items-center gap-2 ${
                        paymentMethod === m.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.invoices.paymentModal.notes}
                </label>
                <input
                  type="text"
                  placeholder="Ex: Confirmation Interac #89421"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                {t.invoices.paymentModal.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.invoices.paymentModal.confirm}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingInvoice ? t.invoices.form.titleEdit : t.invoices.form.titleNew}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.invoices.form.selectClient} *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.invoices.form.issueDate}
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.invoices.form.dueDate}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-800 dark:text-white">
                    {t.invoices.form.itemsList}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-500"
                  >
                    {t.invoices.form.addItem}
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
                          placeholder="Description"
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

              {/* Taxes breakdown */}
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
                        <span>TPS (5%):</span>
                        <span>${taxResults.tps.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>TVQ (9.975%):</span>
                        <span>${taxResults.tvq.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Facture:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">${taxResults.total.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  {t.invoices.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
