import React, { useState, useEffect } from 'react';
import { X, Check, QrCode, Scan, Loader2 } from 'lucide-react';
import { db } from '../../services/db';
import { useResumeStore } from '../../store/useResumeStore';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  isOpen?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess, isOpen = true }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [payUrl, setPayUrl] = useState('');
  const [polling, setPolling] = useState(false);
  const setVip = useResumeStore(state => state.setVip);

  if (!isOpen) return null;

  // Cleanup polling on unmount
  useEffect(() => {
    let interval: any;
    if (polling) {
        interval = setInterval(async () => {
            try {
                const res = await fetch('/api/query-pay-result', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: 'user_current' })
                });
                const data = await res.json();
                if (data.success && data.isPaid) {
                    setVip(true);
                    setPolling(false);
                    if (onSuccess) onSuccess();
                    onClose();
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [polling, onClose, onSuccess, setVip]);

  const handleCreateOrder = async () => {
    setIsPaying(true);
    try {
      const response = await fetch('/api/create-vip-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_current' })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
            // In a real app, you would generate a QR code from data.payParams.pay_url
            // Here we just show a visual indicator
            setPayUrl(data.payParams.pay_url);
            setPolling(true);
        } else {
             // Already VIP?
             if (data.message.includes('已是VIP')) {
                 setVip(true);
                 onClose();
             }
        }
      }
    } catch (error) {
      console.error('Order creation error:', error);
    } finally {
      setIsPaying(false);
    }
  };
  
  const handleSimulateScan = async () => {
      // DEBUG: Force success
      await fetch('/api/debug/simulate-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'user_current' })
      });
      // The polling effect will pick this up automatically
  };

  useEffect(() => {
      if (isOpen && !payUrl) {
          handleCreateOrder();
      }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border-4 border-fresh-border rounded-cartoon overflow-hidden shadow-cartoon-lg flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-fresh-text hover:text-black bg-white/50 hover:bg-white p-2 rounded-full transition-colors border-2 border-transparent hover:border-fresh-border"
        >
            <X size={20} />
        </button>

        {/* Left Side: Value Prop */}
        <div className="flex-1 bg-gradient-to-br from-fresh-bg to-primary/20 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                 <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-fresh-accent/20 rounded-full blur-[100px]"></div>
            </div>
            
            <div className="relative z-10 space-y-8">
                <div className="inline-block px-3 py-1 rounded-full bg-fresh-secondary border-2 border-fresh-border text-black text-xs font-bold tracking-wider shadow-cartoon-sm">
                    LIMITED TIME OFFER
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-fresh-text leading-tight">
                    Power Up Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-fresh-accent">Big Tech</span> Journey
                </h2>

                <div className="space-y-6">
                    <BenefitItem 
                        title="Unlock all optimizations" 
                        desc="Remove all limits on AI-driven sentence enhancements." 
                    />
                    <BenefitItem 
                        title="STAR framework reconstruction" 
                        desc="Automatically restructure bullets into Situation, Task, Action, Result." 
                    />
                    <BenefitItem 
                        title="Big Tech keyword alignment" 
                        desc="Sync with ATS algorithms used by Google, Meta, and ByteDance." 
                    />
                </div>

                <div className="pt-8 border-t-2 border-fresh-border/10">
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-4 font-bold">Trusted by candidates at</p>
                    <div className="flex flex-wrap gap-2">
                        {['GOOGLE', 'META', 'TENCENT', 'BYTEDANCE'].map(company => (
                            <span key={company} className="px-3 py-1.5 bg-white rounded-lg border-2 border-fresh-border text-[10px] text-fresh-text font-bold shadow-cartoon-sm">
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side: Checkout */}
        <div className="flex-1 bg-white p-8 md:p-12 flex flex-col items-center justify-center text-center">
             <h3 className="text-lg font-bold text-fresh-text mb-2">VIP 会员永久通行证</h3>
             <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-sm text-gray-500 font-bold">¥</span>
                <span className="text-5xl font-black text-fresh-text">99.0</span>
             </div>
             <p className="text-sm text-gray-500 mb-8 font-bold">一次付费，永久有效</p>

             <div className="w-full max-w-xs bg-gray-100 rounded-lg p-1 flex mb-8 border-2 border-fresh-border">
                <button className="flex-1 py-2 rounded-md bg-[#07C160] text-white text-sm font-bold shadow-sm flex items-center justify-center gap-2">
                    WeChat Pay
                </button>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-cartoon mb-8 relative group cursor-pointer border-2 border-fresh-border" onClick={handleSimulateScan}>
                <div className="w-48 h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {payUrl ? (
                        <QrCode size={160} className="text-black" />
                    ) : (
                        <div className="flex flex-col items-center">
                            <Loader2 size={32} className="animate-spin text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 font-bold">Generating QR...</span>
                        </div>
                    )}
                    
                    {/* Scan line animation if paying */}
                    {polling && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#07C160]/50 shadow-[0_0_10px_rgba(7,193,96,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    )}
                </div>
                
                {/* Hover overlay for simulation */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                        <Scan size={24} className="text-[#07C160]" />
                        <p className="text-sm font-bold text-gray-800">点击模拟手机扫码支付</p>
                    </div>
                </div>
             </div>

             <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-2">
                {polling ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-[#07C160] animate-pulse"></span>
                        请使用微信扫码支付...
                    </>
                ) : (
                    <span>正在创建订单...</span>
                )}
             </div>
             <p className="text-xs text-gray-400 font-bold">
                支持结果实时同步 <br />
                支付遇到问题？联系 <a href="#" className="text-primary hover:underline">客服支持</a>
             </p>
        </div>
      </div>
    </div>
  );
};

const BenefitItem = ({ title, desc }: any) => (
    <div className="flex gap-4">
        <div className="w-6 h-6 rounded-full bg-fresh-main flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-fresh-border shadow-cartoon-sm">
            <Check size={14} className="text-black" />
        </div>
        <div>
            <h4 className="text-sm font-black text-fresh-text mb-1">{title}</h4>
            <p className="text-xs text-gray-600 font-bold leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default PaymentModal;
