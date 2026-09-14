export type Language = 'fr' | 'en';

export type Sector =
  | 'Longueuil'
  | 'Brossard'
  | 'Boucherville'
  | 'Saint-Lambert'
  | 'Candiac'
  | 'La Prairie'
  | 'Saint-Bruno'
  | 'Saint-Hubert'
  | 'Greenfield Park'
  | 'Varennes'
  | 'Sainte-Julie'
  | 'Autre / Other';

export type ServiceType =
  | 'lawn_mowing'
  | 'hedge_trimming'
  | 'spring_cleanup'
  | 'fall_cleanup'
  | 'aeration_seeding'
  | 'fertilization'
  | 'mulch_soil'
  | 'landscaping'
  | 'snow_removal'
  | 'other';

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type JobRecurrence = 'one_off' | 'weekly' | 'biweekly' | 'monthly';
export type TimeSlot = 'morning' | 'afternoon' | 'flexible';

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  address: string;
  sector: Sector;
  postalCode: string;
  gateCode?: string;
  hasDogs?: boolean;
  dogNotes?: string;
  lawnSizeSqFt?: number;
  notes?: string;
  tags?: string[];
  status: 'active' | 'lead' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  address: string;
  sector: Sector;
  serviceType: ServiceType;
  customServiceName?: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  status: JobStatus;
  priority: 'normal' | 'high';
  recurrence: JobRecurrence;
  price: number;
  notes?: string;
  gateCode?: string;
  hasDogs?: boolean;
  completedAt?: string;
  assignedCrew?: string;
}

export interface LineItem {
  id: string;
  description: string;
  serviceType?: ServiceType;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'invoiced';

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  sector: Sector;
  date: string;
  validUntil: string;
  items: LineItem[];
  subtotal: number;
  tps: number;
  tvq: number;
  total: number;
  applyTaxes: boolean;
  notes?: string;
  status: QuoteStatus;
  createdAt: string;
  acceptedAt?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  sector: Sector;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  tps: number;
  tvq: number;
  total: number;
  applyTaxes: boolean;
  status: InvoiceStatus;
  paidAmount?: number;
  paymentMethod?: 'interac' | 'cash' | 'check' | 'credit_card';
  paymentDate?: string;
  notes?: string;
  createdAt: string;
}

export interface ServiceCatalogItem {
  id: string;
  type: ServiceType;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  defaultUnit: string;
  defaultUnitPrice: number;
}

export interface CompanySettings {
  companyName: string;
  slogan: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  neq: string; // Numéro d'entreprise du Québec
  tpsNumber: string;
  tvqNumber: string;
  interacEmail: string;
  interacQuestion: string;
  interacAnswer: string;
  defaultPaymentTermsDays: number;
  taxRateTPS: number; // 0.05
  taxRateTVQ: number; // 0.09975
  defaultLanguage: Language;
}
