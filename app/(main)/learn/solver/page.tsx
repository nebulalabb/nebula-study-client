'use client';

/**
 * 3.2.1 — Solver Page (/learn/solver)
 * Redesigned with NebulaStudy aesthetic (Orange/White, Jelly style)
 */

import React, { useState, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { SolutionDisplay, SolutionSkeleton, type SolutionData } from '@/components/SolutionDisplay';
import { ImageUploader } from '@/components/ImageUploader';
import { SolverHistory } from '@/components/SolverHistory';
import { QuotaBadge, invalidateQuotaCache } from '@/components/QuotaBadge';
import Link from 'next/link';
import {
  Send,
  Image as ImageIcon,
  AlignLeft,
  Sparkles,
  AlertTriangle,
  Clock,
  RotateCcw,
  History,
  X,
  Brain,
  Lightbulb,
} from 'lucide-react';

// ── Subject options ──────────────────────────────────────────────────────────
const SUBJECTS = [
  { value: '', label: '🧩 Tự động phát hiện' },
  { value: 'toán', label: '📐 Toán học' },
  { value: 'lý', label: '⚡ Vật Lý' },
  { value: 'hóa', label: '🧪 Hóa học' },
  { value: 'sinh', label: '🌿 Sinh học' },
  { value: 'văn', label: '📝 Ngữ Văn' },
  { value: 'anh', label: '🗣️ Tiếng Anh' },
  { value: 'sử', label: '🏛️ Lịch Sử' },
  { value: 'địa', label: '🗺️ Địa Lý' },
  { value: 'general', label: '🔬 Tổng hợp' },
];

// ── Error banner component (3.2.5) ────────────────────────────────────────────
function ErrorBanner({ error, onDismiss }: { error: string; onDismiss: () => void }) {
  const isQuota = error.includes('quota') || error.includes('lượt') || error.includes('429');

  return (
    <div className={`flex items-start gap-4 p-6 rounded-[2rem] border-2 shadow-sm animate-in fade-in zoom-in duration-300 ${
      isQuota
        ? 'bg-amber-50 border-amber-100'
        : 'bg-rose-50 border-rose-100'
    }`}>
      <div className={`p-2 rounded-xl shrink-0 ${isQuota ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
        <AlertTriangle size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-base font-black tracking-tight ${isQuota ? 'text-amber-900' : 'text-rose-900'}`}>
          {isQuota ? 'Hết lượt giải bài rồi!' : 'Úi, có lỗi nhỏ xảy ra'}
        </p>
        <p className="text-sm font-bold opacity-70 mt-1">{error}</p>
        {isQuota && (
          <Link
            href="/billing/upgrade"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 uppercase tracking-wider"
          >
            <Sparkles size={14} /> Nâng cấp Premium ngay
          </Link>
        )}
      </div>
      <button onClick={onDismiss} className="shrink-0 p-2 text-gray-300 hover:text-gray-500 transition-colors">
        <X size={20} />
      </button>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
type InputMode = 'text' | 'image';

export default function SolverPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Form state
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCleared, setImageCleared] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 320) + 'px';
  };

  const canSubmit = inputMode === 'text'
    ? questionText.trim().length >= 5
    : !!imageFile;

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      let responseData: SolutionData;

      if (inputMode === 'text') {
        const { data } = await apiClient.post('/solver/solve', {
          question_text: questionText.trim(),
          subject: subject || undefined,
        });
        responseData = data.data as SolutionData;
      } else {
        const formData = new FormData();
        formData.append('image', imageFile!);
        if (subject) formData.append('subject', subject);
        const { data } = await apiClient.post('/solver/solve/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        responseData = data.data as SolutionData;
      }

      setSolution(responseData);
      invalidateQuotaCache();
      setHistoryKey((k) => k + 1); // Refresh history

      // Scroll to result
      setTimeout(() => {
        document.getElementById('solution-output')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.details
          ? `${err.response.data.error.message} (${err.response.data.error.details?.module}, còn ${err.response.data.error.details?.remaining ?? 0} lượt)`
          : err?.response?.data?.error?.message
          ?? 'Không thể kết nối đến máy chủ. Vui lòng thử lại nhé!';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = async (question: string) => {
    if (!solution?.id || isFollowUpLoading) return;

    setIsFollowUpLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post('/solver/solve', {
        question_text: question,
        subject: solution.subject || subject || undefined,
        parent_id: solution.id,
      });

      const newSolution = data.data as SolutionData;
      setSolution(newSolution);
      invalidateQuotaCache();
      setHistoryKey((k) => k + 1);

      // Scroll to result
      setTimeout(() => {
        document.getElementById('solution-output')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Không thể gửi câu hỏi hỏi thêm. Thử lại sau nhé!');
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit();
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-500 font-black animate-pulse uppercase tracking-widest text-xs">Đang tải dữ liệu... ✨</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-orange-500/5 border-2 border-orange-50">
          <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-[2rem] mx-auto flex items-center justify-center mb-8 rotate-3">
            <Brain size={48} />
          </div>
          <h1 className="text-3xl font-black mb-4 tracking-tight">Cần đăng nhập nè!</h1>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">Bạn cần đăng nhập để NebulaAI có thể giúp bạn giải bài tập nhé.</p>
          <Link href="/login" className="block w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">

          {/* ─── Left: Main solver column ─────────────────────────────────────── */}
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500 text-white rounded-[1.25rem] shadow-lg shadow-orange-500/20 rotate-6">
                    <Brain size={28} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tighter leading-none">
                    Giải bài Nebula
                  </h1>
                </div>
                <p className="text-gray-400 font-bold text-lg leading-relaxed">
                  Gửi câu hỏi hoặc tải ảnh — <span className="text-orange-500">AI giải ngay</span> trong chớp mắt
                </p>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`lg:hidden flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-sm active:scale-95 ${
                  showHistory ? 'bg-orange-500 text-white' : 'bg-white text-gray-400 hover:text-orange-500 border border-gray-100'
                }`}
              >
                <History size={18} /> Lịch sử
              </button>
            </div>

            {/* ── Solver form ─────────────────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[3rem] border-2 border-orange-50 p-8 md:p-10 space-y-8 shadow-2xl shadow-orange-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50/50 rounded-full -mr-20 -mt-20 blur-2xl" />
              
              <div className="flex flex-col md:flex-row gap-6 items-start relative">
                {/* Input mode tabs */}
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-[1.5rem] border border-gray-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                      inputMode === 'text'
                        ? 'bg-white shadow-xl shadow-orange-500/5 text-orange-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <AlignLeft size={16} /> Nhập text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('image')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                      inputMode === 'image'
                        ? 'bg-white shadow-xl shadow-orange-500/5 text-orange-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ImageIcon size={16} /> Tải ảnh
                  </button>
                </div>

                {/* Subject selector */}
                <div className="w-full relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full pl-6 pr-12 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-sm font-black focus:outline-none focus:ring-0 focus:border-orange-200 focus:bg-white transition-all appearance-none text-gray-700"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <History size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="relative">
                {inputMode === 'text' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-1">Câu hỏi / Bài tập của bạn</label>
                    <textarea
                      ref={textareaRef}
                      value={questionText}
                      onChange={handleTextChange}
                      onKeyDown={handleKeyDown}
                      placeholder="VD: GPT phương trình x² - 5x + 6 = 0 rùi vẽ đồ thị nha...&#10;&#10;💡 Chụp ảnh hoặc dán nội dung vào đây nhé!"
                      disabled={isLoading}
                      rows={6}
                      className="w-full px-8 py-7 rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/20 text-base font-bold leading-relaxed focus:outline-none focus:border-orange-200 focus:bg-white transition-all shadow-inner resize-none disabled:opacity-60 placeholder-gray-200 min-h-[180px]"
                    />
                    <div className="flex justify-between items-center px-4">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{questionText.length} / 5000 ký tự</p>
                       <p className="text-[10px] font-black text-orange-300/50 italic">Nhấn Ctrl+Enter để giải nhanh ⚡</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-1">Chụp hoặc tải ảnh bài tập</label>
                    <ImageUploader
                      disabled={isLoading}
                      onFileSelect={(f) => { setImageFile(f); setImageCleared(false); }}
                      onClear={() => { setImageFile(null); setImageCleared(true); }}
                      preview={imageCleared ? null : undefined}
                    />
                  </div>
                )}
              </div>

              {/* Error */}
              {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

              {/* Footer: Quota + Submit */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-orange-50/50">
                <div className="w-full md:w-56 bg-white p-4 rounded-2xl border border-orange-50 shadow-sm relative overflow-hidden group">
                  <div className="absolute right-0 top-0 opacity-10 -mr-2 -mt-2 group-hover:scale-110 transition-transform">
                    <Lightbulb size={48} className="text-orange-500" />
                  </div>
                  <QuotaBadge module="solver" label="Lượt còn lại" compact={false} />
                </div>
                
                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="w-full md:w-fit flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      NebulaAI đang giải...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      Bắt đầu giải bài
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ── Solution output (loading + result) ───────────────────── */}
            <div id="solution-output" className="pt-4 pb-12">
              {isLoading && (
                <div className="bg-white rounded-[3rem] border-2 border-orange-50 p-10 shadow-xl shadow-orange-500/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-500 animate-pulse" />
                   <div className="flex items-center gap-4 mb-10 pb-6 border-b border-orange-50">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
                       <Clock size={24} className="animate-spin-slow" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-800 tracking-tight">NebulaAI đang phân tích câu hỏi...</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Đang suy nghĩ rùi, đợi tớ 5-15 giây nha ✨</p>
                    </div>
                  </div>
                  <SolutionSkeleton />
                </div>
              )}

              {solution && !isLoading && (
                <div className="bg-white rounded-[3rem] border-2 border-orange-50 p-10 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-500" />
                  
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-100 text-orange-500 rounded-xl">
                        <Sparkles size={24} />
                      </div>
                      <h2 className="font-black text-2xl tracking-tight text-gray-800">
                        Giải chi tiết nè!
                      </h2>
                    </div>
                    <button
                      onClick={() => { setSolution(null); setQuestionText(''); setImageFile(null); setImageCleared(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-orange-50 text-xs font-black text-gray-400 hover:text-orange-500 rounded-xl transition-all active:scale-95"
                    >
                      <RotateCcw size={14} /> Làm câu mới
                    </button>
                  </div>
                  <SolutionDisplay 
                    data={solution} 
                    onFollowUp={handleFollowUp}
                    isFollowUpLoading={isFollowUpLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ─── Right: History sidebar (desktop always visible, mobile toggleable) */}
          <aside className={`space-y-8 sticky top-12 ${showHistory ? 'block' : 'hidden'} lg:block pb-10`}>
            <div className="px-2 space-y-2">
              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                <History className="text-orange-500" size={24} /> Lịch sử
              </h2>
              <p className="text-gray-400 font-bold text-sm">Các bài đã giải gần đây</p>
            </div>
            
            <SolverHistory refreshKey={historyKey} onSelect={(item) => {
               setSolution(item as SolutionData);
               if (item.question_text) setQuestionText(item.question_text);
               window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }} />
          </aside>
        </div>
      </div>
    </div>
  );
}
