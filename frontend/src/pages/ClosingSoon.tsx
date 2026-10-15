import React from 'react';
import { Clock, AlertTriangle, ExternalLink, Bookmark, Globe } from 'lucide-react';
import { Opportunity } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { validateRegistrationUrl, openExternalUrl } from '../utils/urlValidator';

interface ClosingSoonProps {
  closingSoon: Opportunity[];
  onViewDetails: (op: Opportunity) => void;
  onToggleSave: (op: Opportunity) => void;
  onTrackRegistration?: (opId: number) => void;
}

export const ClosingSoon: React.FC<ClosingSoonProps> = ({
  closingSoon,
  onViewDetails,
  onToggleSave,
  onTrackRegistration
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-navy-900 to-navy-900">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">⏰ Closing Soon — Deadline Intelligence Radar</h1>
            <p className="text-xs text-rose-200">
              Sorted strictly by deadline urgency. Never miss a registration window again!
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-rose-500/20 text-xs">
          <span className="text-slate-400 font-semibold">Tiers:</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950 border border-rose-500 text-rose-200">
            🔴 LAST CHANCE (&lt; 2 Days)
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 border border-amber-500 text-amber-200">
            🟠 URGENT (2–7 Days)
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-950 border border-yellow-500 text-yellow-200">
            🟡 CLOSING SOON (7–14 Days)
          </span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {closingSoon.map((op) => (
          <div
            key={op.id}
            className={`glass-card rounded-2xl p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              op.urgency_rank === 1
                ? "border-rose-500/60 bg-rose-950/20 hover:border-rose-400"
                : op.urgency_rank === 2
                ? "border-amber-500/50 bg-amber-950/15 hover:border-amber-400"
                : "border-slate-800 hover:border-yellow-500/40"
            }`}
          >
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
                  AI Match: {op.match_score}%
                </span>
              </div>

              <h3 
                onClick={() => onViewDetails(op)}
                className="text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {op.title}
              </h3>

              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>By <strong>{op.organizer}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-semibold">
                  Deadline: {op.registration_deadline.replace('T', ' ')}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-bold">{op.fee_display}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
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
                  onClick={() => {
                    openExternalUrl(op.registration_url!);
                    if (onTrackRegistration) onTrackRegistration(op.id);
                  }}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-md shadow-rose-900/30"
                >
                  <span>Register</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : validateRegistrationUrl(op.official_website_url) === 'valid' ? (
                <button
                  onClick={() => openExternalUrl(op.official_website_url!)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>Official Site</span>
                  <Globe className="w-3 h-3" />
                </button>
              ) : (
                <span className="py-2 px-3 rounded-xl bg-slate-900 text-xs text-slate-500">
                  Link N/A
                </span>
              )}
              <button
                onClick={() => onToggleSave(op)}
                className={`p-2 rounded-xl border transition-all ${
                  op.is_saved
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
                }`}
                title={op.is_saved ? "Saved" : "Save opportunity"}
              >
                <Bookmark className={`w-4 h-4 ${op.is_saved ? "fill-amber-400" : ""}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
