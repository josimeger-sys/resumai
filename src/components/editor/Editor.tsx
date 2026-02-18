import React, { useState, useEffect } from 'react';
import InputSection from './InputSection';
import OutputSection from './OutputSection';
import { Zap, CheckCircle, Settings as SettingsIcon } from 'lucide-react';
import PaymentModal from '../payment/PaymentModal';
import { optimizeResume } from '../../services/ai';
import SettingsModal, { AIConfig } from '../SettingsModal';

const Editor: React.FC = () => {
  const [originalText, setOriginalText] = useState('Led a team to optimize the internal dashboard. We used React and Redux.\nThe new version was faster and people liked it. Also fixed some bugs in the\nlegacy system and improved build times by changing the webpack config.');
  const [targetPosition, setTargetPosition] = useState('ByteDance Frontend Engineer');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo'
  });

  const handlePaymentSuccess = () => {
    setIsPro(true);
    setShowPayment(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizedData(null); // Clear previous result to show loading state
    setError(null);
    
    try {
        const result = await optimizeResume(
            originalText, 
            targetPosition,
            aiConfig.apiKey,
            aiConfig.baseUrl,
            aiConfig.model
        );
        setOptimizedData(result);
    } catch (err: any) {
        console.error("Optimization failed:", err);
        setError(err.message || "Failed to optimize. Please check your API configuration.");
        
        if (err.message?.includes("API Key is missing")) {
             setShowSettings(true);
        }
    } finally {
        setIsOptimizing(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
        >
            <SettingsIcon size={14} />
            <span>AI Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        <InputSection 
          originalText={originalText} 
          setOriginalText={setOriginalText}
          targetPosition={targetPosition}
          setTargetPosition={setTargetPosition}
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
          error={error}
        />
        <OutputSection 
          data={optimizedData} 
          isLoading={isOptimizing}
          isPro={isPro}
          onUnlock={() => setShowPayment(true)}
        />
      </div>
      
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard label="Impact Score" value="92/100" subValue="+14%" subColor="text-green-400" />
          <StatCard label="Action Verbs" value="12" icon={<Zap size={14} className="text-accent" />} />
          <StatCard label="Keywords" value="8" subValue="Target Match" />
          <StatCard label="Formatting" value="STAR" icon={<CheckCircle size={14} className="text-blue-400" />} />
      </div>

      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />}
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        config={aiConfig}
        onSave={(newConfig) => {
            setAiConfig(newConfig);
            // Optionally clear error when settings are updated
            if (error) setError(null);
        }}
      />
    </>
  );
};

const StatCard = ({ label, value, subValue, subColor = "text-gray-400", icon }: any) => (
    <div className="bg-surface border border-white/5 rounded-xl p-4 flex items-center justify-between">
        <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">{value}</span>
                {subValue && <span className={`text-xs ${subColor}`}>{subValue}</span>}
            </div>
        </div>
        {icon && <div className="bg-white/5 p-2 rounded-full">{icon}</div>}
    </div>
);

export default Editor;
