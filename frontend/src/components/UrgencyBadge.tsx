import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  badgeLabel: string;
  urgencyText: string;
  urgencyRank?: number;
  compact?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ badgeLabel, urgencyText, urgencyRank = 3, compact = false }) => {
  // Determine color styling based on badgeLabel or urgencyRank
  let bgClass = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
  let icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  let pulseDot = "bg-emerald-400";

  if (badgeLabel.includes("LAST CHANCE") || urgencyRank === 1) {
    bgClass = "bg-rose-950/80 border-rose-500/60 text-rose-200 animate-pulse";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
    pulseDot = "bg-rose-500";
  } else if (badgeLabel.includes("URGENT") || urgencyRank === 2) {
    bgClass = "bg-amber-950/70 border-amber-500/50 text-amber-200";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    pulseDot = "bg-amber-400";
  } else if (badgeLabel.includes("CLOSING SOON") || urgencyRank === 3) {
    bgClass = "bg-yellow-950/60 border-yellow-500/40 text-yellow-200";
    icon = <Clock className="w-3.5 h-3.5 text-yellow-400" />;
    pulseDot = "bg-yellow-400";
  } else if (badgeLabel.includes("CLOSED") || urgencyRank === 5) {
    bgClass = "bg-slate-900 border-slate-700 text-slate-400";
    icon = <XCircle className="w-3.5 h-3.5 text-slate-500" />;
    pulseDot = "bg-slate-500";
  }

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${pulseDot}`} />
        {badgeLabel}
      </span>
    );
  }

  return (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium ${bgClass}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{badgeLabel}</span>
      </div>
      <span className="text-[11px] opacity-90 truncate max-w-[200px]">{urgencyText}</span>
    </div>
  );
};
