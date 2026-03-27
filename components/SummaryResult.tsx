'use client';

import React, { useState } from 'react';
import { AlignLeft, List, Key, Sparkles, Star } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

interface SummaryResultProps {
  shortSummary: string;
  bulletPoints: string[];
  keywords: string[];
}

export function SummaryResult({ shortSummary, bulletPoints, keywords }: SummaryResultProps) {
  const [activeTab, setActiveTab] = useState<'bullets' | 'short' | 'keywords'>('bullets');

  return (
    <div className="bg-white border-2 border-orange-50/50 rounded-[3rem] shadow-2xl shadow-orange-500/5 overflow-hidden transition-all hover:border-orange-100">
      
      {/* Tabs Header */}
      <div className="flex border-b-2 border-orange-50">
        <button
          onClick={() => setActiveTab('bullets')}
          className={`flex-1 py-5 px-2 text-sm font-black flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'bullets' ? 'text-orange-600 bg-orange-50/30' : 'text-gray-400 hover:text-gray-600 hover:bg-orange-50/10'
          }`}
        >
          <List size={18} /> <span className="hidden sm:inline">Ý chính</span>
          {activeTab === 'bullets' && <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-500 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('short')}
          className={`flex-1 py-5 px-2 text-sm font-black flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'short' ? 'text-orange-600 bg-orange-50/30' : 'text-gray-400 hover:text-gray-600 hover:bg-orange-50/10'
          }`}
        >
          <AlignLeft size={18} /> <span className="hidden sm:inline">Tổng quan</span>
          {activeTab === 'short' && <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-500 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex-1 py-5 px-2 text-sm font-black flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'keywords' ? 'text-orange-600 bg-orange-50/30' : 'text-gray-400 hover:text-gray-600 hover:bg-orange-50/10'
          }`}
        >
          <Key size={18} /> <span className="hidden sm:inline">Từ khóa</span>
          {activeTab === 'keywords' && <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-500 rounded-t-full" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-12">
        {activeTab === 'bullets' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-5 group">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:rotate-6">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <MarkdownContent className="text-gray-700 font-bold leading-relaxed">{point}</MarkdownContent>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'short' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="relative p-8 md:p-10 bg-orange-50/50 rounded-[2.5rem] border-2 border-orange-50 shadow-inner group">
              <Sparkles className="absolute top-6 right-6 text-orange-200" size={32} />
              <div className="prose prose-lg max-w-none text-orange-950 italic leading-relaxed font-bold font-serif">
                "{shortSummary}"
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest">
                <Star size={12} fill="currentColor" /> Tóm tắt bởi Nebula AI
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
            {keywords.map((kw, idx) => (
              <span key={idx} className="px-5 py-3 bg-white text-orange-700 border-2 border-orange-50 hover:border-orange-200 rounded-2xl text-sm font-black shadow-sm transition-all hover:-translate-y-1 hover:shadow-orange-500/5">
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
