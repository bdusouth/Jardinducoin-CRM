'use client';

import React from 'react';
import { Quote, Invoice, CompanySettings, Language } from '@/types';
import { translations } from '@/lib/translations';
import { Printer, X, Download, Sprout } from 'lucide-react';

interface PrintDocumentModalProps {
  lang: Language;
  document: Quote | Invoice | null;
  type: 'quote' | 'invoice';
  settings: CompanySettings;
  onClose: () => void;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  lang,
  document,
  type,
  settings,
  onClose,
}) => {
  if (!document) return null;
  const t = translations[lang];

  const isQuote = type === 'quote';
  const docNumber = isQuote
    ? (document as Quote).quoteNumber
    : (document as Invoice).invoiceNumber;

  const docDate = isQuote ? (document as Quote).date : (document as Invoice).issueDate;
  const secondaryDate = isQuote
    ? (document as Quote).validUntil
    : (document as Invoice).dueDate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 my-8 print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none">
        {/* Top Screen Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-mono">
              {isQuote ? 'Devis / Estimate' : 'Facture / Invoice'}
            </span>
            <span className="text-sm font-black text-slate-700">{docNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Imprimer / Enregistrer PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 font-sans text-xs text-slate-800">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-600 p-2 rounded-lg text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-black text-emerald-950 tracking-tight">
                  {settings.companyName}
                </h1>
              </div>
              <p className="text-slate-500 font-medium text-[11px] mt-1">{settings.slogan}</p>
              <p className="text-slate-600 mt-1">{settings.address}</p>
              <p className="text-slate-600">{settings.phone} • {settings.email}</p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {isQuote ? 'SOUMISSION' : 'FACTURE'}
              </h2>
              <p className="font-mono font-bold text-emerald-700 text-sm mt-0.5">{docNumber}</p>
              <div className="mt-2 text-slate-500 space-y-0.5 text-[11px]">
                <p>Date: <strong className="text-slate-700">{docDate}</strong></p>
                <p>
                  {isQuote ? 'Valide jusqu’au' : 'Date d’échéance'}:{' '}
                  <strong className="text-slate-700">{secondaryDate}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Client & Tax Numbers Block */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {lang === 'fr' ? 'FACTURÉ À / CLIENT' : 'BILLED TO'}
              </span>
              <p className="text-sm font-black text-slate-900 mt-1">{document.clientName}</p>
              <p className="text-slate-600">{document.address}</p>
              <p className="text-slate-600">{document.sector}, QC</p>
              <p className="text-slate-600">{document.clientPhone}</p>
              {document.clientEmail && <p className="text-slate-600">{document.clientEmail}</p>}
            </div>

            <div className="text-right space-y-1 text-[11px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {lang === 'fr' ? 'NUMÉROS OFFICIELS (QC)' : 'BUSINESS REGISTRATIONS'}
              </span>
              {settings.neq && <p className="text-slate-600">NEQ: <strong className="text-slate-800 font-mono">{settings.neq}</strong></p>}
              {settings.tpsNumber && <p className="text-slate-600">TPS / GST: <strong className="text-slate-800 font-mono">{settings.tpsNumber}</strong></p>}
              {settings.tvqNumber && <p className="text-slate-600">TVQ / QST: <strong className="text-slate-800 font-mono">{settings.tvqNumber}</strong></p>}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3">Description du service</th>
                  <th className="p-3 text-center w-20">Qté</th>
                  <th className="p-3 text-right w-28">Prix unitaire</th>
                  <th className="p-3 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {document.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-3 font-medium text-slate-900">{it.description}</td>
                    <td className="p-3 text-center text-slate-600">{it.quantity} {it.unit}</td>
                    <td className="p-3 text-right text-slate-600">${it.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">${it.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Taxes Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total:</span>
                <span className="font-bold">${document.subtotal.toFixed(2)}</span>
              </div>
              {document.applyTaxes && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>TPS (5.000%):</span>
                    <span>${document.tps.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVQ (9.975%):</span>
                    <span>${document.tvq.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total:</span>
                <span className="text-emerald-700">${document.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions (Virement Interac) */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1 text-xs">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>💳 Instructions de Virement Interac:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900 pt-1">
              <div>
                <span className="text-emerald-700 block">Courriel / Email:</span>
                <strong>{settings.interacEmail}</strong>
              </div>
              <div>
                <span className="text-emerald-700 block">Question de sécurité:</span>
                <strong>{settings.interacQuestion}</strong>
              </div>
              <div>
                <span className="text-emerald-700 block">Réponse:</span>
                <strong>{settings.interacAnswer}</strong>
              </div>
            </div>
          </div>

          {/* Notes and footer */}
          {document.notes && (
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px]">
              <strong>Conditions & Notes:</strong> {document.notes}
            </div>
          )}

          <div className="text-center pt-4 border-t border-slate-100 text-slate-400 text-[10px]">
            Merci d'encourager votre entreprise locale de la Rive-Sud ! • {settings.website}
          </div>
        </div>
      </div>
    </div>
  );
};
