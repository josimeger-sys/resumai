import React, { useState } from 'react';
import { Database, Zap, Cloud, LayoutDashboard, Shield, Settings } from 'lucide-react';
import SyncModal from './SyncModal';
import AdminLoginModal from './AdminLoginModal';
import SettingsModal from './SettingsModal';
import { useResumeStore } from '../store/useResumeStore';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { syncStatus, user, aiConfig, setAiConfig } = useResumeStore();

  return (
    <>
      <header className="flex items-center justify-between py-6 px-1 mb-4">
        <div className="flex items-center gap-3">
          {/* ... Logo ... */}
          <div className="relative group">
            <div className="relative w-12 h-12 bg-fresh-secondary rounded-xl border-2 border-fresh-border flex items-center justify-center text-black shadow-cartoon group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-cartoon-sm transition-all">
              <Zap size={24} fill="currentColor" className="text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black flex items-center gap-1 italic" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
              Resum<span className="text-purple-600">Ai</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest -mt-1 ml-0.5 bg-fresh-text text-white px-1 inline-block transform -rotate-2">
              AI Career Assistant
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Admin Entry - Always visible */}
            <button 
                onClick={() => user?.role === 'admin' ? null : setIsAdminLoginOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-transparent hover:bg-gray-100 transition-all duration-300 text-gray-400 hover:text-gray-900 ${user?.role === 'admin' ? 'hidden' : ''}`}
                title="管理员入口"
            >
                <Shield size={16} />
            </button>

            {/* AI Settings - Always visible */}
            <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-transparent hover:bg-gray-100 transition-all duration-300 text-gray-400 hover:text-gray-900"
                title="AI设置"
            >
                <Settings size={16} />
            </button>

            {/* Admin Dashboard Link - Only visible if user is ALREADY admin */}
            {user?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-fresh-border bg-white text-black hover:bg-gray-50 transition-all duration-300 hover:shadow-cartoon-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-cartoon">
                    <LayoutDashboard size={16} />
                    <span className="text-xs font-black tracking-wide uppercase hidden sm:inline">管理后台</span>
                </Link>
            )}

            <button 
            onClick={() => setIsSyncModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-fresh-border transition-all duration-300 hover:shadow-cartoon-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-cartoon ${
                syncStatus === 'connected' 
                ? 'bg-fresh-main text-black' 
                : 'bg-white text-black hover:bg-gray-50'
            }`}
            >
            {syncStatus === 'connected' ? (
                <div className="relative w-3 h-3">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                    <div className="relative w-3 h-3 bg-white border border-fresh-border rounded-full" />
                </div>
            ) : (
                <Cloud size={16} />
            )}
            <span className="text-xs font-black tracking-wide uppercase">
                {syncStatus === 'connected' ? '已同步' : '登录 / 同步'}
            </span>
            </button>
        </div>
      </header>

      <SyncModal 
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={aiConfig}
        onSave={setAiConfig}
      />
    </>
  );
};

export default Header;
