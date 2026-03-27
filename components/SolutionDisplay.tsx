'use client';

import React from 'react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import 'katex/dist/katex.min.css';
import { CheckCircle2, ChevronDown, ClipboardList, Sparkles, Clock, Globe } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
export interface SolverStep {
  step_number: number;
  title: string;
  content: string;
  formula?: string;
}

export interface SolutionData {
  id?: string;
  steps: SolverStep[];
  solution: string;
  explanation?: string;
  subject?: string;
  confidence?: number;
  tokens_used?: number;
  solve_time_ms?: number;
}

// ── Markdown renderer config ─────────────────────────────────────────────────
// Shared MarkdownContent is now imported

// ── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step, isLast }: { step: SolverStep; isLast: boolean }) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="relative flex gap-6 group">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-white text-base font-black flex items-center justify-center shadow-lg shadow-orange-500/20 z-10 transition-transform group-hover:scale-110 group-hover:rotate-3">
          {step.step_number}
        </div>
        {!isLast && <div className="w-1 flex-1 bg-orange-100/50 mt-2 rounded-full" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-left mb-3 bg-white hover:bg-orange-50/50 p-2 -m-2 rounded-2xl transition-all"
        >
          <h3 className="font-black text-lg text-gray-800 tracking-tight">{step.title}</h3>
          <div className="p-1.5 bg-gray-50 rounded-xl text-gray-400 group-hover:text-orange-500 transition-colors">
            <ChevronDown size={18} className={`transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {open && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
            <div className="text-gray-600 prose prose-sm max-w-none">
              <MarkdownContent>{step.content}</MarkdownContent>
            </div>
            {step.formula && (
              <div className="mt-4 px-6 py-5 bg-orange-50/50 rounded-[2rem] border-2 border-orange-100 overflow-x-auto text-center shadow-sm">
                <MarkdownContent>{step.formula}</MarkdownContent>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main SolutionDisplay ─────────────────────────────────────────────────────
interface SolutionDisplayProps {
  data: SolutionData;
}

export function SolutionDisplay({ data }: SolutionDisplayProps) {
  if (!data.steps?.length && !data.solution) return null;

  const confidencePercent = data.confidence ? Math.round(data.confidence * 100) : null;

  return (
    <div className="space-y-12 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
      
      {/* Steps */}
      {data.steps?.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3 ml-2">
            <div className="p-2.5 bg-orange-100 rounded-2xl text-orange-500 shadow-sm">
              <ClipboardList size={22} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Giải từng bước
            </h2>
          </div>
          
          <div className="ml-1">
            {data.steps.map((step, i) => (
              <StepCard key={i} step={step} isLast={i === data.steps.length - 1} />
            ))}
          </div>
        </div>
      )}

      {/* Final Answer */}
      {data.solution && (
        <div className="p-10 rounded-[2.5rem] bg-emerald-50 border-4 border-white shadow-2xl shadow-emerald-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="p-3 bg-emerald-500 text-white rounded-[1.25rem] shadow-lg shadow-emerald-500/20 rotate-3">
              <CheckCircle2 size={24} strokeWidth={3} />
            </div>
            <h3 className="font-black text-2xl text-emerald-800 tracking-tight">Kết quả cuối cùng</h3>
          </div>
          
          <div className="text-emerald-900 font-bold text-lg leading-relaxed prose prose-emerald max-w-none relative">
            <MarkdownContent>{data.solution}</MarkdownContent>
          </div>
        </div>
      )}

      {/* Meta Stats */}
      {(data.explanation || confidencePercent) && (
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-orange-50">
          {data.explanation && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-orange-50 text-[11px] font-black text-orange-600 shadow-sm uppercase tracking-wider">
               <Sparkles size={14} /> {data.explanation}
            </div>
          )}
          {confidencePercent && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm ${
              confidencePercent >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : confidencePercent >= 50 ? 'bg-amber-50 text-amber-600 border border-amber-100'
              : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              Tin cậy: {confidencePercent}%
            </div>
          )}
          {data.solve_time_ms && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider shadow-sm">
              <Clock size={14} /> {(data.solve_time_ms / 1000).toFixed(1)}s
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Skeleton loader ─────────────────────────────────────────────────────────
export function SolutionSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-orange-100 rounded-xl" />
        <div className="h-6 w-48 bg-gray-100 rounded-full" />
      </div>
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 shrink-0" />
          <div className="flex-1 space-y-4 pt-1">
            <div className="h-4 bg-gray-100 rounded-full w-2/3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-5/6" />
            </div>
            <div className="h-20 bg-orange-50/50 rounded-[2rem] mt-4" />
          </div>
        </div>
      ))}
      <div className="p-10 rounded-[2.5rem] bg-gray-50 border-4 border-white h-32" />
    </div>
  );
}
