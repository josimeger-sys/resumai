import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { optimizeResume } from '../services/ai';

export type Identity = 'intern' | 'campus' | 'experienced';

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  isVip: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  identity: Identity;
  rawExperience: string;
  targetPosition: string;
  result: string;
}

interface ResumeState {
  identity: Identity;
  rawExperience: string;
  targetPosition: string;
  result: string;
  isRefining: boolean;
  history: HistoryItem[];
  error: string | null;
  aiConfig: AIConfig;
  syncStatus: 'idle' | 'connected' | 'disconnected';
  jobDescription: string;
  
  // Auth
  token: string | null;
  user: User | null;

  setIdentity: (identity: Identity) => void;
  setRawExperience: (text: string) => void;
  setTargetPosition: (text: string) => void;
  setJobDescription: (text: string) => void;
  setResult: (text: string) => void;
  setAiConfig: (config: AIConfig) => void;
  setSyncStatus: (status: 'idle' | 'connected' | 'disconnected') => void;
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  loadHistoryItem: (item: HistoryItem) => void;
  refine: () => Promise<void>;
  clearError: () => void;
  
  // Auth Actions
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      identity: 'intern',
      rawExperience: '',
      targetPosition: '',
      jobDescription: '',
      result: '',
      isRefining: false,
      history: [],
      error: null,
      aiConfig: {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        baseUrl: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.deepseek.com',
        model: import.meta.env.VITE_OPENAI_MODEL || 'deepseek-chat'
      },
      syncStatus: 'idle',
      token: null,
      user: null,

      setIdentity: (identity) => set({ identity }),
      setRawExperience: (rawExperience) => set({ rawExperience }),
      setTargetPosition: (targetPosition) => set({ targetPosition }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setResult: (result) => set({ result }),
      setAiConfig: (aiConfig) => set({ aiConfig }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      
      login: (token, user) => {
          set({ 
              token, 
              user, 
              syncStatus: 'connected'
          });
      },

      logout: () => {
          set({ 
              token: null, 
              user: null, 
              syncStatus: 'disconnected'
          });
      },

      clearError: () => set({ error: null }),

      addToHistory: (item) => {
        const newItem = { ...item, id: crypto.randomUUID(), timestamp: Date.now() };
        
        set((state) => ({
          history: [
            newItem,
            ...state.history
          ].slice(0, 5) // Keep only last 5
        }));
      },

      clearHistory: () => set({ history: [] }),

      loadHistoryItem: (item) => set({
        identity: item.identity,
        rawExperience: item.rawExperience,
        targetPosition: item.targetPosition,
        result: item.result
      }),

      refine: async () => {
        const { identity, rawExperience, targetPosition, jobDescription, aiConfig, token } = get();
        
        // Require Login
        if (!token) {
            set({ error: '请先登录以使用优化功能' });
            return;
        }

        if (!rawExperience.trim()) return;

        set({ isRefining: true, result: '', error: null });

        try {
            const identityLabelMap: Record<Identity, string> = {
              intern: '实习',
              campus: '校招',
              experienced: '社招'
            };
            const targetRole = targetPosition || `${identityLabelMap[identity]} 产品经理`;
            
            const data = await optimizeResume(
                rawExperience, 
                targetRole,
                aiConfig.apiKey, 
                aiConfig.baseUrl, 
                aiConfig.model,
                jobDescription
            );
            
            if (!data.is_valid_experience) {
                set({ 
                    isRefining: false, 
                    error: data.invalid_reason || '输入内容似乎不是有效的项目/工作经历，请提供更详细的真实经历以便优化。'
                });
                return;
            }

            let markdownResult = `
### ${targetRole}（${identityLabelMap[identity]}）

**情境：**
${data.situation}

**任务：**
${data.task}

**行动：**
${data.action.map((action: string) => `- ${action}`).join('\n')}

**结果：**
${data.result}
            `.trim();

            if (data.alignment_analysis) {
                markdownResult += `\n\n### 岗位匹配分析\n${data.alignment_analysis}`;
            }

            set({ result: markdownResult, isRefining: false });
            
            get().addToHistory({
                identity,
                rawExperience,
                targetPosition,
                result: markdownResult
            });

            // Report usage to backend
            try {
                await fetch('/api/report-usage', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                });
            } catch (e) {
                console.error('Usage reporting failed', e);
            }
        } catch (error: any) {
            console.error('Refinement failed:', error);
            set({ 
                isRefining: false, 
                error: error.message || 'Failed to optimize. Please check your API settings.' 
            });
        }
      },
    }),
    {
      name: 'pm-resume-storage-v5', // Changed name to force complete reset of storage
      version: 1, 
      partialize: (state) => ({ 
        history: state.history,
        aiConfig: state.aiConfig,
        syncStatus: state.syncStatus,
        token: state.token,
        user: state.user
      }),
      migrate: (persistedState: any, version: number) => {
        return persistedState as ResumeState;
      }
    }
  )
);
