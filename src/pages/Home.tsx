import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import HistorySection from '../components/HistorySection';
import ResultSection from '../components/ResultSection';
import GiftModal from '../components/GiftModal';
import { Edit3, History, Coffee, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

function Home() {
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'result' | 'history'>('input');
  
  // Detect mobile view to adjust layout
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-fresh-bg text-fresh-text selection:bg-fresh-secondary selection:text-black overflow-hidden flex flex-col font-sans relative">
      {/* Background Effects - Fresh Cartoon Style Pattern */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20"
           style={{
             backgroundImage: 'radial-gradient(circle, #38BDF8 2px, transparent 2.5px)',
             backgroundSize: '32px 32px'
           }}
      />
      
      <div className="container mx-auto px-4 h-screen flex flex-col py-4 max-w-[1600px] relative z-10">
        <Header />
        
        {/* Desktop Layout */}
        <main className="hidden lg:grid flex-1 grid-cols-12 gap-6 min-h-0 pb-4">
          {/* Left Column */}
          <div className="col-span-4 flex flex-col gap-6 min-h-0">
            {/* Input Section - Takes remaining space */}
            <div className="flex-[3] min-h-0 flex flex-col">
              <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-8 h-8 bg-fresh-main rounded-lg border-2 border-fresh-border flex items-center justify-center shadow-cartoon-sm">
                    <Edit3 size={16} className="text-black" />
                  </div>
                  <h2 className="text-lg font-black text-fresh-text uppercase tracking-wider">输入信息</h2>
              </div>
              <InputSection />
            </div>
            
            {/* History Section - Takes less space */}
            <div className="flex-[2] min-h-0 flex flex-col">
               <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-8 h-8 bg-primary rounded-lg border-2 border-fresh-border flex items-center justify-center shadow-cartoon-sm">
                    <History size={16} className="text-white" />
                  </div>
                  <h2 className="text-lg font-black text-fresh-text uppercase tracking-wider">历史记录</h2>
              </div>
              <HistorySection />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-span-8 min-h-0 flex flex-col">
             <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-8 h-8 bg-fresh-accent rounded-lg border-2 border-fresh-border flex items-center justify-center shadow-cartoon-sm">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <h2 className="text-lg font-black text-fresh-text uppercase tracking-wider">AI 优化结果</h2>
              </div>
            <ResultSection />
          </div>
        </main>

        {/* Mobile Layout */}
        <main className="lg:hidden flex-1 flex flex-col min-h-0 pb-20 overflow-hidden relative">
           <div className={clsx("absolute inset-0 flex flex-col transition-all duration-300 px-1", activeTab === 'input' ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4')}>
             <InputSection />
           </div>
           <div className={clsx("absolute inset-0 flex flex-col transition-all duration-300 px-1", activeTab === 'result' ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 pointer-events-none translate-x-4')}>
             <ResultSection />
           </div>
           <div className={clsx("absolute inset-0 flex flex-col transition-all duration-300 px-1", activeTab === 'history' ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 pointer-events-none translate-x-4')}>
             <HistorySection />
           </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-white border-4 border-fresh-border rounded-2xl shadow-cartoon-lg px-2 py-3 flex justify-around items-center z-50">
           <button 
             onClick={() => setActiveTab('input')} 
             className={clsx("flex flex-col items-center gap-1 transition-all duration-300 px-4 py-1 rounded-xl", activeTab === 'input' ? 'text-black bg-fresh-main border-2 border-fresh-border shadow-cartoon-sm' : 'text-gray-500 hover:text-black')}
           >
             <Edit3 size={20} />
             <span className="text-[10px] font-bold uppercase tracking-wider">编辑</span>
           </button>
           <button 
             onClick={() => setActiveTab('result')} 
             className={clsx("flex flex-col items-center gap-1 transition-all duration-300 px-4 py-1 rounded-xl", activeTab === 'result' ? 'text-white bg-fresh-accent border-2 border-fresh-border shadow-cartoon-sm' : 'text-gray-500 hover:text-black')}
           >
             <Sparkles size={20} />
             <span className="text-[10px] font-bold uppercase tracking-wider">结果</span>
           </button>
           <button 
             onClick={() => setActiveTab('history')} 
             className={clsx("flex flex-col items-center gap-1 transition-all duration-300 px-4 py-1 rounded-xl", activeTab === 'history' ? 'text-white bg-primary border-2 border-fresh-border shadow-cartoon-sm' : 'text-gray-500 hover:text-black')}
           >
             <History size={20} />
             <span className="text-[10px] font-bold uppercase tracking-wider">历史</span>
           </button>
           <button 
             onClick={() => setIsGiftModalOpen(true)} 
             className={clsx("flex flex-col items-center gap-1 transition-colors text-gray-500 hover:text-fresh-secondary px-4 py-1")}
           >
             <Coffee size={20} />
             <span className="text-[10px] font-bold uppercase tracking-wider">支持</span>
           </button>
        </nav>

        <footer className="hidden lg:flex text-center py-2 text-[10px] text-gray-500 justify-center gap-4 font-bold">
          <button 
            onClick={() => setIsGiftModalOpen(true)}
            className="hover:text-fresh-main transition-colors cursor-pointer flex items-center gap-1"
          >
            <Coffee size={12} />
            Buy Me a Coffee
          </button>
          <span>•</span>
          <span>Made for PMs by PMs</span>
        </footer>
      </div>

      <GiftModal 
        isOpen={isGiftModalOpen} 
        onClose={() => setIsGiftModalOpen(false)} 
      />
    </div>
  );
}

export default Home;
