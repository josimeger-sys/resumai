import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-white/10 mt-12 bg-surface/50">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ResumeBoost AI. All rights reserved.</p>
        <p className="mt-2 text-xs">
          ResumeBoost AI uses advanced STAR framework analysis to optimize your resume. 
          Your data is secure and private.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
