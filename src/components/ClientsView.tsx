'use client';

import React, { useState } from 'react';
import { Client, Language, Sector, Job, Quote, Invoice } from '@/types';
import { translations } from '@/lib/translations';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Key,
  AlertTriangle,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ClientsViewProps {
  lang: Language;
  clients: Client[];
  jobs: Job[];
  quotes: Quote[];
  invoices: Invoice[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

const southShoreSectors: Sector[] = [
  'Longueuil',
  'Brossard',
  'Boucherville',
  'Saint-Lambert',
  'Candiac',
  'La Prairie',
  'Saint-Bruno',
  'Saint-Hubert',
  'Greenfield Park',
  'Varennes',
  'Sainte-Julie',
  'Autre / Other',
];

export const ClientsView: React.FC<ClientsViewProps> = ({
  lang,
  clients,
  jobs,
  quotes,
  invoices,
  onSaveClient,
  onDeleteClient,
  isCreateOpen = false,
  onCloseCreate,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(isCreateOpen);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [selectedClientDetails, setSelectedClientDetails] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    sector: 'Longueuil',
    postalCode: '',
    gateCode: '',
    hasDogs: false,
    dogNotes: '',
    lawnSizeSqFt: 3500,
    notes: '',
    status: 'active',
  });

  const handleOpenNew = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      address: '',
      sector: 'Longueuil',
      postalCode: '',
      gateCode: '',
      hasDogs: false,
      dogNotes: '',
      lawnSizeSqFt: 3500,
      notes: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    const newOrUpdated: Client = {
      id: editingClient ? editingClient.id : `cli-${Date.now().toString().slice(-6)}`,
      name: formData.name || '',
      companyName: formData.companyName || '',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      sector: (formData.sector as Sector) || 'Longueuil',
      postalCode: formData.postalCode || '',
      gateCode: formData.gateCode || '',
      hasDogs: formData.hasDogs || false,
      dogNotes: formData.dogNotes || '',
      lawnSizeSqFt: Number(formData.lawnSizeSqFt) || 0,
      notes: formData.notes || '',
      tags: editingClient?.tags || ['Client 2026'],
      status: formData.status || 'active',
      createdAt: editingClient?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveClient(newOrUpdated);
    setShowModal(false);
    if (onCloseCreate) onCloseCreate();
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q));

    const matchesSector = selectedSector === 'all' || c.sector === selectedSector;
    return matchesQuery && matchesSector;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>{t.clients.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.clients.subtitle} • <span className="font-bold text-emerald-600">{filteredClients.length} {t.clients.totalCount}</span>
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.clients.addNew}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.clients.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500"
          >
            <option value="all">{t.clients.allSectors}</option>
            {southShoreSectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const clientJobs = jobs.filter((j) => j.clientId === client.id);
          const clientQuotes = quotes.filter((q) => q.clientId === client.id);
          const clientInvoices = invoices.filter((i) => i.clientId === client.id);

          return (
            <div
              key={client.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {client.name}
                    </h3>
                    {client.companyName && (
                      <p className="text-xs text-slate-500 font-medium">
                        {client.companyName}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {client.sector}
                  </span>
                </div>

                {/* Contact items */}
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{client.address}, {client.postalCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${client.phone}`} className="hover:text-emerald-600 font-medium">
                      {client.phone}
                    </a>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${client.email}`} className="hover:text-emerald-600 truncate">
                        {client.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Badges / Property notes */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {client.gateCode && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      <Key className="w-3 h-3 text-amber-600" />
                      {client.gateCode}
                    </span>
                  )}
                  {client.hasDogs && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      {lang === 'fr' ? 'Chien' : 'Dog'}
                    </span>
                  )}
                  {client.lawnSizeSqFt ? (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {client.lawnSizeSqFt.toLocaleString()} pi²
                    </span>
                  ) : null}
                </div>

                {/* History summary numbers */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg">
                    <span className="font-black text-slate-800 dark:text-white block">{clientJobs.length}</span>
                    <span className="text-[10px] text-slate-500">{t.clients.jobsCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg">
                    <span className="font-black text-slate-800 dark:text-white block">{clientQuotes.length}</span>
                    <span className="text-[10px] text-slate-500">{t.clients.quotesCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg">
                    <span className="font-black text-slate-800 dark:text-white block">{clientInvoices.length}</span>
                    <span className="text-[10px] text-slate-500">{t.clients.invoicesCount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClientDetails(client)}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
                >
                  {t.clients.viewDetails} →
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition"
                    title={t.clients.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t.clients.confirmDelete)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg text-rose-600 transition"
                    title={t.clients.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingClient ? t.clients.form.titleEdit : t.clients.form.titleNew}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marc-André Tremblay"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(450) 555-0199"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.address} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="428 Rue Saint-Charles Ouest"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.sector}
                  </label>
                  <select
                    value={formData.sector || 'Longueuil'}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value as Sector })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    {southShoreSectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.postalCode}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="J4H 1G3"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.gateCode}
                  </label>
                  <input
                    type="text"
                    value={formData.gateCode || ''}
                    onChange={(e) => setFormData({ ...formData, gateCode: e.target.value })}
                    placeholder="Ex: 4829# ou Loquet haut"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.lawnSizeSqFt}
                  </label>
                  <input
                    type="number"
                    value={formData.lawnSizeSqFt || ''}
                    onChange={(e) => setFormData({ ...formData, lawnSizeSqFt: Number(e.target.value) })}
                    placeholder="4500"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.hasDogs || false}
                      onChange={(e) => setFormData({ ...formData, hasDogs: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>{t.clients.form.hasDogs}</span>
                  </label>
                  {formData.hasDogs && (
                    <input
                      type="text"
                      value={formData.dogNotes || ''}
                      onChange={(e) => setFormData({ ...formData, dogNotes: e.target.value })}
                      placeholder="Nom du chien, tempérament..."
                      className="mt-2 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.clients.form.generalNotes}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Instructions terrain, arroseurs automatiques..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
                >
                  {t.clients.form.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  {t.clients.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Details Drawer / Modal */}
      {selectedClientDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedClientDetails.name}
                </h2>
                <p className="text-xs text-slate-500">
                  📍 {selectedClientDetails.address}, {selectedClientDetails.sector} • {selectedClientDetails.postalCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedClientDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={`tel:${selectedClientDetails.phone}`}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {selectedClientDetails.phone}
              </a>
              {selectedClientDetails.email && (
                <a
                  href={`mailto:${selectedClientDetails.email}`}
                  className="px-3 py-1.5 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold rounded-lg border border-blue-200 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {selectedClientDetails.email}
                </a>
              )}
            </div>

            {/* Property specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <div>
                <span className="text-slate-500 block">{t.clients.gateCode}</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedClientDetails.gateCode || 'Accès libre'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{t.clients.lawnSize}</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedClientDetails.lawnSizeSqFt?.toLocaleString() || 'N/A'} pi²
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{t.clients.hasDogs}</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedClientDetails.hasDogs ? `🐕 Oui - ${selectedClientDetails.dogNotes || ''}` : 'Non'}
                </span>
              </div>
            </div>

            {selectedClientDetails.notes && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl text-xs border border-amber-200 dark:border-amber-800">
                <span className="font-bold">Instructions: </span>
                {selectedClientDetails.notes}
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedClientDetails(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
