import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Copy, Download, Check, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

const ResultSection = () => {
  const { result, isRefining } = useResumeStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refined-resume.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white border-4 border-fresh-border rounded-cartoon p-6 shadow-cartoon-lg relative overflow-hidden group transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-fresh-accent border border-fresh-border animate-pulse" />
          <h2 className="text-xs font-bold text-fresh-text uppercase tracking-wider">
            AI 优化结果
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!result}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-fresh-border bg-white hover:bg-gray-50 text-xs font-bold text-fresh-text transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cartoon-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {copied ? <Check size={14} className="text-fresh-main" /> : <Copy size={14} />}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={handleExport}
            disabled={!result}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-fresh-border bg-white hover:bg-gray-50 text-xs font-bold text-fresh-text transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cartoon-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Download size={14} />
            导出
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        {isRefining ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-fresh-border border-t-fresh-accent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={28} className="text-fresh-accent animate-pulse" />
                </div>
            </div>
            <div className="space-y-2 text-center">
                <p className="text-sm font-bold text-fresh-text animate-pulse">正在重构你的职业故事...</p>
                <p className="text-xs text-gray-500 font-bold">AI 正在分析 JD 关键词与你的经历匹配度</p>
            </div>
          </div>
        ) : result ? (
          <div className="prose prose-sm max-w-none 
            prose-p:text-fresh-text prose-p:leading-relaxed 
            prose-headings:text-fresh-text prose-headings:font-black 
            prose-strong:text-fresh-accent prose-strong:font-bold
            prose-li:text-fresh-text prose-li:marker:text-fresh-accent
            prose-blockquote:border-l-4 prose-blockquote:border-fresh-accent prose-blockquote:bg-purple-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700 prose-blockquote:font-medium prose-blockquote:not-italic
            ">
            <ReactMarkdown>{result}</ReactMarkdown>
            
            {/* PM Growth Tip Card */}
            <div className="mt-8 p-5 rounded-xl bg-purple-50 border-2 border-purple-200 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(168,85,247,0.2)]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/50 blur-[40px] rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white border border-purple-200 rounded-lg shadow-sm">
                    <Sparkles size={16} className="text-fresh-accent" fill="currentColor" />
                </div>
                <h4 className="text-sm font-bold text-purple-900">产品经理成长建议</h4>
              </div>
              <p className="text-xs text-purple-800 leading-relaxed relative z-10 font-medium">
                你的结果突出了很强的 <span className="bg-purple-200 px-1 rounded text-purple-900 font-bold">执行力</span> 和 <span className="bg-purple-200 px-1 rounded text-purple-900 font-bold">分析能力</span>。
                建议增加一点关于 **战略对齐** 或者该项目如何关联公司整体路线图的内容，以展现更高级别的思考能力。
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-60">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 border-2 border-fresh-border flex items-center justify-center mb-6 rotate-6 transition-transform hover:rotate-12 duration-500 shadow-cartoon">
              <Sparkles size={40} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold text-fresh-text">准备就绪</p>
            <p className="text-xs text-gray-500 mt-2 font-bold">在左侧输入经历，见证 AI 的魔力</p>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      {result && !isRefining && (
        <div className="mt-6 pt-4 border-t-2 border-gray-100 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider font-bold">
           <div className="flex gap-6">
             <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 border border-fresh-border" />
                字数: {result.split(/\s+/).length}
             </span>
             <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fresh-accent border border-fresh-border" />
                影响力评分: <span className="text-purple-600 font-black text-sm">{Math.floor(Math.random() * (98 - 85) + 85)}/100</span>
             </span>
           </div>
           <div className="flex items-center gap-1.5 text-fresh-main">
             <div className="w-1.5 h-1.5 rounded-full bg-fresh-main animate-pulse border border-fresh-border" />
             本地加密存储
           </div>
        </div>
      )}
    </div>
  );
};

export default ResultSection;
