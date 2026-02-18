import React from 'react';
import { LayoutTemplate, History, FileText, User } from 'lucide-react';
import { clsx } from 'clsx';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="border-b border-white/10 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
            <LayoutTemplate size={18} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            ResumeBoost AI
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button 
            onClick={() => onNavigate('home')}
            className={clsx("transition-colors", currentPage === 'home' ? "text-white" : "hover:text-white")}
          >
            Editor
          </button>
          <button 
            onClick={() => onNavigate('admin')}
            className={clsx("transition-colors", currentPage === 'admin' ? "text-white" : "hover:text-white")}
          >
            Admin Dashboard
          </button>
          <a href="#" className="hover:text-white transition-colors">Templates</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors">
            <History size={16} />
            <span>History</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/50 text-sm hover:bg-accent/30 transition-colors">
            <FileText size={16} />
            <span>Export Resume</span>
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-accent">Pro Plan</div>
              <div className="text-sm font-medium text-white">Alex Chen</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-white/10">
               {/* Placeholder avatar */}
               <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <User size={16} className="text-gray-400" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
