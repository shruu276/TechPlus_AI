import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, Menu, Cpu } from 'lucide-react';
import { UserProfile, NotificationItem, AIStatus } from '../types';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  profile: UserProfile | null;
  notifications: NotificationItem[];
  aiStatus: AIStatus | null;
  onSearch: (query: string) => void;
  onNavigate: (view: string) => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: number) => void;
  onSelectOpportunity: (id: number) => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  notifications,
  aiStatus,
  onSearch,
  onNavigate,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onSelectOpportunity,
  onToggleMobileMenu,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigate('discover');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  TechPulse<span className="text-cyan-400"> AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CIE-3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Discover. Match. Act.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Natural Language Search bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search workshops, hackathons, AI events in Pune..."
              className="w-full pl-10 pr-4 py-2 bg-navy-950/70 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
            {searchInput && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold text-white transition-colors"
              >
                Go
              </button>
            )}
          </form>
        </div>

        {/* Right: AI Engine Status, Notifications, Student Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* AI Mode Indicator */}
          <div
            onClick={() => onNavigate('admin')}
            title="Click to view AI engine settings"
            className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-navy-800/90 border border-slate-700 hover:border-cyan-500/50 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 text-[11px]">
              {aiStatus?.gemini_configured ? 'Gemini 2.5 Live' : 'Local AI Engine'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                aiStatus?.gemini_configured ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              notifications={notifications}
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onDelete={onDeleteNotification}
              onSelectOpportunity={onSelectOpportunity}
            />
          </div>

          {/* User Profile Pill */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-slate-700/80 hover:border-slate-600 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {profile ? profile.name.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {profile?.name || 'Aarav Sharma'}
              </p>
              <p className="text-[10px] text-cyan-400 leading-tight">
                {profile ? `${profile.year.split(' ')[0]} ${profile.branch.split(' ')[0]}` : '3rd Year CE'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
