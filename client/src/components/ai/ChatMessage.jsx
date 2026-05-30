import React from 'react';
import { Sparkles, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isCosmo = message.sender === 'cosmo';

  // Parser to render custom bold "**text**" markdown tags as bold JSX nodes
  const formatText = (text) => {
    if (!text) return '';
    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');

      return (
        <div key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
          {lines.map((line, lIdx) => {
            const parts = line.split('**');
            const parsedLine = parts.map((part, index) => {
              if (index % 2 === 1) {
                return <strong key={index} className="font-bold text-white">{part}</strong>;
              }
              return part;
            });

            return (
              <p key={lIdx} className={lIdx > 0 ? "mt-1 text-slate-300 leading-relaxed" : "text-slate-300 leading-relaxed"}>
                {parsedLine}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isCosmo ? 'justify-start' : 'justify-end'} mb-4`}>
      {isCosmo && (
        <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-md shadow-cyan-500/20 text-slate-950">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md border ${
        isCosmo
          ? 'bg-white/[0.03] border-white/10 text-slate-300 rounded-tl-sm'
          : 'bg-cyan-500 border-cyan-400 text-slate-950 rounded-tr-sm font-semibold'
      }`}>
        {formatText(message.text)}
      </div>

      {!isCosmo && (
        <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-slate-300">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
