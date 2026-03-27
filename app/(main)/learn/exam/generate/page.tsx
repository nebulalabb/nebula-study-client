'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { QuotaBadge, invalidateQuotaCache } from '@/components/QuotaBadge';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Brain, Target, Zap, Rocket, AlertTriangle, Check } from 'lucide-react';

const SUBJECTS = [
  { id: 'math', label: 'Toán học', icon: '🔢', color: 'bg-blue-50 text-blue-600' },
  { id: 'english', label: 'Tiếng Anh', icon: '🇬🇧', color: 'bg-purple-50 text-purple-600' },
  { id: 'physics', label: 'Vật lý', icon: '⚛️', color: 'bg-orange-50 text-orange-600' },
  { id: 'chemistry', label: 'Hóa học', icon: '🧪', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'biology', label: 'Sinh học', icon: '🌿', color: 'bg-rose-50 text-rose-600' },
  { id: 'literature', label: 'Ngữ văn', icon: '📚', color: 'bg-indigo-50 text-indigo-600' },
];

export default function GenerateExamPage() {
  const router = useRouter();
  
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topic) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.post('/exam/generate', {
        subject, topic, difficulty, count
      });
      invalidateQuotaCache();
      router.push(`/learn/exam/${data.data.exam_id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? 'Đã xảy ra lỗi khi tạo đề';
      setError(msg);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-10 animate-in fade-in zoom-in duration-700">
           <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-[4rem] opacity-20 animate-pulse" />
              <div className="relative w-full h-full bg-white border-4 border-orange-100 rounded-[3rem] shadow-2xl flex items-center justify-center animate-bounce">
                 <Rocket size={80} className="text-orange-500 -rotate-12" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg animate-spin-slow">
                 <Sparkles size={32} />
              </div>
           </div>
           <div className="space-y-4">
              <h3 className="text-4xl font-black text-gray-950 tracking-tighter">AI đang soạn đề thi...</h3>
              <p className="text-lg text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
                Đang tổng hợp kiến thức về <span className="text-orange-500">{topic}</span> theo độ khó <span className="text-rose-500">{difficulty}</span>.
              </p>
           </div>
           <div className="flex justify-center gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full bg-orange-500 animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <Link href="/learn/exam" className="p-4 bg-white border-2 border-orange-50 text-orange-400 hover:text-orange-600 hover:border-orange-100 rounded-2xl transition-all shadow-sm active:scale-95">
                <ArrowLeft size={24} strokeWidth={3} />
              </Link>
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-gray-950 uppercase">Tạo Đề Luyện <span className="text-orange-500">AI</span></h1>
                <p className="text-gray-400 font-bold">Yêu cầu AI soạn thảo bộ đề thi tập trung vào mục tiêu của bạn. ✨</p>
              </div>
           </div>
           <QuotaBadge module="exam" label="Lượt sinh đề" compact />
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

           <div className="space-y-12">
              <div className="space-y-6">
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                   <Target size={14} className="text-blue-300" /> 1. Chọn môn học
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {SUBJECTS.map(s => (
                     <button
                        key={s.id}
                        type="button"
                        onClick={() => setSubject(s.id)}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${
                          subject === s.id 
                            ? 'bg-white border-orange-400 shadow-xl shadow-orange-500/10 scale-105' 
                            : 'bg-[#FFF9F5] border-transparent hover:border-orange-100 grayscale-[0.5] hover:grayscale-0'
                        }`}
                     >
                        <span className="text-4xl">{s.icon}</span>
                        <span className={`text-sm font-black ${subject === s.id ? 'text-orange-600' : 'text-gray-400'}`}>{s.label}</span>
                        {subject === s.id && <div className="absolute top-3 right-3 text-orange-500"><Check size={16} strokeWidth={3} /></div>}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Brain size={14} className="text-purple-300" /> 2. Nhập chủ đề cụ thể
                    </label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="VD: Thì hiện tại hoàn thành, Hàm số bậc hai..."
                      className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-gray-900 transition-all placeholder:text-gray-200" 
                      required
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="block text-xs font-black text-gray-300 uppercase tracking-widest ml-1">3. Độ khó</label>
                       <div className="relative">
                          <select 
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                            className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-orange-600 transition-all cursor-pointer appearance-none"
                          >
                             <option value="easy">Dễ (Nhận biết)</option>
                             <option value="medium">Trung bình (Thông hiểu)</option>
                             <option value="hard">Khó (Vận dụng cao)</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-orange-200">
                             <Zap size={20} className="fill-current" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="block text-xs font-black text-gray-300 uppercase tracking-widest ml-1">4. Số lượng câu</label>
                       <div className="relative">
                          <select 
                            value={count}
                            onChange={e => setCount(Number(e.target.value))}
                            className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-sky-600 transition-all cursor-pointer appearance-none"
                          >
                             {[5, 10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} câu hỏi</option>)}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-sky-200">
                             <Brain size={20} className="fill-current" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {error && (
                <div className="p-6 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-2xl text-sm font-black flex items-center gap-3 animate-in shake-1">
                  <AlertTriangle size={20} strokeWidth={3} /> {error}
                </div>
              )}

              <div className="pt-10 border-t-2 border-orange-50 flex items-center justify-end relative z-10">
                 <button
                   type="submit"
                   disabled={!subject || !topic || isLoading}
                   className="px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center gap-3 hover:from-orange-600 hover:to-rose-600 shadow-2xl shadow-orange-500/30 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all text-xl group"
                 >
                   <Sparkles size={24} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} /> 
                   Sinh đề ngay
                 </button>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
}
