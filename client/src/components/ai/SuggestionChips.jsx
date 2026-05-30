import React from 'react';
import { BarChart3, Activity, AlertTriangle, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Forecast Occupancy', icon: BarChart3, query: 'Show me our predicted occupancy trends and time-series tomorrow forecast.' },
  { label: 'Branch Health', icon: Activity, query: 'Which workspace branches currently have the highest and lowest smart load scores?' },
  { label: 'Operational Risks', icon: AlertTriangle, query: 'Analyze our support ticket queue backlog and branch loads for operational risks.' },
  { label: 'At-Risk Clients', icon: ShieldAlert, query: 'What accounts are identified as high-risk churn risks and what are their renewal statistics?' },
  { label: 'Recommendations', icon: Sparkles, query: 'Formulate active recommendations and capacity interventions for our coworking spaces.' },
  { label: 'Business Summary', icon: Terminal, query: 'Provide a concise, high-impact business summary of our current corporate network health index.' }
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {SUGGESTIONS.map((chip, index) => {
        const IconComponent = chip.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(chip.query)}
            className="flex items-center gap-2 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 p-3 transition text-xs text-slate-300 hover:text-white cursor-pointer group"
          >
            <IconComponent className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition shrink-0" />
            <span className="truncate">{chip.label}</span>
          </button>
        );
      })}
    </div>
  );
}
