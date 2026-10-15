import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Star, 
  Award, 
  Layers, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  XCircle,
  Clock
} from 'lucide-react';
import { Opportunity } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { validateRegistrationUrl, openExternalUrl } from '../utils/urlValidator';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onToggleSave: (op: Opportunity) => void;
  onTrackRegistration?: (opId: number) => void;
  onToggleMarkRegistered?: (opId: number) => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  onClose,
  onToggleSave,
  onTrackRegistration,
  onToggleMarkRegistered
}) => {
  if (!opportunity) return null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const regUrlStatus = validateRegistrationUrl(opportunity.registration_url);
  const websiteUrlStatus = validateRegistrationUrl(opportunity.official_website_url);
  const isClosed = opportunity.registration_status === 'CLOSED' || opportunity.urgency_rank === 5;

  const handleRegisterClick = () => {
    if (isClosed) {
      alert("Registration for this opportunity has officially closed.");
      return;
    }

    if (regUrlStatus === 'valid' && opportunity.registration_url) {
      openExternalUrl(opportunity.registration_url);
      if (onTrackRegistration) {
        onTrackRegistration(opportunity.id);
      }
      setToastMessage("✅ Opened official registration page in a new tab. Please complete your registration on their portal.");
    } else if (websiteUrlStatus === 'valid' && opportunity.official_website_url) {
      openExternalUrl(opportunity.official_website_url);
    }
  };

  const handleWebsiteClick = () => {
    if (opportunity.official_website_url) {
      openExternalUrl(opportunity.official_website_url);
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= count ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/80 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            {opportunity.event_type}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {opportunity.mode}
          </span>
          {opportunity.data_mode === 'live' ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🟢 Live Opportunity</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              🧪 Demo Data
            </span>
          )}
          <span className="ml-auto mr-8 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Fee: {opportunity.fee_display}
          </span>
        </div>

        {/* Event Title & Organizer */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2">
          {opportunity.title}
        </h2>
        <div className="text-sm text-slate-300 flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Organized by <strong className="text-cyan-300">{opportunity.organizer}</strong></span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Source: <strong className="text-slate-300">{opportunity.source_name}</strong></span>
            {opportunity.source_verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 ml-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Source</span>
              </span>
            )}
          </div>
        </div>

        {/* Urgency Highlight Banner */}
        <div className="mb-6">
          <UrgencyBadge
            badgeLabel={opportunity.urgency_badge}
            urgencyText={opportunity.urgency_text}
            urgencyRank={opportunity.urgency_rank}
          />
        </div>

        {/* SECTION 6: OFFICIAL REGISTRATION HUB */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-slate-900 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Official Registration & Verification</h3>
            </div>
            {isClosed ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Registration Closed</span>
              </span>
            ) : opportunity.registration_status === 'URGENT' || opportunity.registration_status === 'LAST_CHANCE' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-4 h-4" />
                <span>Urgent: Closing Soon</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Registration Open</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">Official Portal Direct Navigation</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  TechPulse AI never imitates, proxies, or recreates registration forms. Clicking "Register Now" will securely open the verified official registration page in a new browser tab.
                </p>
              </div>
            </div>

            {toastMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                {onToggleMarkRegistered && !opportunity.is_user_registered && (
                  <button
                    onClick={() => {
                      onToggleMarkRegistered(opportunity.id);
                      setToastMessage(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                  >
                    Mark Registered Now
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {isClosed ? (
                <div className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs font-medium">
                  🔴 Registration for this opportunity has officially ended.
                </div>
              ) : regUrlStatus === 'valid' ? (
                <button
                  onClick={handleRegisterClick}
                  className="flex-1 min-w-[200px] py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                >
                  <span>Register Now on Official Page</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>⚠️ Direct registration link unavailable. Please check the official website below.</span>
                </div>
              )}

              {websiteUrlStatus === 'valid' && (
                <button
                  onClick={handleWebsiteClick}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {onToggleMarkRegistered && !isClosed && (
                <button
                  onClick={() => onToggleMarkRegistered(opportunity.id)}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    opportunity.is_user_registered
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${opportunity.is_user_registered ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{opportunity.is_user_registered ? "Registered (Undo)" : "Mark as Registered"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendation Box (Section 9) */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-blue-950/40 border border-indigo-500/30 rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Why TechPulse AI Recommends This</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/40">
                <span className="text-xs text-blue-200">AI Match:</span>
                <span className="text-sm font-extrabold text-cyan-300">{opportunity.match_score}%</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                {opportunity.verdict}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-200 italic mb-4 leading-relaxed">
            "{opportunity.why_attend_explanation}"
          </p>

          {/* 5-Star Ratings */}
          {opportunity.ratings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-navy-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Career Value:</span>
                {renderStars(opportunity.ratings.career_value)}
              </div>
              <div className="bg-navy-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Skill Relevance:</span>
                {renderStars(opportunity.ratings.skill_relevance)}
              </div>
              <div className="bg-navy-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Hands-on Value:</span>
                {renderStars(opportunity.ratings.hands_on_value)}
              </div>
              <div className="bg-navy-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Networking:</span>
                {renderStars(opportunity.ratings.networking)}
              </div>
              <div className="bg-navy-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between sm:col-span-2 md:col-span-1">
                <span className="text-xs text-slate-300 font-medium">Accessibility:</span>
                {renderStars(opportunity.ratings.accessibility)}
              </div>
            </div>
          )}

          {/* Match reasons */}
          {opportunity.reasons && opportunity.reasons.length > 0 && (
            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex flex-wrap gap-2">
              {opportunity.reasons.map((r, i) => (
                <span key={i} className="text-xs bg-slate-900/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* About Description */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-100 mb-2">About the Opportunity</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-navy-900/40 p-4 rounded-2xl border border-slate-800/80">
            {opportunity.description}
          </p>
        </div>

        {/* What You'll Learn */}
        {opportunity.what_you_will_learn && opportunity.what_you_will_learn.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-100 mb-2.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>What You'll Learn</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {opportunity.what_you_will_learn.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-navy-900/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Logistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 bg-navy-900/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-200">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[11px]">Event Date & Time</p>
              <p className="font-semibold">{opportunity.date} ({opportunity.start_time} - {opportunity.end_time})</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-200">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[11px]">Location & Mode</p>
              <p className="font-semibold">{opportunity.location} ({opportunity.mode})</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-200">
            <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[11px]">Eligibility</p>
              <p className="font-semibold">{opportunity.eligibility}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-200">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[11px]">Registration Deadline</p>
              <p className="font-semibold text-amber-300">{opportunity.registration_deadline.replace('T', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Skills Gained & Career Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills You'll Gain</h4>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.skills_gained?.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-cyan-300 border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Career Tracks / SDGs</h4>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.career_areas?.map((c, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-300 transition-colors"
          >
            ← Back
          </button>
          
          <button
            onClick={() => onToggleSave(opportunity)}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              opportunity.is_saved
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${opportunity.is_saved ? "fill-amber-400" : ""}`} />
            <span>{opportunity.is_saved ? "Saved (Reminder Active)" : "Save & Set Reminder"}</span>
          </button>

          {!isClosed && regUrlStatus === 'valid' && (
            <button
              onClick={handleRegisterClick}
              className="w-full sm:flex-1 py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
            >
              <span>Register Now on Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

