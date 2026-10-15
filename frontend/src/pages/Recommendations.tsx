import React from 'react';
import { Target, Sparkles, CheckCircle2, Star, ExternalLink, Bookmark, Globe } from 'lucide-react';
import { Opportunity, UserProfile } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { validateRegistrationUrl, openExternalUrl } from '../utils/urlValidator';

interface RecommendationsProps {
  profile: UserProfile | null;
  recommendations: Opportunity[];
  onViewDetails: (op: Opportunity) => void;
  onToggleSave: (op: Opportunity) => void;
  onTrackRegistration?: (opId: number) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  profile,
  recommendations,
  onViewDetails,
  onToggleSave,
  onTrackRegistration
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-navy-900 via-indigo-950/50 to-navy-900">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">🎯 Personalized Recommendations</h1>
            <p className="text-xs text-slate-300">
              Ranked by AI match algorithm considering your technical interests, {profile?.branch} curriculum, location, and deadlines.
            </p>
          </div>
        </div>

        {/* Profile Affinity summary chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-indigo-500/20 text-xs">
          <span className="text-slate-400">Targeting:</span>
          {profile?.interests.map((int, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-cyan-300 border border-blue-500/30">
              {int}
            </span>
          ))}
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {profile?.year} {profile?.branch}
          </span>
        </div>
      </div>

      {/* Recommended List with Detailed "Why It Matches" Breakdown */}
      <div className="space-y-5">
        {recommendations.map((op, idx) => (
          <div
            key={op.id}
            className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row gap-6 relative group"
          >
            {/* Left: Score Badge & Rank */}
            <div className="lg:w-48 shrink-0 flex flex-col justify-between items-start lg:border-r lg:border-slate-800/80 lg:pr-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Recommendation #{idx + 1}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl lg:text-4xl font-black text-cyan-400">{op.match_score}%</span>
                  <span className="text-xs font-semibold text-slate-400">Match</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{op.verdict}</span>
                </div>
              </div>

              <div className="mt-4 lg:mt-0 w-full">
                <UrgencyBadge
                  badgeLabel={op.urgency_badge}
                  urgencyText={op.urgency_text}
                  urgencyRank={op.urgency_rank}
                  compact={true}
                />
              </div>
            </div>

            {/* Middle: Title, Meta, and "Why it matches you" */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    {op.event_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {op.mode}
                  </span>
                  <span className="text-xs text-slate-400">
                    📅 {op.date} • 📍 {op.location} • 💰 {op.fee_display}
                  </span>
                </div>

                <h3 
                  onClick={() => onViewDetails(op)}
                  className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {op.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Organized by <strong className="text-slate-300">{op.organizer}</strong>
                </p>

                {/* Why it matches */}
                <div className="mt-4 bg-navy-900/70 p-3.5 rounded-2xl border border-slate-800/80">
                  <p className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Why TechPulse Recommends This to You:</span>
                  </p>
                  <p className="text-xs text-slate-300 italic mb-2.5">
                    "{op.why_attend_explanation}"
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {op.reasons?.map((reason, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onViewDetails(op)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  View Details & Ratings
                </button>
                {op.registration_status === 'CLOSED' || op.urgency_rank === 5 ? (
                  <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-500">
                    Registration Closed
                  </span>
                ) : validateRegistrationUrl(op.registration_url) === 'valid' ? (
                  <button
                    onClick={() => {
                      openExternalUrl(op.registration_url!);
                      if (onTrackRegistration) onTrackRegistration(op.id);
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/30"
                  >
                    <span>Register Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : validateRegistrationUrl(op.official_website_url) === 'valid' ? (
                  <button
                    onClick={() => openExternalUrl(op.official_website_url!)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>Official Website</span>
                    <Globe className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-slate-900 text-xs text-slate-500">
                    Link Unavailable
                  </span>
                )}
                <button
                  onClick={() => onToggleSave(op)}
                  className={`p-2 rounded-xl border transition-all ${
                    op.is_saved
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-800/80 text-slate-400 hover:text-white border-slate-700"
                  }`}
                  title={op.is_saved ? "Saved" : "Save opportunity"}
                >
                  <Bookmark className={`w-4 h-4 ${op.is_saved ? "fill-amber-400" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
