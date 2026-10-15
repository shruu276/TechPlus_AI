import React from 'react';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  Workflow, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Compass
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
  onResetCieDemo: () => Promise<void>;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onResetCieDemo }) => {
  const aiTechnologies = [
    {
      title: "Natural Language Processing (NLP)",
      desc: "Deconstructs unstructured student queries into structured intent, topic, budget, and location constraints.",
      icon: "🗣️"
    },
    {
      title: "Generative AI",
      desc: "Creates personalized 'Why You Should Attend' justifications tailored to each student's branch and career goals.",
      icon: "✨"
    },
    {
      title: "Multi-Criteria Recommendation System",
      desc: "Evaluates 6 weighted factors (interests, branch, eligibility, location, budget, urgency) to calculate 0-100% match scores.",
      icon: "🎯"
    },
    {
      title: "Semantic Similarity & Ranking",
      desc: "Matches student curriculum goals with technical syllabus concepts using keyword/embedding token affinity matrices.",
      icon: "🧠"
    },
    {
      title: "Information Extraction",
      desc: "Extracts dates, registration deadlines, eligibility criteria, and fee structures from event listings.",
      icon: "📑"
    },
    {
      title: "Retrieval-Augmented Generation (RAG)",
      desc: "Grounds every chatbot response in verified opportunity database facts to eliminate hallucinations entirely.",
      icon: "🛡️"
    }
  ];

  const demoSteps = [
    {
      step: 1,
      title: "Load Benchmark Student Profile",
      desc: "Pre-configures Aarav Sharma (Computer Engineering, Third Year, Pune + Online, AI/Robotics/IoT/Cloud).",
      action: "Load Profile",
      view: "profile"
    },
    {
      step: 2,
      title: "Ask Natural Language Query in Chat",
      desc: "Prompt TechPulse: 'Find upcoming AI and robotics workshops in Pune' to inspect extracted filters and card generation.",
      action: "Open Chat",
      view: "chat"
    },
    {
      step: 3,
      title: "Inspect 'Why Should I Attend?' & 5-Star Ratings",
      desc: "View event details to inspect AI Match breakdown, career value, skill relevance, and hands-on ratings.",
      action: "Discover",
      view: "discover"
    },
    {
      step: 4,
      title: "Explore 'Don't Miss This' & Urgency Tiers",
      desc: "Observe real-time deadline intelligence radar (🔴 Last Chance <2d, 🟠 Urgent 2-7d, 🟡 Closing Soon).",
      action: "Closing Soon",
      view: "closing_soon"
    },
    {
      step: 5,
      title: "Save Opportunity & Set In-App Reminder",
      desc: "Bookmark an event, choose 7d/3d/1d alert thresholds, and verify live alerts in the Notification Center.",
      action: "Saved & Alerts",
      view: "saved"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-navy-900 via-indigo-950/60 to-navy-900">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Course CIE-3 Project</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          About TechPulse AI
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
          <strong>Tagline:</strong> “Discover. Match. Act. Never Miss an Opportunity.”
          <br />
          An AI-powered technical opportunity assistant specifically engineered for engineering students.
        </p>
      </div>

      {/* CIE-3 5-Minute Demonstration Guide (Section 31) */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-navy-900 to-navy-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">CIE-3 5-Minute Demonstration Flow</h2>
          </div>
          <button
            onClick={() => {
              onResetCieDemo();
              onNavigate('dashboard');
            }}
            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold transition-colors"
          >
            1-Click Benchmark Setup
          </button>
        </div>

        <div className="space-y-3">
          {demoSteps.map((s) => (
            <div key={s.step} className="bg-navy-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate(s.view)}
                className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold shrink-0 flex items-center gap-1"
              >
                <span>{s.action}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-3">
          <h2 className="text-base font-bold text-rose-300 flex items-center gap-2">
            <span>🚨 The Problem</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Engineering students frequently miss prestigious technical workshops, hackathons, and corporate internships because announcement details are scattered across disparate portals, WhatsApp groups, and university notice boards. Most discover opportunities after registrations have already closed.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
          <h2 className="text-base font-bold text-emerald-300 flex items-center gap-2">
            <span>💡 The Solution</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            TechPulse AI continuously organizes technical opportunities, evaluates them against the student's unique academic year, branch, and technical goals, highlights urgent countdown deadlines, and provides AI-tailored career justifications to prevent missed opportunities.
          </p>
        </div>
      </div>

      {/* AI Technologies Demonstrated (Section 22) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span>AI Technologies Demonstrated</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiTechnologies.map((tech, i) => (
            <div key={i} className="bg-navy-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-2xl">{tech.icon}</div>
              <h3 className="text-xs font-bold text-white">{tech.title}</h3>
              <p className="text-[11px] text-slate-400 leading-snug">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          🚀 Future Scope & Commercial Roadmap
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Automated WhatsApp & Telegram deadline bot pushes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>LinkedIn profile synchronization & skill gap mapping</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Direct college ERP / Unstop / Devfolio calendar sync</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Resume PDF parsing for zero-click automatic opportunity matching</span>
          </div>
        </div>
      </div>
    </div>
  );
};
