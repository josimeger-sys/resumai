import React, { useState } from 'react';
import { Lock, FileText, CheckCircle2, Circle, Copy, Check } from 'lucide-react';

interface OutputSectionProps {
  data: any;
  isLoading: boolean;
  onUnlock: () => void;
}

const OutputSection: React.FC<OutputSectionProps> = ({ data, isLoading, onUnlock }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data) return;
    const text = `SITUATION\n${data.situation}\n\nTASK\n${data.task}\n\nACTION\n${data.action.join('\n')}\n\nRESULT\n${data.result}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col h-full shadow-lg shadow-black/50 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-white">AI Optimized Result</h2>
        </div>
        <div className="flex items-center gap-3">
            {isLoading && (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-green-500 uppercase">STREAMING</span>
                </div>
            )}
            {data && (
                <button 
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 relative custom-scrollbar">
        {!data && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                <FileText size={48} className="mb-4" />
                <p>Ready to optimize</p>
            </div>
        )}

        {(isLoading || (!data && isLoading)) && (
             <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-5/6"></div>
                <div className="h-32 bg-white/5 rounded w-full mt-6"></div>
             </div>
        )}

        {data && !isLoading && (
            <>
                <Section title="SITUATION" content={data.situation} color="text-accent" />
                <Section title="TASK" content={data.task} color="text-blue-400" />
                
                {/* Blurred Content */}
                <div className="relative mt-6">
                    <div className="filter blur-sm select-none pointer-events-none opacity-50 space-y-6">
                         <Section title="ACTION" content={data.action[0]} color="text-purple-400" />
                         <div className="pl-5 space-y-2">
                            <p className="text-gray-300 leading-relaxed text-sm">{data.action[1]}</p>
                            <p className="text-gray-300 leading-relaxed text-sm">{data.action[2]}</p>
                         </div>
                         <Section title="RESULT" content={data.result} color="text-green-400" />
                    </div>

                    {/* Paywall Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent via-surface/80 to-surface">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-4 mb-4 shadow-xl">
                            <Lock size={24} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Unlock Full Optimization</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-xs">
                            Get the complete STAR-formatted result including the <span className="text-accent">Quantified Results</span> section to pass the resume screen.
                        </p>
                        <button 
                            onClick={onUnlock}
                            className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Unlock All Content
                        </button>
                        <p className="text-[10px] text-gray-500 mt-3 font-mono">STARTING FROM $4.99/MO</p>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, content, color }: any) => (
    <div className="space-y-2">
        <div className={`flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider ${color}`}>
            <Circle size={8} fill="currentColor" />
            {title}
        </div>
        <p className="text-gray-300 leading-relaxed text-sm">
            {content}
        </p>
    </div>
);

export default OutputSection;
