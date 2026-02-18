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
  usageCount: number;
  isVip: boolean;
  isPaymentModalOpen: boolean;
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
  incrementUsage: () => void;
  setVip: (isVip: boolean) => void;
  setPaymentModalOpen: (isOpen: boolean) => void;
  checkVipStatus: () => Promise<void>;
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
      usageCount: 0,
      isVip: false,
      isPaymentModalOpen: false,
      token: null,
      user: null,

      setIdentity: (identity) => set({ identity }),
      setRawExperience: (rawExperience) => set({ rawExperience }),
      setTargetPosition: (targetPosition) => set({ targetPosition }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setResult: (result) => set({ result }),
      setAiConfig: (aiConfig) => set({ aiConfig }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      incrementUsage: () => set((state) => ({ usageCount: state.usageCount + 1 })),
      setVip: (isVip) => set({ isVip }),
      setPaymentModalOpen: (isOpen) => set({ isPaymentModalOpen: isOpen }),
      
      login: (token, user) => {
          set({ 
              token, 
              user, 
              syncStatus: 'connected',
              isVip: user.isVip 
          });
      },

      logout: () => {
          set({ 
              token: null, 
              user: null, 
              syncStatus: 'disconnected',
              isVip: false
          });
      },

      checkVipStatus: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ 
                user: data.user,
                // Update VIP status based on backend logic (currently using role)
                isVip: data.user.role === 'admin'
            });
          } else {
              // Token invalid
              get().logout();
          }
        } catch (error) {
          console.error('Failed to check auth status:', error);
        }
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
                identity,
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
      name: 'pm-resume-storage',
      version: 2,
      partialize: (state) => ({ 
        history: state.history,
        aiConfig: state.aiConfig,
        syncStatus: state.syncStatus,
        usageCount: state.usageCount,
        isVip: state.isVip,
        token: state.token,
        user: state.user
      }),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
            // migration from version 0 to 1
            return {
                ...persistedState,
                // add new fields if needed
            };
        }
        if (version === 1) {
             // migration from version 1 to 2
             return {
                 ...persistedState,
                 token: null,
                 user: null,
                 syncStatus: 'idle'
             }
        }
        return persistedState as ResumeState;
      }
    }
  )
);
