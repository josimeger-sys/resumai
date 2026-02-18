import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('pm-resume-storage') || '{}').state?.token}`
        },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setError('密码错误，请重试');
      }
    } catch (err) {
      setError('验证失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-fresh-border rounded-cartoon w-full max-w-sm shadow-cartoon-lg p-6 relative">
        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-fresh-border flex items-center justify-center mx-auto mb-3 shadow-cartoon-sm">
                <Lock size={24} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-black text-fresh-text">管理员身份验证</h2>
            <p className="text-xs text-gray-500 font-bold mt-1">请输入管理员密码以继续访问后台</p>
        </div>

        <form onSubmit={handleSubmit}>
            <input 
                type="password" 
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full bg-white border-2 border-fresh-border rounded-xl p-3 text-sm text-center font-bold tracking-widest mb-4 focus:shadow-cartoon focus:outline-none transition-all"
            />
            
            {error && (
                <div className="text-red-500 text-xs font-black text-center mb-4 animate-pulse">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button 
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl border-2 border-transparent hover:border-gray-300 transition-all"
                >
                    取消
                </button>
                <button 
                    type="submit"
                    disabled={loading || !password}
                    className="flex-1 py-2 bg-fresh-main text-black font-black rounded-xl border-2 border-fresh-border hover:bg-fresh-accent hover:text-white transition-all shadow-cartoon active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : '确认'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthModal;
