import React, { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (config: AIConfig) => void;
}

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [formData, setFormData] = useState<AIConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-fresh-border rounded-cartoon w-full max-w-md shadow-cartoon-lg animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-fresh-border">
          <div className="flex items-center gap-3 text-fresh-text">
            <div className="p-2 bg-fresh-main border-2 border-fresh-border rounded-xl text-black shadow-cartoon-sm">
              <Settings size={20} />
            </div>
            <h2 className="text-lg font-black">AI Configuration</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-fresh-text transition-colors p-1 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-fresh-border"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              API Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setFormData({
                        ...formData,
                        baseUrl: 'https://api.openai.com/v1',
                        model: 'gpt-3.5-turbo'
                    })}
                    className={`p-2 rounded-xl border-2 text-sm font-bold transition-all shadow-cartoon-sm ${
                        formData.baseUrl.includes('openai.com') 
                        ? 'bg-primary text-white border-fresh-border' 
                        : 'bg-white border-fresh-border text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    OpenAI
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({
                        ...formData,
                        baseUrl: 'https://api.deepseek.com/v1',
                        model: 'deepseek-chat'
                    })}
                    className={`p-2 rounded-xl border-2 text-sm font-bold transition-all shadow-cartoon-sm ${
                        formData.baseUrl.includes('deepseek.com') 
                        ? 'bg-primary text-white border-fresh-border' 
                        : 'bg-white border-fresh-border text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    DeepSeek
                </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Base URL
            </label>
            <input
              type="text"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              placeholder="https://api.openai.com/v1"
              className="w-full bg-white border-2 border-fresh-border rounded-xl px-4 py-3 text-fresh-text placeholder-gray-400 focus:outline-none focus:shadow-cartoon transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              API Key
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full bg-white border-2 border-fresh-border rounded-xl px-4 py-3 text-fresh-text placeholder-gray-400 focus:outline-none focus:shadow-cartoon transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Model Name
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="gpt-3.5-turbo"
              className="w-full bg-white border-2 border-fresh-border rounded-xl px-4 py-3 text-fresh-text placeholder-gray-400 focus:outline-none focus:shadow-cartoon transition-all text-sm font-medium"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-fresh-secondary border-2 border-fresh-border text-black font-black shadow-cartoon hover:shadow-cartoon-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
