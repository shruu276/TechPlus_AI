import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Target, 
  Clock, 
  MessageSquareCode, 
  Bookmark, 
  User, 
  Settings, 
  Info, 
  Sparkles,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedCount: number;
  urgentCount: number;
  onResetCieDemo: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  savedCount,
  urgentCount,
  onResetCieDemo,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover Opportunities', icon: Compass },
    { id: 'recommendations', label: 'My Recommendations', icon: Target },
    { 
      id: 'closing_soon', 
      label: 'Closing Soon', 
      icon: Clock,
      badge: urgentCount > 0 ? urgentCount : undefined,
      badgeColor: 'bg-rose-500'
    },
    { id: 'chat', label: 'Ask TechPulse', icon: MessageSquareCode, isAI: true },
    { 
      id: 'saved', 
      label: 'Saved & Reminders', 
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : undefined,
      badgeColor: 'bg-amber-500'
    },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'admin', label: 'Admin & Feeds', icon: Settings },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 border-r border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Logo on Sidebar */}
          <div 
            onClick={() => handleItemClick('dashboard')}
            className="flex items-center gap-3 px-3 py-4 mb-4 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                TechPulse<span className="text-cyan-400"> AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Opportunity Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.isAI ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.isAI && !isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner: Quick CIE-3 Evaluator Preset */}
        <div className="pt-4 border-t border-slate-800">
          <div className="bg-gradient-to-br from-blue-950/70 to-indigo-950/60 p-3.5 rounded-2xl border border-blue-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white">CIE-3 Demo Preset</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug mb-3">
              Reset profile to Computer Eng 3rd Yr (Pune/Online) for 5-min evaluation.
            </p>
            <button
              onClick={() => {
                onResetCieDemo();
                handleItemClick('dashboard');
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Apply Demo Benchmark</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
