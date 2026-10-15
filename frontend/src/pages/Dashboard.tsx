import React from 'react';
import { 
  Target, 
  Clock, 
  Bookmark, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  MessageSquareCode, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Opportunity, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';

interface DashboardProps {
  profile: UserProfile | null;
  opportunities: Opportunity[];
  recommendations: Opportunity[];
  dontMiss: Opportunity[];
  closingSoon: Opportunity[];
  savedCount: number;
  onViewDetails: (op: Opportunity) => void;
  onToggleSave: (op: Opportunity) => void;
  onNavigate: (view: string, filterParams?: any) => void;
  onTrackRegistration?: (opId: number) => void;
  onToggleMarkRegistered?: (opId: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  opportunities,
  recommendations,
  dontMiss,
  closingSoon,
  savedCount,
  onViewDetails,
  onToggleSave,
  onNavigate,
  onTrackRegistration,
  onToggleMarkRegistered
}) => {
  const highMatchCount = opportunities.filter((op) => op.match_score >= 90).length;

  const categories = [
    { name: "Artificial Intelligence", icon: "🤖", count: opportunities.filter(o => o.topics.includes("Artificial Intelligence")).length },
    { name: "Robotics & Edge AI", icon: "🦾", count: opportunities.filter(o => o.topics.includes("Robotics")).length },
    { name: "Cloud & DevOps", icon: "☁️", count: opportunities.filter(o => o.topics.includes("Cloud Computing") || o.topics.includes("DevOps")).length },
    { name: "Hackathons", icon: "🏆", count: opportunities.filter(o => o.event_type === "Hackathon").length },
    { name: "Cybersecurity", icon: "🛡️", count: opportunities.filter(o => o.topics.includes("Cybersecurity")).length },
    { name: "Sustainability", icon: "🌱", count: opportunities.filter(o => o.topics.includes("Sustainability")).length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-indigo-950/70 to-navy-900 p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Opportunity Radar Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Good morning, {profile?.name?.split(' ')[0] || 'Aarav'}! 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Here's what you shouldn't miss. TechPulse AI matched <strong className="text-cyan-300">{recommendations.length} opportunities</strong> to your{' '}
            <span className="text-indigo-300">{profile?.branch}</span> curriculum and interests.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onNavigate('discover')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30"
            >
              <Compass className="w-4 h-4" />
              <span>🔎 Discover Opportunities</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 border border-slate-700"
            >
              <MessageSquareCode className="w-4 h-4 text-cyan-400" />
              <span>💬 Ask TechPulse AI</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-blue-600/10 via-cyan-500/5 to-transparent pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('recommendations')}
          className="glass-card rounded-2xl p-4 sm:p-5 cursor-pointer border border-slate-800 hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Recommended</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{recommendations.length}</div>
          <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <span>Tailored to your profile</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        <div 
          onClick={() => onNavigate('closing_soon')}
          className="glass-card rounded-2xl p-4 sm:p-5 cursor-pointer border border-slate-800 hover:border-rose-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Closing Soon</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-300">{closingSoon.length}</div>
          <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
            <span>Require urgent action</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        <div 
          onClick={() => onNavigate('saved')}
          className="glass-card rounded-2xl p-4 sm:p-5 cursor-pointer border border-slate-800 hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Saved</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{savedCount}</div>
          <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
            <span>Reminders enabled</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        <div 
          onClick={() => onNavigate('recommendations')}
          className="glass-card rounded-2xl p-4 sm:p-5 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">High Match</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{highMatchCount}</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>Score ≥ 90%</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* 🚨 Section 14: "DON'T MISS THESE" (Match score > 75% AND Closing Soon) */}
      {dontMiss.length > 0 && (
        <section className="rounded-3xl bg-gradient-to-br from-rose-950/40 via-navy-900 to-navy-900 p-6 border border-rose-500/30 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>🚨 Don't Miss These Opportunities</span>
                </h2>
                <p className="text-xs text-rose-300">
                  High AI Match (&gt;75%) with registration closing within 7 days. Act before registration shuts!
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('closing_soon')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <span>View all closing soon</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dontMiss.slice(0, 3).map((op) => (
              <OpportunityCard
                key={op.id}
                opportunity={op}
                onViewDetails={onViewDetails}
                onToggleSave={onToggleSave}
                onTrackRegistration={onTrackRegistration}
                onToggleMarkRegistered={onToggleMarkRegistered}
              />
            ))}
          </div>
        </section>
      )}

      {/* 🎯 TOP AI RECOMMENDATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>🎯 Top Recommendations For You</span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized based on {profile?.interests.length || 4} technical interests and your year/branch
            </p>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>See all ranked</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.slice(0, 3).map((op) => (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              onViewDetails={onViewDetails}
              onToggleSave={onToggleSave}
              onTrackRegistration={onTrackRegistration}
              onToggleMarkRegistered={onToggleMarkRegistered}
            />
          ))}
        </div>
      </section>

      {/* 🔎 EXPLORE OPPORTUNITIES BY CATEGORY */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">🔎 Explore by Technical Discipline</h2>
          <p className="text-xs text-slate-400">Quickly filter opportunities across high-demand domains</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => onNavigate('discover', { topic: cat.name })}
              className="glass-card rounded-2xl p-4 text-center cursor-pointer border border-slate-800 hover:border-cyan-500/40 transition-all group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">{cat.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{cat.count} opportunities</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
