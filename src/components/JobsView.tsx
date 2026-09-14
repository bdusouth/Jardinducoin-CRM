'use client';

import React, { useState } from 'react';
import { Job, Client, Language, Sector, ServiceType, TimeSlot, JobRecurrence, JobStatus } from '@/types';
import { translations } from '@/lib/translations';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar as CalIcon,
  AlertTriangle,
  Key,
  X,
  Repeat,
  DollarSign,
  Truck,
} from 'lucide-react';

interface JobsViewProps {
  lang: Language;
  jobs: Job[];
  clients: Client[];
  onSaveJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onCompleteJob: (jobId: string) => void;
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

const serviceTypes: ServiceType[] = [
  'lawn_mowing',
  'hedge_trimming',
  'spring_cleanup',
  'fall_cleanup',
  'aeration_seeding',
  'fertilization',
  'mulch_soil',
  'landscaping',
  'snow_removal',
  'other',
];

export const JobsView: React.FC<JobsViewProps> = ({
  lang,
  jobs,
  clients,
  onSaveJob,
  onDeleteJob,
  onCompleteJob,
  isCreateOpen = false,
  onCloseCreate,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [showModal, setShowModal] = useState(isCreateOpen);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Job>>({
    clientId: clients[0]?.id || '',
    serviceType: 'lawn_mowing',
    customServiceName: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'morning',
    status: 'pending',
    priority: 'normal',
    recurrence: 'weekly',
    price: 45.0,
    notes: '',
  });

  const handleOpenNew = () => {
    setEditingJob(null);
    setFormData({
      clientId: clients[0]?.id || '',
      serviceType: 'lawn_mowing',
      customServiceName: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'morning',
      status: 'pending',
      priority: 'normal',
      recurrence: 'weekly',
      price: 45.0,
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({ ...job });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) return;

    const newOrUpdated: Job = {
      id: editingJob ? editingJob.id : `job-${Date.now().toString().slice(-6)}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      address: client.address,
      sector: client.sector,
      serviceType: (formData.serviceType as ServiceType) || 'lawn_mowing',
      customServiceName: formData.customServiceName,
      date: formData.date || new Date().toISOString().split('T')[0],
      timeSlot: (formData.timeSlot as TimeSlot) || 'morning',
      status: (formData.status as JobStatus) || 'pending',
      priority: formData.priority || 'normal',
      recurrence: (formData.recurrence as JobRecurrence) || 'one_off',
      price: Number(formData.price) || 0,
      gateCode: client.gateCode,
      hasDogs: client.hasDogs,
      notes: formData.notes || '',
    };

    onSaveJob(newOrUpdated);
    setShowModal(false);
    if (onCloseCreate) onCloseCreate();
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      job.clientName.toLowerCase().includes(q) ||
      job.address.toLowerCase().includes(q) ||
      job.sector.toLowerCase().includes(q) ||
      (job.customServiceName && job.customServiceName.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    const matchesSector = selectedSector === 'all' || job.sector === selectedSector;
    return matchesQuery && matchesStatus && matchesSector;
  });

  // Sort by date ascending
  filteredJobs.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-600" />
            <span>{t.jobs.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.jobs.subtitle} • <span className="font-bold text-emerald-600">{filteredJobs.length} {lang === 'fr' ? 'visites programmées' : 'scheduled visits'}</span>
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.jobs.addNew}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'fr' ? 'Rechercher un client, rue ou ville...' : 'Search client, address or city...'}
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
            <option value="pending">{t.jobStatus.pending}</option>
            <option value="in_progress">{t.jobStatus.in_progress}</option>
            <option value="completed">{t.jobStatus.completed}</option>
          </select>
        </div>

        <div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'fr' ? 'Tous les secteurs Rive-Sud' : 'All South Shore sectors'}</option>
            <option value="Longueuil">Longueuil</option>
            <option value="Brossard">Brossard</option>
            <option value="Boucherville">Boucherville</option>
            <option value="Saint-Lambert">Saint-Lambert</option>
            <option value="Candiac">Candiac</option>
            <option value="La Prairie">La Prairie</option>
            <option value="Saint-Bruno">Saint-Bruno</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map((job) => {
          const isCompleted = job.status === 'completed';
          const serviceLabel =
            job.customServiceName ||
            t.services[job.serviceType] ||
            job.serviceType;

          return (
            <div
              key={job.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400'
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    {job.clientName}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {job.sector}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Repeat className="w-3 h-3 text-slate-400" />
                    {t.recurrence[job.recurrence]}
                  </span>
                </div>

                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {serviceLabel}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{job.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {t.timeSlots[job.timeSlot]}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.address}
                  </span>
                </div>

                {job.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-slate-700/60 max-w-xl">
                    📌 {job.notes}
                  </p>
                )}
              </div>

              {/* Right Price & Actions */}
              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ${job.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.jobStatus.completed}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onCompleteJob(job.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.fieldMode.markDone}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(job)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
                    title={t.common.edit}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(lang === 'fr' ? 'Supprimer ce travail ?' : 'Delete this job?')) {
                        onDeleteJob(job.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg text-xs"
                    title={t.common.delete}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingJob ? t.jobs.form.titleEdit : t.jobs.form.titleNew}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.jobs.form.selectClient} *
                </label>
                <select
                  required
                  value={formData.clientId || ''}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.address} ({c.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.jobs.form.serviceType}
                  </label>
                  <select
                    value={formData.serviceType || 'lawn_mowing'}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {t.services[type]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.jobs.form.price}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.jobs.form.date}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.jobs.form.timeSlot}
                  </label>
                  <select
                    value={formData.timeSlot || 'morning'}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as TimeSlot })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="morning">{t.timeSlots.morning}</option>
                    <option value="afternoon">{t.timeSlots.afternoon}</option>
                    <option value="flexible">{t.timeSlots.flexible}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.jobs.form.recurrence}
                  </label>
                  <select
                    value={formData.recurrence || 'one_off'}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as JobRecurrence })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="one_off">{t.recurrence.one_off}</option>
                    <option value="weekly">{t.recurrence.weekly}</option>
                    <option value="biweekly">{t.recurrence.biweekly}</option>
                    <option value="monthly">{t.recurrence.monthly}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.jobs.form.priority}
                  </label>
                  <select
                    value={formData.priority || 'normal'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'normal' | 'high' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="normal">{t.jobs.form.normalPriority}</option>
                    <option value="high">{t.jobs.form.highPriority}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.jobs.form.notes}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Instructions spécifiques..."
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
                  {t.jobs.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
