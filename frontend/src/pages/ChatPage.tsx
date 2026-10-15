import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Clock, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Bookmark,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Opportunity, ChatMessage } from '../types';
import { api } from '../services/api';
import { validateRegistrationUrl, openExternalUrl } from '../utils/urlValidator';

interface ChatPageProps {
  onViewDetails: (op: Opportunity) => void;
  onToggleSave: (op: Opportunity) => void;
  onTrackRegistration?: (opId: number) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  onViewDetails,
  onToggleSave,
  onTrackRegistration
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hi! I'm TechPulse AI, your technical opportunity assistant. Tell me what you're interested in, and I'll find workshops, hackathons, and conferences worth attending.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ai_engine: 'TechPulse RAG Engine'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Find upcoming AI and robotics workshops in Pune.",
    "What technical events are happening this month?",
    "Show me free workshops.",
    "Which events are closing this week?",
    "Find corporate events related to cloud computing.",
    "What opportunities are suitable for a third-year Computer Engineering student?",
    "I am interested in AI, robotics and IoT. What should I attend?",
    "Which event is best for me?",
    "Find opportunities that don't require prior experience."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChat(textToSend.trim());
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.reply,
        opportunities: res.opportunities,
        ai_engine: res.ai_engine,
        extracted_entities: res.extracted_entities,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "I experienced a temporary issue retrieving the latest opportunities. Please check your network or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in duration-300">
      {/* Chat Header */}
      <div className="p-4 bg-navy-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Ask TechPulse AI</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized technical opportunity discovery & recommendation assistant
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Hallucinations Verified</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser ? 'bg-blue-600 text-white' : 'bg-navy-800 border border-slate-700 text-cyan-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-3 max-w-2xl ${isUser ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-navy-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                }`}>
                  <div className="whitespace-pre-line font-normal">{m.text}</div>

                  {/* Extracted NLP Entities chip */}
                  {!isUser && m.extracted_entities && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-400">Extracted Filters:</span>
                      {m.extracted_entities.topics?.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300">
                          {t}
                        </span>
                      ))}
                      {m.extracted_entities.event_type && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Type: {m.extracted_entities.event_type}
                        </span>
                      )}
                      {m.extracted_entities.location && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          📍 {m.extracted_entities.location}
                        </span>
                      )}
                      {m.extracted_entities.budget_free_only && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          Free
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-2 pt-1 text-[10px] text-slate-400">
                    {!isUser && m.ai_engine && (
                      <span className="flex items-center gap-1 text-[10px] text-cyan-400/80">
                        <Cpu className="w-3 h-3" />
                        {m.ai_engine}
                      </span>
                    )}
                    <span className="ml-auto">{m.timestamp}</span>
                  </div>
                </div>

                {/* Embedded Opportunity Cards in Chatbot response */}
                {!isUser && m.opportunities && m.opportunities.length > 0 && (
                  <div className="space-y-3 pt-2 text-left">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Matching Opportunity Cards ({m.opportunities.length}):</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {m.opportunities.map((op) => (
                        <div
                          key={op.id}
                          className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300">
                                {op.event_type}
                              </span>
                              <span className="text-[11px] font-extrabold text-cyan-400">
                                {op.match_score}% Match
                              </span>
                            </div>
                            <h4 
                              onClick={() => onViewDetails(op)}
                              className="text-xs font-bold text-white hover:text-cyan-300 cursor-pointer line-clamp-2"
                            >
                              {op.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                              By {op.organizer}
                            </p>
                            <div className="mt-2 text-[10px] text-slate-300 space-y-1 bg-navy-950/60 p-2 rounded-xl">
                              <p className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span className="truncate">{op.urgency_text}</span>
                              </p>
                              <p className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-rose-400" />
                                <span className="truncate">{op.location} ({op.mode})</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-800">
                            <button
                              onClick={() => onViewDetails(op)}
                              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200"
                            >
                              View Details
                            </button>
                            {op.registration_status === 'CLOSED' || op.urgency_rank === 5 ? (
                              <span className="flex-1 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 text-center">
                                Closed
                              </span>
                            ) : validateRegistrationUrl(op.registration_url) === 'valid' ? (
                              <button
                                onClick={() => {
                                  openExternalUrl(op.registration_url!);
                                  if (onTrackRegistration) onTrackRegistration(op.id);
                                }}
                                className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center gap-1 shadow-md shadow-blue-900/30"
                              >
                                <span>Register</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            ) : validateRegistrationUrl(op.official_website_url) === 'valid' ? (
                              <button
                                onClick={() => openExternalUrl(op.official_website_url!)}
                                className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold flex items-center justify-center gap-1"
                              >
                                <span>Official Site</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            ) : (
                              <span className="flex-1 py-1.5 rounded-lg bg-slate-900 text-[10px] text-slate-500 text-center">
                                Link N/A
                              </span>
                            )}
                            <button
                              onClick={() => onToggleSave(op)}
                              className={`p-1.5 rounded-lg border text-slate-400 ${
                                op.is_saved ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-slate-800 border-slate-700"
                              }`}
                              title={op.is_saved ? "Saved" : "Save"}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${op.is_saved ? "fill-amber-400" : ""}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-navy-800 border border-slate-700 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <div className="p-4 rounded-3xl bg-navy-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Analyzing opportunities with RAG semantic pipeline...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-navy-950/70 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0 pl-1">
          Suggestions:
        </span>
        {quickPrompts.slice(0, 5).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3 py-1 rounded-full text-[11px] font-medium bg-navy-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-navy-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything: 'Find AI workshops near Pune', 'Show free hackathons', etc..."
            className="flex-1 py-3 px-4 bg-navy-950 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold transition-all shadow-lg shadow-blue-900/30 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
