import React, { useState, useEffect } from 'react';
import { X, Cloud, Check, Loader2 } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { syncStatus, login, logout } = useResumeStore();

  const handleAuth = async () => {
      setStatus('connecting');
      setErrorMessage('');
      
      if (!username || !password) {
          setStatus('error');
          setErrorMessage('请输入账号和密码');
          return;
      }

      try {
          const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
          const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
          });

          const data = await res.json();

          if (data.success) {
              if (isLoginMode) {
                  login(data.accessToken, data.user);
                  setStatus('success');
                  setTimeout(() => {
                      onClose();
                      setStatus('idle');
                  }, 1500);
              } else {
                  // Auto login after register? Or ask to login?
                  // Let's auto login if backend supports it, but currently register only returns success
                  // So we switch to login mode or just notify success
                  setStatus('success');
                  setErrorMessage('注册成功，请登录'); // Re-use error message area for success or switch mode
                  setIsLoginMode(true);
                  setStatus('idle');
                  setPassword(''); 
              }
          } else {
              setStatus('error');
              setErrorMessage(data.message || '操作失败');
          }
      } catch (e) {
          setStatus('error');
          setErrorMessage('网络请求失败，请检查服务是否启动');
      }
    };

  const handleLogout = () => {
      logout();
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-fresh-border rounded-cartoon w-full max-w-md shadow-cartoon-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-fresh-text hover:bg-gray-100 rounded-lg p-1 transition-colors border-2 border-transparent hover:border-fresh-border"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-black text-fresh-text mb-2 flex items-center gap-2">
            <Cloud size={24} className="text-primary" />
            {isLoginMode ? '账号登录' : '创建账号'}
        </h2>
        <p className="text-sm text-gray-500 font-bold mb-6">
            数据将安全存储在云端数据库中。
        </p>

        {syncStatus === 'connected' ? (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-fresh-main/20 border-2 border-fresh-border rounded-full flex items-center justify-center mx-auto mb-4 text-fresh-main shadow-cartoon">
                    <Check size={32} />
                </div>
                <h3 className="text-lg font-black text-fresh-text mb-2">已连接</h3>
                <p className="text-sm text-gray-500 font-bold mb-6">您已成功登录。</p>
                <button 
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-50 text-red-600 border-2 border-fresh-border rounded-xl font-bold hover:bg-red-100 transition-colors shadow-cartoon hover:shadow-cartoon-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    退出登录
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex bg-gray-50 border-2 border-fresh-border p-1 rounded-xl mb-4 gap-1">
                    <button 
                        onClick={() => { setIsLoginMode(true); setErrorMessage(''); }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-2 ${isLoginMode ? 'bg-white text-fresh-text border-fresh-border shadow-cartoon-sm' : 'text-gray-500 border-transparent hover:text-fresh-text'}`}
                    >
                        登录
                    </button>
                    <button 
                        onClick={() => { setIsLoginMode(false); setErrorMessage(''); }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-2 ${!isLoginMode ? 'bg-white text-fresh-text border-fresh-border shadow-cartoon-sm' : 'text-gray-500 border-transparent hover:text-fresh-text'}`}
                    >
                        注册
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-fresh-text block mb-1 ml-1">用户名 / 账号</label>
                        <input 
                            type="text" 
                            placeholder="请输入用户名"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-white border-2 border-fresh-border rounded-xl p-3 text-sm text-fresh-text focus:shadow-cartoon focus:outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-fresh-text block mb-1 ml-1">密码</label>
                        <input 
                            type="password" 
                            placeholder="请输入密码"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-white border-2 border-fresh-border rounded-xl p-3 text-sm text-fresh-text focus:shadow-cartoon focus:outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleAuth}
                    disabled={status === 'connecting'}
                    className="w-full py-3 bg-primary text-white font-black rounded-xl border-2 border-fresh-border hover:bg-sky-400 transition-all disabled:opacity-50 mt-4 shadow-cartoon hover:shadow-cartoon-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
                >
                    {status === 'connecting' && <Loader2 size={18} className="animate-spin" />}
                    {status === 'connecting' ? '处理中...' : (isLoginMode ? '登录' : '创建账号')}
                </button>

                {errorMessage && (
                    <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs text-red-600 font-bold shadow-cartoon animate-in fade-in slide-in-from-top-1">
                        {errorMessage}
                    </div>
                )}
                
                {status === 'success' && !isLoginMode && (
                     <div className="p-3 bg-green-50 border-2 border-green-500 rounded-xl text-xs text-green-600 font-bold shadow-cartoon animate-in fade-in slide-in-from-top-1">
                        注册成功！请切换到登录页进行登录。
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SyncModal;
