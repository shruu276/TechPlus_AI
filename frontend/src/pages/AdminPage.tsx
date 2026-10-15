import React, { useState } from 'react';
import { 
  Settings, 
  PlusCircle, 
  Trash2, 
  XCircle, 
  RotateCcw, 
  DownloadCloud, 
  Cpu, 
  Key, 
  Check, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Opportunity, AIStatus } from '../types';
import { api } from '../services/api';

interface AdminPageProps {
  opportunities: Opportunity[];
  aiStatus: AIStatus | null;
  onRefreshData: () => Promise<void>;
  onRefreshAiStatus: () => Promise<void>;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  opportunities,
  aiStatus,
  onRefreshData,
  onRefreshAiStatus
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // New Opportunity Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOp, setNewOp] = useState({
    title: '',
    organizer: '',
    description: '',
    event_type: 'Workshop',
    topics: 'Artificial Intelligence, Robotics',
    date: '2026-10-30',
    location: 'Pune',
    mode: 'Offline',
    eligibility: 'All Engineering Students',
    fee: 0,
    registration_deadline: '2026-10-25T23:59:00',
    registration_url: 'https://unstop.com',
    source_url: 'https://ieee.org',
    source_name: 'Admin Manual Entry'
  });

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setLoadingAction(true);
    try {
      await api.setApiKey(apiKeyInput.trim());
      await onRefreshAiStatus();
      setApiKeyInput('');
      showNotification('Gemini API key updated successfully! Live LLM enabled.');
    } catch (e) {
      showNotification('Failed to update API key', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all opportunities to fresh demo state relative to today?')) return;
    setLoadingAction(true);
    try {
      await api.resetDemoData();
      await onRefreshData();
      showNotification('Demo data successfully reseeded with 20 fresh records!');
    } catch (e) {
      showNotification('Failed to reset demo data', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRunIngestion = async () => {
    setLoadingAction(true);
    try {
      const res = await api.runIngestion();
      await onRefreshData();
      showNotification(`Ingestion Pipeline complete: Ingested ${res.ingested_count} new events, skipped ${res.skipped_duplicates} duplicates.`);
    } catch (e) {
      showNotification('Ingestion pipeline failed', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteOp = async (id: number) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      await api.deleteOpportunity(id);
      await onRefreshData();
      showNotification('Opportunity deleted.');
    } catch (e) {
      showNotification('Failed to delete', 'error');
    }
  };

  const handleCloseOp = async (id: number) => {
    try {
      await api.markClosed(id);
      await onRefreshData();
      showNotification('Opportunity marked as Registration Closed.');
    } catch (e) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const payload = {
        ...newOp,
        topics: newOp.topics.split(',').map((t) => t.trim()),
        fee: Number(newOp.fee),
        what_you_will_learn: [
          'Hands-on technical implementation',
          'Industry best practices and architecture',
          'Networking with tech mentors'
        ],
        skills_gained: newOp.topics.split(',').map((t) => t.trim()),
        career_areas: ['Engineering Specialist']
      };
      await api.createOpportunity(payload);
      await onRefreshData();
      setShowAddForm(false);
      showNotification('New opportunity successfully added to database!');
    } catch (e) {
      showNotification('Failed to create opportunity', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Admin & Opportunity Feeds</h1>
            <p className="text-xs text-slate-400">
              Manage database records, configure AI keys, and test event ingestion pipelines.
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' 
            : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Row: AI Configuration + Ingestion Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Engine Status & Key Config */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI Engine Configuration</span>
            </h2>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              aiStatus?.gemini_configured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}>
              {aiStatus?.active_engine}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            TechPulse AI runs in dual-mode: It connects to <strong>Google Gemini LLM</strong> when an API key is provided, or seamlessly switches to the high-fidelity <strong>Local AI Fallback Engine</strong> (semantic similarity, multi-factor recommendation math, NLP parser).
          </p>

          <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              Enter Gemini API Key (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={aiStatus?.masked_key ? `Key active (${aiStatus.masked_key})` : "AIzaSy..."}
                className="flex-1 py-2 px-3 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={loadingAction || !apiKeyInput.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Data Seeding & Ingestion Pipeline (Section 19) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-indigo-400" />
              <span>Event Feeds & Pipeline</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              Total Records: {opportunities.length}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The modular ingestion service simulates ingesting technical opportunities from IEEE student branches, college innovation cells, and tech communities with automatic deduplication.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleRunIngestion}
              disabled={loadingAction}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-900/30"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Run Ingestion Pipeline</span>
            </button>

            <button
              onClick={handleResetDemoData}
              disabled={loadingAction}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reseed 20 Demo Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Opportunity Entry & Existing Records Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Database Opportunities</h2>
            <p className="text-xs text-slate-400">View, create, mark closed, or remove opportunities.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-blue-900/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel Form' : 'Add Opportunity Manually'}</span>
          </button>
        </div>

        {/* Add Opportunity Form */}
        {showAddForm && (
          <form onSubmit={handleCreateSubmit} className="bg-navy-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">New Opportunity Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Event Title"
                value={newOp.title}
                onChange={(e) => setNewOp({ ...newOp, title: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
              <input
                type="text"
                placeholder="Organizer"
                value={newOp.organizer}
                onChange={(e) => setNewOp({ ...newOp, organizer: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
              <select
                value={newOp.event_type}
                onChange={(e) => setNewOp({ ...newOp, event_type: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Conference">Conference</option>
                <option value="Meetup">Meetup</option>
                <option value="Webinar">Webinar</option>
                <option value="Competition">Competition</option>
                <option value="Corporate Event">Corporate Event</option>
              </select>

              <input
                type="text"
                placeholder="Topics (comma separated)"
                value={newOp.topics}
                onChange={(e) => setNewOp({ ...newOp, topics: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
              <input
                type="date"
                value={newOp.date}
                onChange={(e) => setNewOp({ ...newOp, date: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
              <input
                type="text"
                placeholder="Location (e.g. Pune, Online)"
                value={newOp.location}
                onChange={(e) => setNewOp({ ...newOp, location: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />

              <input
                type="number"
                placeholder="Fee in INR (0 for Free)"
                value={newOp.fee}
                onChange={(e) => setNewOp({ ...newOp, fee: Number(e.target.value) })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
              <input
                type="text"
                placeholder="Registration Deadline (ISO e.g. 2026-10-25T23:59:00)"
                value={newOp.registration_deadline}
                onChange={(e) => setNewOp({ ...newOp, registration_deadline: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
              <input
                type="url"
                placeholder="Registration URL"
                value={newOp.registration_url}
                onChange={(e) => setNewOp({ ...newOp, registration_url: e.target.value })}
                className="py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
                required
              />
            </div>

            <textarea
              placeholder="Description of the event..."
              value={newOp.description}
              onChange={(e) => setNewOp({ ...newOp, description: e.target.value })}
              className="w-full py-2 px-3 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white"
              rows={2}
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loadingAction}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Save Opportunity to DB
              </button>
            </div>
          </form>
        )}

        {/* Existing Opportunities List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {opportunities.map((op) => (
                <tr key={op.id} className="hover:bg-navy-900/50 transition-colors">
                  <td className="p-3 text-slate-500 font-mono">#{op.id}</td>
                  <td className="p-3 font-semibold text-white max-w-xs truncate">{op.title}</td>
                  <td className="p-3 text-cyan-300">{op.event_type}</td>
                  <td className="p-3">{op.location}</td>
                  <td className="p-3 font-mono text-amber-300">{op.registration_deadline.split('T')[0]}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {op.urgency_badge.split(' ')[0]} {op.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleCloseOp(op.id)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400"
                      title="Mark Registration Closed"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteOp(op.id)}
                      className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
