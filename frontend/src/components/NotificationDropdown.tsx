import React from 'react';
import { Bell, CheckCheck, Trash2, X, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onDelete: (id: number) => void;
  onSelectOpportunity?: (opId: number) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onSelectOpportunity
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-4 bg-navy-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Mark all as read"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Read all</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-slate-600 mb-1" />
            <p>No notifications at the moment.</p>
            <p className="text-[11px] text-slate-500">Save opportunities with reminders to get deadline alerts!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.is_read) onMarkRead(n.id);
                if (n.opportunity_id && onSelectOpportunity) {
                  onSelectOpportunity(n.opportunity_id);
                  onClose();
                }
              }}
              className={`p-3.5 transition-colors cursor-pointer flex gap-3 relative group ${
                n.is_read ? "bg-navy-950/40 hover:bg-navy-900/40" : "bg-blue-950/20 hover:bg-blue-950/40"
              }`}
            >
              {!n.is_read && (
                <div className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
              <div className="shrink-0 mt-0.5">
                <AlertCircle className={`w-4 h-4 ${
                  n.urgency === "last_chance" ? "text-rose-400" :
                  n.urgency === "urgent" ? "text-amber-400" : "text-cyan-400"
                }`} />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs font-bold text-slate-200 line-clamp-1">{n.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                <span className="text-[9px] text-slate-500 mt-1 block">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-opacity self-start"
                title="Dismiss"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
