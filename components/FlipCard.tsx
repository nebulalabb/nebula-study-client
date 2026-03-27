'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { RefreshCw } from 'lucide-react';

interface FlipCardProps {
  front: string;
  back: string;
  hint?: string;
  width?: string;
  height?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlipCard({ front, back, hint, width = 'w-full max-w-2xl mx-auto', height = 'h-80', onFlip }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const nextState = !isFlipped;
    setIsFlipped(nextState);
    if (onFlip) onFlip(nextState);
  };

  return (
    <div className={`relative perspective-1000 ${width} ${height} cursor-pointer group`} onClick={handleFlip}>
      <div className={`w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-orange-100/50 dark:border-orange-900/20 shadow-xl p-8 flex flex-col hover:border-orange-300 dark:hover:border-orange-800 transition-all duration-300">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="prose prose-lg dark:prose-invert max-w-none font-bold text-gray-800 dark:text-zinc-200">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {front}
              </ReactMarkdown>
            </div>
          </div>
          <div className="mt-auto pt-4 flex items-center justify-between text-gray-400 dark:text-zinc-500">
            {hint ? (
              <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-4 py-2 rounded-full font-bold">💡 Gợi ý: {hint}</span>
            ) : <span />}
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">Nhấn để lật <RefreshCw size={12} /></span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/10 dark:to-rose-900/10 rounded-[2.5rem] border-2 border-orange-200 dark:border-orange-900/40 shadow-2xl shadow-orange-500/10 p-8 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="prose prose-lg dark:prose-invert max-w-none font-bold text-orange-900 dark:text-orange-100">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {back}
              </ReactMarkdown>
            </div>
          </div>
          <div className="mt-auto pt-4 text-center text-orange-400/60 dark:text-orange-500/40">
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5">Nhấn để lật lại <RefreshCw size={12} /></span>
          </div>
        </div>

      </div>
    </div>
  );
}
