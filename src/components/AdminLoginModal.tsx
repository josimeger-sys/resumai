import React, { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useNavigate } from 'react-router-dom';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useResumeStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('connecting');
    setErrorMessage('');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            // Check if user is admin
            if (data.user.role !== 'admin') {
                setStatus('error');
                setErrorMessage('该账号没有管理员权限');
                return;
            }

            login(data.accessToken, data.user);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setUsername('');
                setPassword('');
                navigate('/admin'); // Redirect to admin dashboard
            }, 1000);
        } else {
            setStatus('error');
            setErrorMessage(data.message || '登录失败');
        }
    } catch (e) {
        setStatus('error');
        setErrorMessage('网络请求失败，请检查服务是否启动');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-fresh-border rounded-cartoon w-full max-w-sm shadow-cartoon-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full border-2 border-fresh-border flex items-center justify-center mx-auto mb-3 shadow-cartoon-sm text-white">
                <ShieldCheck size={24} />
            </div>
            <h2 className="text-lg font-black text-fresh-text">管理员入口</h2>
            <p className="text-xs text-gray-500 font-bold mt-1">请输入管理员账号和密码</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
            <div>
                <input 
                    type="text" 
                    placeholder="管理员账号"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full bg-white border-2 border-fresh-border rounded-xl p-3 text-sm font-bold placeholder:font-normal focus:shadow-cartoon focus:outline-none transition-all"
                />
            </div>
            <div>
                <input 
                    type="password" 
                    placeholder="管理员密码"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-white border-2 border-fresh-border rounded-xl p-3 text-sm font-bold placeholder:font-normal focus:shadow-cartoon focus:outline-none transition-all"
                />
            </div>
            
            {errorMessage && (
                <div className="text-red-500 text-xs font-black text-center animate-pulse">
                    {errorMessage}
                </div>
            )}

            <button 
                type="submit"
                disabled={status === 'connecting'}
                className="w-full py-2.5 bg-gray-900 text-white font-black rounded-xl border-2 border-fresh-border hover:bg-black transition-all shadow-cartoon active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
                {status === 'connecting' ? <Loader2 size={16} className="animate-spin" /> : '进入后台'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
