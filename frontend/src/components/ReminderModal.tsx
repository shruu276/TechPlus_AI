import React, { useState } from 'react';
import { Bell, X, Check, Clock } from 'lucide-react';
import { Opportunity } from '../types';

interface ReminderModalProps {
  opportunity: Opportunity | null;
  currentDays?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (opportunityId: number, daysBefore: number) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  opportunity,
  currentDays = 3,
  isOpen,
  onClose,
  onSaveReminder
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(currentDays);

  if (!isOpen || !opportunity) return null;

  const options = [
    { days: 7, label: "7 Days Before Deadline", desc: "Recommended for hackathons and team competitions" },
    { days: 3, label: "3 Days Before Deadline", desc: "Standard reminder for workshops and webinars" },
    { days: 1, label: "1 Day Before Deadline", desc: "Last-chance urgent alert for quick registration" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Set Opportunity Reminder</h3>
            <p className="text-xs text-slate-400">In-App Notification Alert</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 bg-navy-900/60 p-3 rounded-xl border border-slate-800">
          <strong className="text-cyan-300">{opportunity.title}</strong>
          <br />
          <span className="text-[11px] text-slate-400">Deadline: {opportunity.registration_deadline.replace('T', ' ')}</span>
        </p>

        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Choose Alert Timing
        </label>

        <div className="space-y-2 mb-6">
          {options.map((opt) => (
            <div
              key={opt.days}
              onClick={() => setSelectedDays(opt.days)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedDays === opt.days
                  ? "bg-blue-600/20 border-cyan-400 text-white"
                  : "bg-navy-900/40 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className={`w-4 h-4 ${selectedDays === opt.days ? "text-cyan-400" : "text-slate-500"}`} />
                <div>
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[11px] text-slate-400">{opt.desc}</p>
                </div>
              </div>
              {selectedDays === opt.days && (
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveReminder(opportunity.id, selectedDays);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-900/30"
          >
            Confirm Reminder
          </button>
        </div>
      </div>
    </div>
  );
};
