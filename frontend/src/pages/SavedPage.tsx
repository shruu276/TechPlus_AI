import React from 'react';
import { Bookmark, Clock, ExternalLink, Trash2, Bell, AlertCircle, Compass } from 'lucide-react';
import { SavedOpportunity, Opportunity } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { validateRegistrationUrl, openExternalUrl } from '../utils/urlValidator';

interface SavedPageProps {
  savedList: SavedOpportunity[];
  onViewDetails: (op: Opportunity) => void;
  onUnsave: (opportunityId: number) => void;
  onUpdateReminderDays: (opportunityId: number, days: number) => void;
  onNavigate: (view: string) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  savedList,
  onViewDetails,
  onUnsave,
  onUpdateReminderDays,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-navy-900 to-navy-900">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Bookmark className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">⭐ Saved Opportunities & Reminders</h1>
            <p className="text-xs text-amber-200">
              Manage bookmarked events and configure automated deadline notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {savedList.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Opportunities Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon on any opportunity card to save it here and receive in-app deadline reminder alerts.
          </p>
          <button
            onClick={() => onNavigate('discover')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Opportunities</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedList.map((item) => {
            const op = item.opportunity;
            if (!op) return null;

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <UrgencyBadge
                      badgeLabel={op.urgency_badge}
                      urgencyText={op.urgency_text}
                      urgencyRank={op.urgency_rank}
                      compact={true}
                    />
                    <span className="text-xs text-slate-400">
                      {op.event_type} • {op.location} ({op.mode})
                    </span>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {op.match_score}% Match
                    </span>
                  </div>

                  <h3
                    onClick={() => onViewDetails(op)}
                    className="text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {op.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Organized by <strong className="text-slate-300">{op.organizer}</strong> • Date: {op.date}
                  </p>

                  {/* Reminder threshold configuration */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 bg-navy-950/60 p-2.5 rounded-xl border border-slate-800 w-fit">
                    <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-slate-300 font-semibold">Notify me:</span>
                    <select
                      value={item.reminder_days_before}
                      onChange={(e) => onUpdateReminderDays(op.id, Number(e.target.value))}
                      className="bg-navy-900 border border-slate-700 text-cyan-300 text-[11px] font-bold py-1 px-2 rounded-lg focus:outline-none focus:border-cyan-400"
                    >
                      <option value={7}>7 Days Before Deadline</option>
                      <option value={3}>3 Days Before Deadline</option>
                      <option value={1}>1 Day Before (Urgent)</option>
                    </select>
                    <span className="text-[10px] text-emerald-400">✓ Reminder Active</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => onViewDetails(op)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Details
                  </button>
                  {op.registration_status === 'CLOSED' || op.urgency_rank === 5 ? (
                    <span className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-500">
                      Closed
                    </span>
                  ) : validateRegistrationUrl(op.registration_url) === 'valid' ? (
                    <button
                      onClick={() => openExternalUrl(op.registration_url!)}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/30"
                    >
                      <span>Register</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : validateRegistrationUrl(op.official_website_url) === 'valid' ? (
                    <button
                      onClick={() => openExternalUrl(op.official_website_url!)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <span>Official Site</span>
                    </button>
                  ) : (
                    <span className="py-2 px-3 rounded-xl bg-slate-900 text-xs text-slate-500">
                      Link N/A
                    </span>
                  )}
                  <button
                    onClick={() => onUnsave(op.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
