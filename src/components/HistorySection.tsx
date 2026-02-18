import React, { useState } from 'react';
import { useResumeStore, HistoryItem } from '../store/useResumeStore';
import { Trash2, History, ArrowRight, Lock, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { clsx } from 'clsx';
import SyncModal from './SyncModal';

const HistorySection = () => {
  const { history, clearHistory, loadHistoryItem, syncStatus } = useResumeStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // If not logged in (synced), show login prompt instead of history
  if (syncStatus !== 'connected') {
      return (
          <>
            <div className="flex flex-col h-full bg-white border-4 border-fresh-border rounded-cartoon p-6 shadow-cartoon-lg overflow-hidden relative group transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <History size={16} className="text-primary" />
                    <h2 className="text-xs font-bold text-fresh-text uppercase tracking-wider">
                        历史记录
                    </h2>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gray-50 border-2 border-fresh-border rounded-2xl flex items-center justify-center mb-2 rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-cartoon">
                            <Lock size={24} className="text-fresh-text" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary border border-fresh-border rounded-full flex items-center justify-center animate-bounce delay-1000">
                            <span className="text-[10px] font-bold text-white">!</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-fresh-text mb-2">需要登录</h3>
                        <p className="text-xs text-gray-500 font-bold max-w-[200px] mx-auto leading-relaxed">
                            请登录或注册账号以查看和同步您的历史记录。
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white border-2 border-fresh-border rounded-xl text-xs font-bold hover:bg-blue-400 transition-all shadow-cartoon hover:shadow-cartoon-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <LogIn size={14} />
                        登录 / 注册
                    </button>
                </div>
            </div>

            <SyncModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
          </>
      );
  }

  return (
    <div className="flex flex-col h-full bg-white border-4 border-fresh-border rounded-cartoon p-6 shadow-cartoon-lg overflow-hidden group transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <History size={16} className="text-primary" />
          <h2 className="text-xs font-bold text-fresh-text uppercase tracking-wider">
            云端历史记录
          </h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-[10px] text-gray-500 hover:text-red-500 font-bold transition-colors flex items-center gap-1 bg-gray-50 border border-fresh-border px-2 py-1 rounded-md shadow-cartoon-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Trash2 size={10} />
            清空
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
            <div className="w-16 h-16 bg-gray-50 border-2 border-fresh-border rounded-full flex items-center justify-center mb-4 shadow-cartoon">
                <History size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-500">暂无历史记录</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => loadHistoryItem(item)}
              className="group/item p-4 rounded-xl bg-white border-2 border-fresh-border hover:bg-fresh-bg cursor-pointer transition-all duration-300 hover:translate-x-1 shadow-cartoon hover:shadow-cartoon-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-fresh-text line-clamp-1 group-hover/item:text-primary transition-colors">
                  {item.targetPosition || "未命名职位"}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap ml-2 bg-gray-50 px-1.5 py-0.5 rounded border border-fresh-border">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: zhCN }).replace('about ', '')}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed group-hover/item:text-gray-500">
                {item.rawExperience.slice(0, 80)}...
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySection;
