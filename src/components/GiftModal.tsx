import React, { useState } from 'react';
import { X, Coffee, Zap, Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GiftOption {
  id: string;
  price: number;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<GiftOption | null>(null);

  if (!isOpen) return null;

  const giftOptions: GiftOption[] = [
    {
      id: 'coffee',
      price: 1,
      label: '小杯咖啡',
      icon: <Coffee size={24} />,
      description: '为一次编码提供能量',
      color: 'bg-orange-300'
    },
    {
      id: 'energy',
      price: 3,
      label: '能量饮料',
      icon: <Zap size={24} />,
      description: '保持服务器快速运行',
      color: 'bg-primary'
    },
    {
      id: 'love',
      price: 5,
      label: '满满爱心',
      icon: <Heart size={24} />,
      description: '支持未来开发',
      color: 'bg-fresh-pink'
    },
    {
      id: 'super_love',
      price: 7,
      label: '超级爱心',
      icon: <Heart size={24} fill="currentColor" />,
      description: '你太棒了！',
      color: 'bg-fresh-accent'
    }
  ];

  const handleSupport = (option: GiftOption) => {
    setSelectedOption(option);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-fresh-border rounded-cartoon w-full max-w-lg shadow-cartoon-lg relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-fresh-border relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fresh-main border-2 border-fresh-border rounded-xl text-black shadow-cartoon-sm">
              <Coffee size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-fresh-text">微信支付支持</h2>
              <p className="text-xs text-gray-500 font-bold">扫描二维码进行支持</p>
            </div>
          </div>
          <button 
            onClick={() => {
                onClose();
                setSelectedOption(null);
            }}
            className="p-2 text-fresh-text hover:bg-gray-100 rounded-lg transition-colors border-2 border-transparent hover:border-fresh-border"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10 overflow-y-auto">
          {!selectedOption ? (
            <>
                <p className="text-fresh-text font-bold text-sm mb-6 text-center leading-relaxed">
                    如果您觉得这个工具对您的职业生涯有帮助，请考虑支持它的开发。
                    您的贡献将帮助保持服务器运行和 AI 持续优化！
                </p>

                <div className="grid gap-4">
                    {giftOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSupport(option)}
                        className="group relative flex items-center gap-4 p-4 rounded-xl border-2 border-fresh-border bg-white hover:bg-fresh-bg transition-all hover:shadow-cartoon active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <div className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center text-black border-2 border-fresh-border shadow-cartoon-sm",
                        option.color
                        )}>
                        {option.icon}
                        </div>
                        <div className="flex-1 text-left">
                        <h3 className="font-black text-fresh-text group-hover:text-primary transition-colors">
                            {option.label}
                        </h3>
                        <p className="text-xs text-gray-500 font-bold">{option.description}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-fresh-secondary border-2 border-fresh-border text-black font-mono font-bold group-hover:bg-yellow-300 transition-colors shadow-cartoon-sm">
                        ¥{option.price}
                        </div>
                    </button>
                    ))}
                </div>
            </>
          ) : (
            <div className="flex flex-col items-center animate-in slide-in-from-right duration-300">
                <div className="mb-4 text-center">
                    <p className="text-gray-500 font-bold text-sm">微信扫码支付</p>
                    <div className="text-3xl font-black text-fresh-text mt-2">¥{selectedOption.price}</div>
                    <div className="text-sm text-primary font-bold mt-1">{selectedOption.label}</div>
                </div>
                
                <div className="bg-white p-4 rounded-xl mb-6 border-2 border-fresh-border shadow-cartoon">
                    <img src="/wechat.jpg" alt="WeChat Pay QR" className="w-48 h-48 object-cover" />
                </div>

                <button 
                    onClick={() => setSelectedOption(null)}
                    className="text-sm text-gray-500 font-bold hover:text-fresh-text underline"
                >
                    返回选项
                </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              安全支付 • 微信支付
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;
