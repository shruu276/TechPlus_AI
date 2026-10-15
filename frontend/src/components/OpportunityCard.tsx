import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  GraduationCap, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  Building2, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Opportunity } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { validateRegistrationUrl, openExternalUrl } from '../utils/urlValidator';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (op: Opportunity) => void;
  onToggleSave: (op: Opportunity) => void;
  onTrackRegistration?: (opId: number) => void;
  onToggleMarkRegistered?: (opId: number) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  onToggleSave,
  onTrackRegistration,
  onToggleMarkRegistered
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const regUrlStatus = validateRegistrationUrl(opportunity.registration_url);
  const websiteUrlStatus = validateRegistrationUrl(opportunity.official_website_url);
  const isClosed = opportunity.registration_status === 'CLOSED' || opportunity.urgency_rank === 5;

  const matchColor = opportunity.match_score >= 90 
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : opportunity.match_score >= 75
    ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    : 'text-blue-400 bg-blue-500/10 border-blue-500/30';

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isClosed) {
      alert("Registration for this opportunity has officially closed.");
      return;
    }

    if (regUrlStatus === 'valid' && opportunity.registration_url) {
      // Securely open in a new tab without navigating away from TechPulse
      openExternalUrl(opportunity.registration_url);
      
      // Track registration click locally
      if (onTrackRegistration) {
        onTrackRegistration(opportunity.id);
      }

      setToastMessage("✅ Registration page opened in a new tab. Complete your registration on the official website.");
      setTimeout(() => setToastMessage(null), 5000);
    } else if (websiteUrlStatus === 'valid' && opportunity.official_website_url) {
      openExternalUrl(opportunity.official_website_url);
    }
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (opportunity.official_website_url) {
      openExternalUrl(opportunity.official_website_url);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group border border-slate-800 hover:border-blue-500/50">
      {/* Toast Notification overlay when registration is opened */}
      {toastMessage && (
        <div className="absolute -top-12 left-0 right-0 z-30 p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-200 text-xs shadow-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold">{toastMessage}</span>
          </div>
          {onToggleMarkRegistered && !opportunity.is_user_registered && (
            <button
              onClick={() => {
                onToggleMarkRegistered(opportunity.id);
                setToastMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shrink-0"
            >
              Mark Registered
            </button>
          )}
        </div>
      )}

      {/* Top row: tags, data mode badge, bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/20">
              {opportunity.event_type}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {opportunity.mode}
            </span>

            {/* Live Mode vs Demo Mode Indicator (Section 10) */}
            {opportunity.data_mode === 'live' ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>🟢 Live Opportunity</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                🧪 Demo Data
              </span>
            )}

            {opportunity.is_user_registered && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                <span>Registered</span>
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleSave(opportunity)}
            title={opportunity.is_saved ? "Remove bookmark" : "Save opportunity"}
            className={`p-2 rounded-xl transition-all ${
              opportunity.is_saved
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${opportunity.is_saved ? "fill-amber-400" : ""}`} />
          </button>
        </div>

        {/* Title & Organizer */}
        <h3 
          onClick={() => onViewDetails(opportunity)}
          className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {opportunity.title}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5 mb-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{opportunity.organizer}</span>
        </p>

        {/* Section 5: Official Source Badge */}
        <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-400 bg-navy-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Source: <strong className="text-slate-200">{opportunity.source_name}</strong></span>
          {opportunity.source_verified && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* AI Match Score Banner */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-xl border mb-3 ${matchColor}`}>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">AI Match Score:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold">{opportunity.match_score}%</span>
            <span className="text-[11px] font-medium opacity-90">{opportunity.verdict}</span>
          </div>
        </div>

        {/* Quick event meta info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-navy-900/60 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{opportunity.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{opportunity.eligibility.split('(')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold shrink-0">₹</span>
            <span className="font-semibold text-emerald-400">{opportunity.fee_display}</span>
          </div>
        </div>
      </div>

      {/* Bottom row: Urgency badge & Action buttons */}
      <div>
        <div className="mb-3">
          <UrgencyBadge 
            badgeLabel={opportunity.urgency_badge} 
            urgencyText={opportunity.urgency_text} 
            urgencyRank={opportunity.urgency_rank}
          />
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(opportunity)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors text-center"
            >
              View Details
            </button>

            {/* Registration Action Buttons (Sections 2, 7, 8, 16) */}
            {isClosed ? (
              <div className="flex-1 flex gap-1">
                <span className="flex-1 py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-500 text-center flex items-center justify-center gap-1">
                  <XCircle className="w-3 h-3 text-slate-500" />
                  <span>Closed</span>
                </span>
                {websiteUrlStatus === 'valid' && (
                  <button
                    onClick={handleWebsiteClick}
                    title="Visit official website"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : regUrlStatus === 'valid' ? (
              <button
                onClick={handleRegisterClick}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30"
              >
                <span>Register Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : websiteUrlStatus === 'valid' ? (
              <button
                onClick={handleWebsiteClick}
                className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                title="Registration link unavailable; view official website"
              >
                <span>Official Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ) : (
              <span className="flex-1 py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3 text-slate-600" />
                <span>Link Unavailable</span>
              </span>
            )}
          </div>

          {/* Optional Mark as Registered toggle (Section 19) */}
          {onToggleMarkRegistered && !isClosed && (
            <div className="flex items-center justify-end">
              <button
                onClick={() => onToggleMarkRegistered(opportunity.id)}
                className={`text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                  opportunity.is_user_registered
                    ? 'text-cyan-400 hover:text-cyan-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{opportunity.is_user_registered ? 'Registered (Click to undo)' : 'Mark as Registered'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
