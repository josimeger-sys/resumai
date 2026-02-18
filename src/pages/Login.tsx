import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cloud, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useResumeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('connecting');
    setErrorMessage('');

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
                // Redirect to where they came from, or home
                const from = (location.state as any)?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                setStatus('success');
                setErrorMessage('注册成功，请登录');
                setIsLoginMode(true);
                setStatus('idle');
                setPassword('');
            }
        } else {
            setStatus('error');
            setErrorMessage(data.message || '操作失败');
        }
    } catch (error) {
        setStatus('error');
        setErrorMessage('网络请求失败，请检查服务是否启动');
    }
  };

  return (
    <div className="min-h-screen bg-fresh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20"
           style={{
             backgroundImage: 'radial-gradient(circle, #38BDF8 2px, transparent 2.5px)',
             backgroundSize: '32px 32px'
           }}
      />

      <div className="w-full max-w-md bg-white border-4 border-fresh-border rounded-cartoon shadow-cartoon-lg p-8 relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-fresh-secondary rounded-2xl border-2 border-fresh-border shadow-cartoon mb-4">
                <Sparkles size={32} className="text-black" />
            </div>
            <h1 className="text-2xl font-black text-fresh-text mb-2">
                欢迎使用 Resum<span className="text-purple-600">Ai</span>
            </h1>
            <p className="text-sm text-gray-500 font-bold">
                {isLoginMode ? '登录以开始优化您的简历' : '创建一个新账号'}
            </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-fresh-text block mb-1.5 ml-1">用户名</label>
                <input 
                    type="text" 
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-white border-2 border-fresh-border rounded-xl p-3.5 text-sm text-fresh-text focus:shadow-cartoon focus:outline-none transition-all placeholder:text-gray-400"
                    placeholder="请输入用户名"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-fresh-text block mb-1.5 ml-1">密码</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-white border-2 border-fresh-border rounded-xl p-3.5 text-sm text-fresh-text focus:shadow-cartoon focus:outline-none transition-all placeholder:text-gray-400"
                    placeholder="请输入密码"
                />
            </div>

            {errorMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold shadow-cartoon animate-in fade-in slide-in-from-top-1 ${
                    status === 'success' ? 'bg-green-50 border-2 border-green-500 text-green-600' : 'bg-red-50 border-2 border-red-500 text-red-600'
                }`}>
                    {errorMessage}
                </div>
            )}

            <button 
                type="submit"
                disabled={status === 'connecting'}
                className="w-full py-3.5 bg-primary text-white font-black rounded-xl border-2 border-fresh-border hover:bg-sky-400 transition-all disabled:opacity-50 mt-2 shadow-cartoon hover:shadow-cartoon-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 group"
            >
                {status === 'connecting' ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        处理中...
                    </>
                ) : (
                    <>
                        {isLoginMode ? '登录' : '注册'}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setErrorMessage('');
                    setUsername('');
                    setPassword('');
                }}
                className="text-xs font-bold text-gray-500 hover:text-fresh-text transition-colors underline decoration-2 decoration-transparent hover:decoration-fresh-accent underline-offset-4"
            >
                {isLoginMode ? '还没有账号？点击注册' : '已有账号？点击登录'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
