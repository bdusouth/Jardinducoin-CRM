'use client';

import {
  Client,
  Job,
  Quote,
  Invoice,
  ServiceCatalogItem,
  CompanySettings,
  Language,
} from '@/types';
import {
  initialClients,
  initialJobs,
  initialQuotes,
  initialInvoices,
  serviceCatalog,
  initialCompanySettings,
} from './mockData';

const STORAGE_KEYS = {
  CLIENTS: 'jardinducoin_clients_v1',
  JOBS: 'jardinducoin_jobs_v1',
  QUOTES: 'jardinducoin_quotes_v1',
  INVOICES: 'jardinducoin_invoices_v1',
  SERVICES: 'jardinducoin_services_v1',
  SETTINGS: 'jardinducoin_settings_v1',
  LANGUAGE: 'jardinducoin_lang_v1',
};

export const getStoredClients = (): Client[] => {
  if (typeof window === 'undefined') return initialClients;
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(initialClients));
    return initialClients;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialClients;
  }
};

export const saveClients = (clients: Client[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const getStoredJobs = (): Job[] => {
  if (typeof window === 'undefined') return initialJobs;
  const data = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initialJobs));
    return initialJobs;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialJobs;
  }
};

export const saveJobs = (jobs: Job[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const getStoredQuotes = (): Quote[] => {
  if (typeof window === 'undefined') return initialQuotes;
  const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(initialQuotes));
    return initialQuotes;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialQuotes;
  }
};

export const saveQuotes = (quotes: Quote[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
};

export const getStoredInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') return initialInvoices;
  const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(initialInvoices));
    return initialInvoices;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialInvoices;
  }
};

export const saveInvoices = (invoices: Invoice[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const getStoredServices = (): ServiceCatalogItem[] => {
  if (typeof window === 'undefined') return serviceCatalog;
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(serviceCatalog));
    return serviceCatalog;
  }
  try {
    return JSON.parse(data);
  } catch {
    return serviceCatalog;
  }
};

export const saveServices = (services: ServiceCatalogItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const getStoredSettings = (): CompanySettings => {
  if (typeof window === 'undefined') return initialCompanySettings;
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialCompanySettings));
    return initialCompanySettings;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialCompanySettings;
  }
};

export const saveSettings = (settings: CompanySettings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'fr';
  const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
  return lang === 'en' ? 'en' : 'fr';
};

export const saveLanguage = (lang: Language) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
};

export const exportAllDataAsJson = (): string => {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    clients: getStoredClients(),
    jobs: getStoredJobs(),
    quotes: getStoredQuotes(),
    invoices: getStoredInvoices(),
    services: getStoredServices(),
    settings: getStoredSettings(),
  };
  return JSON.stringify(payload, null, 2);
};

export const importDataFromJson = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.clients) saveClients(data.clients);
    if (data.jobs) saveJobs(data.jobs);
    if (data.quotes) saveQuotes(data.quotes);
    if (data.invoices) saveInvoices(data.invoices);
    if (data.services) saveServices(data.services);
    if (data.settings) saveSettings(data.settings);
    return true;
  } catch (err) {
    console.error('Failed to import JSON data:', err);
    return false;
  }
};

export const resetAllDataToDemo = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(initialClients));
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initialJobs));
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(initialQuotes));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(initialInvoices));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(serviceCatalog));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialCompanySettings));
};

export const calculateTaxes = (subtotal: number, applyTaxes: boolean) => {
  if (!applyTaxes) {
    return {
      subtotal,
      tps: 0,
      tvq: 0,
      total: subtotal,
    };
  }
  const tps = Math.round(subtotal * 0.05 * 100) / 100;
  const tvq = Math.round(subtotal * 0.09975 * 100) / 100;
  const total = Math.round((subtotal + tps + tvq) * 100) / 100;
  return { subtotal, tps, tvq, total };
};
