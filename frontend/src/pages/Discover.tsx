import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, Search, Sparkles, SlidersHorizontal, Radio, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { api } from '../services/api';

interface DiscoverProps {
  initialSearch?: string;
  initialTopic?: string;
  onViewDetails: (op: Opportunity) => void;
  onToggleSave: (op: Opportunity) => void;
  onTrackRegistration?: (opId: number) => void;
  onToggleMarkRegistered?: (opId: number) => void;
  fetchOpportunities: (params?: Record<string, string>) => Promise<Opportunity[]>;
}

export const Discover: React.FC<DiscoverProps> = ({
  initialSearch = '',
  initialTopic = 'All',
  onViewDetails,
  onToggleSave,
  onTrackRegistration,
  onToggleMarkRegistered,
  fetchOpportunities,
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveSearching, setLiveSearching] = useState(false);
  const [liveMessage, setLiveMessage] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCost, setSelectedCost] = useState('all'); // all, free, paid
  const [selectedDataMode, setSelectedDataMode] = useState('all'); // all, live, demo
  const [selectedStatus, setSelectedStatus] = useState('All'); // All, open, closing_soon, urgent, closed
  const [selectedDate, setSelectedDate] = useState('all'); // all, today, this_week, this_month
  const [sortBy, setSortBy] = useState('match'); // match, urgency, date, fee
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const topicsList = [
    'All',
    'Artificial Intelligence',
    'Machine Learning',
    'Robotics',
    'IoT',
    'Cloud Computing',
    'Cybersecurity',
    'Web Development',
    'App Development',
    'Blockchain',
    'DevOps',
    'Sustainability',
    'Research',
    'Entrepreneurship',
  ];

  const typesList = [
    'All',
    'Workshop',
    'Hackathon',
    'Conference',
    'Meetup',
    'Webinar',
    'Competition',
    'Corporate Event',
    'Research Event',
    'Training',
    'Internship',
    'Certification',
  ];

  const locationsList = ['All', 'Online', 'Pune', 'Mumbai', 'Nashik', 'Maharashtra'];

  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (selectedTopic !== 'All') params.topic = selectedTopic;
      if (selectedType !== 'All') params.event_type = selectedType;
      if (selectedLocation !== 'All') params.location = selectedLocation;
      if (selectedCost !== 'all') params.cost = selectedCost;
      if (selectedDataMode !== 'all') params.data_mode = selectedDataMode;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedDate !== 'all') params.date_filter = selectedDate;
      params.sort_by = sortBy;

      const data = await fetchOpportunities(params);
      setOpportunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveSearch = async () => {
    setLiveSearching(true);
    setLiveMessage(null);
    try {
      const liveResults = await api.liveSearch(search.trim() || undefined);
      setLiveMessage(`✨ Crawled & indexed ${liveResults.length} live opportunities!`);
      setTimeout(() => setLiveMessage(null), 5000);
      await loadData();
    } catch (err) {
      console.error(err);
      setLiveMessage("⚠️ Live crawler failed. Please check network.");
      setTimeout(() => setLiveMessage(null), 4000);
    } finally {
      setLiveSearching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTopic, selectedType, selectedLocation, selectedCost, selectedDataMode, selectedStatus, selectedDate, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedTopic('All');
    setSelectedType('All');
    setSelectedLocation('All');
    setSelectedCost('all');
    setSelectedDataMode('all');
    setSelectedStatus('All');
    setSelectedDate('all');
    setSortBy('match');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>🔎 Discover Technical Opportunities</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Filter by topic, urgency, location, or cost to find your next career breakthrough.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{showFiltersMobile ? 'Hide Filters' : 'Show Filter Options'}</span>
        </button>
      </div>

      {/* Search and Sort Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keywords, topics, organizers..."
              className="w-full pl-10 pr-20 py-2 bg-navy-950/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
            >
              Search
            </button>
          </form>

          {/* Live Search Trigger Button (Section 10) */}
          <button
            onClick={handleLiveSearch}
            disabled={liveSearching}
            title="Trigger live internet search and ingestion for new real-time opportunities"
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950 shrink-0"
          >
            {liveSearching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Crawling...</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>🔴 Live Search</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-navy-950 border border-slate-700 text-slate-200 py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="match">🎯 AI Match Score</option>
              <option value="urgency">⏰ Deadline Urgency</option>
              <option value="date">📅 Event Date</option>
              <option value="fee">💰 Registration Fee</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Search Status Notification */}
      {liveMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{liveMessage}</span>
        </div>
      )}

      {/* Main Layout: Filters sidebar + Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className={`md:col-span-1 space-y-5 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Filter Facets</h3>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                Clear all
              </button>
            </div>

            {/* Data Mode Filter (Section 10) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Data Source Mode</label>
              <div className="grid grid-cols-3 gap-1 bg-navy-950 p-1 rounded-xl border border-slate-700">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'live', label: '🟢 Live' },
                  { id: 'demo', label: '🧪 Demo' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedDataMode(mode.id)}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      selectedDataMode === mode.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Technical Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400"
              >
                {topicsList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Event Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Event Format</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400"
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Location / Hub</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Cost Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Fee / Budget</label>
              <div className="grid grid-cols-3 gap-1 bg-navy-950 p-1 rounded-xl border border-slate-700">
                {['all', 'free', 'paid'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCost(c)}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      selectedCost === c ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Registration Urgency Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Deadline Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Statuses</option>
                <option value="open">🟢 Open Registrations</option>
                <option value="urgent">🟠 Urgent (&lt; 7 Days)</option>
                <option value="closing_soon">🟡 Closing Soon (&le; 14 Days)</option>
                <option value="closed">⚫ Registration Closed</option>
              </select>
            </div>

            {/* Date Window */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Event Date Window</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only</option>
                <option value="this_week">This Week (7 Days)</option>
                <option value="this_month">This Month (30 Days)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunity Cards Results */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-400">
              Showing <strong className="text-white">{opportunities.length}</strong> opportunities
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
              <p className="text-xs">Running AI Opportunity Matcher...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <p className="text-base font-bold text-slate-200">No matching opportunities found</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No events currently match all the selected filters. Try broadening your location or fee preferences.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors inline-block mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {opportunities.map((op) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
