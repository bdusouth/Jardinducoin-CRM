'use client';

import React, { useState } from 'react';
import { Job, Language, Sector } from '@/types';
import { translations } from '@/lib/translations';
import {
  Truck,
  Navigation,
  Phone,
  MessageSquare,
  Key,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FieldModeViewProps {
  lang: Language;
  jobs: Job[];
  onCompleteJob: (jobId: string) => void;
  onNavigate: (view: string) => void;
}

export const FieldModeView: React.FC<FieldModeViewProps> = ({
  lang,
  jobs,
  onCompleteJob,
}) => {
  const t = translations[lang];
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Filter jobs by date and sector
  const filteredJobs = jobs.filter((job) => {
    const matchesDate = job.date === selectedDate;
    const matchesSector = selectedSector === 'all' || job.sector === selectedSector;
    return matchesDate && matchesSector;
  });

  const completedCount = filteredJobs.filter((j) => j.status === 'completed').length;

  const handleDateShift = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleMarkComplete = (jobId: string) => {
    onCompleteJob(jobId);
    setJustCompletedId(jobId);
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      setJustCompletedId(null);
    }, 2500);
  };

  const getGoogleMapsUrl = (address: string, sector: string) => {
    const full = encodeURIComponent(`${address}, ${sector}, QC, Canada`);
    return `https://www.google.com/maps/search/?api=1&query=${full}`;
  };

  const sectorsInUse: Sector[] = Array.from(new Set(jobs.map((j) => j.sector)));

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-5 sm:p-6 rounded-2xl text-white shadow-xl border border-emerald-800/60">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-lime-500 text-emerald-950 rounded-xl shadow-md font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.fieldMode.title}
              </h1>
              <p className="text-xs text-emerald-200/80">
                {t.fieldMode.subtitle}
              </p>
            </div>
          </div>

          <div className="text-right self-end sm:self-auto bg-emerald-900/60 px-3.5 py-1.5 rounded-xl border border-emerald-700/60">
            <div className="text-[10px] uppercase font-bold text-lime-300">
              {lang === 'fr' ? 'Progression' : 'Progress'}
            </div>
            <div className="text-sm font-black text-white">
              {completedCount} / {filteredJobs.length} {lang === 'fr' ? 'faits' : 'done'}
            </div>
          </div>
        </div>

        {/* Date Navigator Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDateShift(-1)}
              className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-lg text-emerald-100 border border-emerald-700 transition"
              title="Jour précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 bg-emerald-900/90 px-3 py-2 rounded-xl border border-emerald-700 text-sm font-bold">
              <Calendar className="w-4 h-4 text-lime-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleDateShift(1)}
              className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-lg text-emerald-100 border border-emerald-700 transition"
              title="Jour suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-xs font-bold rounded-lg border border-emerald-600 transition"
            >
              {t.fieldMode.today}
            </button>
          </div>

          {/* Sector Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-lime-400" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-emerald-900/90 text-white text-xs font-bold py-2 px-3 rounded-xl border border-emerald-700 outline-none"
            >
              <option value="all">{t.fieldMode.allSectors}</option>
              {sectorsInUse.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Route Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {t.fieldMode.noJobsScheduled}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'fr'
              ? 'Sélectionnez une autre date ou ajoutez un travail depuis le calendrier.'
              : 'Select another date or schedule a visit from the calendar.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job, idx) => {
            const isCompleted = job.status === 'completed';
            const serviceName =
              job.customServiceName ||
              t.services[job.serviceType] ||
              job.serviceType;
            const mapsUrl = getGoogleMapsUrl(job.address, job.sector);
            const isJustDone = justCompletedId === job.id;

            return (
              <div
                key={job.id}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Route Sequence Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {job.sector}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t.timeSlots[job.timeSlot]}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ${job.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Client Name & Address */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {job.clientName}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {serviceName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    📍 {job.address}, {job.sector}
                  </div>
                </div>

                {/* Warning & Instructions Badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.gateCode && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold">
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.fieldMode.gateCode}: {job.gateCode}</span>
                    </div>
                  )}

                  {job.hasDogs && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{t.fieldMode.dogWarning}</span>
                    </div>
                  )}
                </div>

                {/* Job notes for crew */}
                {job.notes && (
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      📝 {t.fieldMode.notesForCrew}:{' '}
                    </span>
                    {job.notes}
                  </div>
                )}

                {/* Field Action Buttons Bar */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  {/* Communication & Maps */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>GPS</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href={`tel:${job.clientPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t.fieldMode.callClient}</span>
                    </a>

                    <a
                      href={`sms:${job.clientPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                      <span>SMS</span>
                    </a>
                  </div>

                  {/* Complete Button */}
                  <div>
                    {isCompleted ? (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-extrabold border border-emerald-300 dark:border-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t.jobStatus.completed}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkComplete(job.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/30 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.fieldMode.markDone}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Just completed banner animation */}
                {isJustDone && (
                  <div className="absolute inset-0 bg-emerald-600/90 text-white flex items-center justify-center font-black text-base animate-in fade-in duration-200 backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 mr-2 animate-bounce" />
                    <span>{t.fieldMode.markedDoneSuccess}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
