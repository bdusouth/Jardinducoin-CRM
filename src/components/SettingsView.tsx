'use client';

import React, { useState } from 'react';
import { CompanySettings, Language } from '@/types';
import { translations } from '@/lib/translations';
import {
  Settings,
  Building,
  FileCheck2,
  DollarSign,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Save,
  ShieldAlert,
} from 'lucide-react';
import {
  exportAllDataAsJson,
  importDataFromJson,
  resetAllDataToDemo,
} from '@/lib/storage';

interface SettingsViewProps {
  lang: Language;
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  onDataResetOrImported: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  settings,
  onSaveSettings,
  onDataResetOrImported,
}) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportJson = () => {
    const json = exportAllDataAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jardinducoin_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importDataFromJson(content);
      if (ok) {
        setImportStatus('success');
        onDataResetOrImported();
      } else {
        setImportStatus('error');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (confirm(lang === 'fr' ? 'Recharger toutes les données démo de la Rive-Sud ?' : 'Reload all South Shore demo data?')) {
      resetAllDataToDemo();
      onDataResetOrImported();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            <span>{t.settings.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.settings.subtitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building className="w-5 h-5 text-emerald-600" />
            <span>{t.settings.companyInfo}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.companyName}
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.slogan}
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.phone}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.address}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Quebec Tax Numbers & NEQ */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span>{t.settings.taxNumbers}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.neq}
              </label>
              <input
                type="text"
                value={formData.neq}
                onChange={(e) => setFormData({ ...formData, neq: e.target.value })}
                placeholder="1178945623"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.tps}
              </label>
              <input
                type="text"
                value={formData.tpsNumber}
                onChange={(e) => setFormData({ ...formData, tpsNumber: e.target.value })}
                placeholder="839201948 RT0001"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.tvq}
              </label>
              <input
                type="text"
                value={formData.tvqNumber}
                onChange={(e) => setFormData({ ...formData, tvqNumber: e.target.value })}
                placeholder="1209384756 TQ0001"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Interac e-Transfer Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>{t.settings.interacSettings}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.interacEmail}
              </label>
              <input
                type="email"
                value={formData.interacEmail}
                onChange={(e) => setFormData({ ...formData, interacEmail: e.target.value })}
                placeholder="paiement@jardinducoin.ca"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.interacQuestion}
              </label>
              <input
                type="text"
                value={formData.interacQuestion}
                onChange={(e) => setFormData({ ...formData, interacQuestion: e.target.value })}
                placeholder="Ex: Ville du service"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.settings.interacAnswer}
              </label>
              <input
                type="text"
                value={formData.interacAnswer}
                onChange={(e) => setFormData({ ...formData, interacAnswer: e.target.value })}
                placeholder="Brossard"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Save button banner */}
        <div className="flex items-center justify-between">
          <div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.settings.savedSuccess}</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t.settings.saveSettings}</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Restore section */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Download className="w-5 h-5 text-lime-400" />
          <span>{t.settings.dataManagement}</span>
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          {lang === 'fr'
            ? 'Vos données (clients, travaux, devis, factures) sont stockées en toute sécurité sur votre appareil. Téléchargez une sauvegarde JSON à tout moment pour la conserver ou la transférer.'
            : 'Your data (clients, jobs, quotes, invoices) is securely stored on your device. Download a JSON backup anytime for safekeeping or transfers.'}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t.settings.exportJson}</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-300" />
            <span>{t.settings.importJson}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl border border-rose-800/80 flex items-center gap-2 ml-auto"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{t.settings.resetDemo}</span>
          </button>
        </div>

        {importStatus === 'success' && (
          <div className="p-3 bg-emerald-900/60 border border-emerald-700 text-emerald-200 rounded-xl text-xs font-bold">
            ✓ Données importées avec succès !
          </div>
        )}
        {importStatus === 'error' && (
          <div className="p-3 bg-rose-900/60 border border-rose-700 text-rose-200 rounded-xl text-xs font-bold">
            ⚠ Fichier JSON invalide.
          </div>
        )}
      </div>
    </div>
  );
};
