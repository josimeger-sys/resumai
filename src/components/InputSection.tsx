import React, { useState } from 'react';
import { useResumeStore, Identity } from '../store/useResumeStore';
import { Sparkles, Briefcase, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import SettingsModal from './SettingsModal';

const InputSection = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { 
    identity, 
    setIdentity, 
    rawExperience, 
    setRawExperience,
    targetPosition,
    setTargetPosition,
    jobDescription,
    setJobDescription,
    refine,
    isRefining,
    error,
    aiConfig,
    setAiConfig
  } = useResumeStore();

  const handleRefine = async () => {
    await refine();
  };

  const identities: { id: Identity; label: string }[] = [
    { id: 'intern', label: '实习 (Intern)' },
    { id: 'campus', label: '校招 (Campus)' },
    { id: 'experienced', label: '社招 (Experienced)' },
  ];

  return (
    <>
    <div className="flex flex-col h-full bg-white border-4 border-fresh-border rounded-cartoon shadow-cartoon-lg relative overflow-hidden group transition-all duration-300">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-0">
      {/* Target Seniority */}
      <div className="mb-6">
        <label className="text-xs font-bold text-fresh-text uppercase tracking-wider mb-3 block flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-fresh-main border border-fresh-border"></span>
           目标职级
        </label>
        <div className="flex p-1.5 bg-gray-50 rounded-xl border-2 border-fresh-border gap-1">
          {identities.map((item) => (
            <button
              key={item.id}
              onClick={() => setIdentity(item.id)}
              className={clsx(
                "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 border-2",
                identity === item.id
                  ? "bg-fresh-main text-black border-fresh-border shadow-cartoon-sm"
                  : "text-gray-500 border-transparent hover:text-black hover:bg-gray-200"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Position (New) */}
      <div className="mb-6">
        <label className="text-xs font-bold text-fresh-text uppercase tracking-wider mb-3 block flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-fresh-secondary border border-fresh-border"></span>
           目标岗位
        </label>
        <input
            type="text"
            value={targetPosition}
            onChange={(e) => setTargetPosition(e.target.value)}
            placeholder={`例如：${identities.find(i => i.id === identity)?.label.split(' ')[0]}产品经理 (选填)`}
            className="w-full bg-white border-2 border-fresh-border rounded-xl p-3 text-sm text-fresh-text placeholder:text-gray-400 focus:outline-none focus:shadow-cartoon transition-all"
        />
      </div>

      {/* Job Description (New) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold text-fresh-text uppercase tracking-wider flex items-center gap-2">
            目标岗位描述 (JD) - 选填
          </label>
        </div>
        <div className="relative group/input">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="粘贴JD或岗位职责。AI将根据JD优化你的简历，使其更匹配岗位要求..."
            className="w-full h-24 bg-white border-2 border-fresh-border rounded-xl p-4 text-sm text-fresh-text placeholder:text-gray-400 resize-none focus:outline-none focus:shadow-cartoon transition-all"
          />
        </div>
      </div>

      {/* Original Experience */}
      <div className="flex-1 flex flex-col min-h-[200px]">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold text-fresh-text uppercase tracking-wider flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-fresh-accent border border-fresh-border"></span>
            原始经历
          </label>
          <span className="text-[10px] text-black font-mono bg-fresh-secondary px-2 py-0.5 rounded-full border-2 border-fresh-border font-bold">
            {rawExperience.length} / 2000
          </span>
        </div>
        
        <div className="relative flex-1 group/input">
          <textarea
            value={rawExperience}
            onChange={(e) => setRawExperience(e.target.value)}
            placeholder="请在此粘贴您的原始项目经历、数据指标或简单的要点描述..."
            className="w-full h-full bg-white border-2 border-fresh-border rounded-xl p-4 text-sm text-fresh-text placeholder:text-gray-400 resize-none focus:outline-none focus:shadow-cartoon transition-all"
            maxLength={2000}
          />
        </div>

        {/* Error Message - Moved closer */}
        {error && (
            <div className="mt-2 p-4 rounded-xl bg-fresh-pink/20 border-2 border-fresh-pink text-sm text-fresh-text font-bold flex flex-col items-start gap-3 animate-in fade-in slide-in-from-bottom-2 shadow-cartoon-sm">
                <div className="flex items-start gap-3">
                    <div className="text-xl animate-bounce">🙈</div>
                    <div className="flex-1">
                        <h4 className="font-black text-fresh-pink mb-1">哎呀，这里好像有点问题...</h4>
                        <span className="text-gray-600 leading-relaxed text-xs">{error}</span>
                    </div>
                </div>
                
                {/* Show settings button if it's a configuration error */}
                {(error.includes('Configuration Error') || error.includes('API Key')) && (
                    <button 
                        onClick={() => setShowSettings(true)}
                        className="w-full py-2 bg-fresh-pink text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500 transition-colors shadow-sm"
                    >
                        <Settings size={14} />
                        打开设置并修复
                    </button>
                )}
            </div>
        )}
      </div>
      </div>

      {/* Action Button */}
      <div className="p-6 bg-white z-10 border-t-2 border-fresh-border/10">
        <button
          onClick={handleRefine}
          disabled={isRefining || !rawExperience.trim()}
          className={clsx(
            "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group border-2 border-fresh-border shadow-cartoon hover:shadow-cartoon-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
            isRefining || !rawExperience.trim()
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300 shadow-none"
              : "bg-fresh-secondary text-black"
          )}
        >
            {!isRefining && rawExperience.trim() && (
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
          
          {isRefining ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>正在深度优化...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} strokeWidth={2.5} className={clsx(!isRefining && rawExperience.trim() && "animate-pulse")} />
              <span>AI 智能优化</span>
            </>
          )}
        </button>
      </div>
    </div>
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={aiConfig}
        onSave={setAiConfig}
      />
    </>
  );
};

export default InputSection;
