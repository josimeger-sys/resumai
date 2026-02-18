import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface InputSectionProps {
  originalText: string;
  setOriginalText: (text: string) => void;
  targetPosition: string;
  setTargetPosition: (text: string) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  error?: string | null;
}

const InputSection: React.FC<InputSectionProps> = ({
  originalText,
  setOriginalText,
  targetPosition,
  setTargetPosition,
  onOptimize,
  isOptimizing,
  error
}) => {
  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col h-full shadow-lg shadow-black/50">
      <div className="flex items-center gap-2 mb-6 text-accent">
        <div className="w-1 h-5 bg-accent rounded-full"></div>
        <h2 className="text-lg font-semibold text-white">Input Experience</h2>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Target Position</label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
            <input
              type="text"
              value={targetPosition}
              onChange={(e) => setTargetPosition(e.target.value)}
              placeholder="e.g. ByteDance Frontend Engineer"
              className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Original Experience</label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Describe your experience here..."
            className="w-full flex-1 min-h-[200px] bg-background border border-white/10 rounded-xl p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
            </div>
        )}
        <button
          onClick={onOptimize}
          disabled={isOptimizing}
          className={clsx(
            "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40",
            isOptimizing 
                ? "bg-gray-700 cursor-not-allowed" 
                : "bg-gradient-to-r from-accent to-primary hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isOptimizing ? (
            <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Optimizing...</span>
            </>
          ) : (
            <>
                <Sparkles size={20} />
                <span>Optimize with AI (STAR)</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 font-mono">
            STANDARD STAR FRAMEWORK MODE ENABLED
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
         <div className="flex gap-2">
            {['REACT', 'REDUX', 'WEBPACK'].map(keyword => (
                <span key={keyword} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                    {keyword}
                </span>
            ))}
         </div>
         <span className="text-xs text-gray-500">3 Keywords Detected</span>
      </div>
    </div>
  );
};

export default InputSection;
