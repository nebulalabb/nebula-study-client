'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { QuotaBadge, invalidateQuotaCache } from '@/components/QuotaBadge';
import Link from 'next/link';
import { ArrowLeft, FileText, AlignLeft, Sparkles, AlertTriangle, Rocket, Zap, Brain, Target, Plus, UploadCloud } from 'lucide-react';

export default function CreateQuizPage() {
  const router = useRouter();
  
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState('mixed');
  const [count, setCount] = useState(10);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      let quizId = '';

      if (mode === 'text') {
        if (!content || content.length < 50) throw new Error('Nội dung quá ngắn (cần ít nhất 50 ký tự).');
        if (!title) throw new Error('Vui lòng nhập tên bộ đề.');
        
        const { data } = await apiClient.post('/quiz/generate/text', {
          title, text: content, difficulty, count
        });
        quizId = data.data.quiz_id;
      } else {
        if (!file) throw new Error('Vui lòng chọn file tĩnh để AI sinh đề.');
        
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        formData.append('difficulty', difficulty);
        formData.append('count', count.toString());
        
        const { data } = await apiClient.post('/quiz/generate/pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        quizId = data.data.quiz_id;
      }

      invalidateQuotaCache();
      router.push(`/learn/quiz/preview/${quizId}`);

    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const msg = err?.response?.data?.error?.message ?? 'Đã xảy ra lỗi sinh đề';
        setError(msg);
      }
    } finally {
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
              <h3 className="text-4xl font-black text-gray-950 tracking-tighter">Đang đúc kết đề thi...</h3>
              <p className="text-lg text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
                Hệ thống AI đang phân tích dữ liệu và thiết lập các câu hỏi {difficulty === 'hard' ? 'siêu hóc búa' : 'chuẩn kiến thức'} cho bạn. 🧠✨
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
              <Link href="/learn/quiz" className="p-4 bg-white border-2 border-orange-50 text-orange-400 hover:text-orange-600 hover:border-orange-100 rounded-2xl transition-all shadow-sm active:scale-95">
                <ArrowLeft size={24} strokeWidth={3} />
              </Link>
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-gray-950">Tạo Đề Thi <span className="text-orange-500">Mới</span></h1>
                <p className="text-gray-400 font-bold">Hãy để AI giúp bạn soạn thảo bộ câu hỏi chất lượng nhất. ✨</p>
              </div>
           </div>
           <QuotaBadge module="quiz" label="Quota Quiz" compact />
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

           <div className="space-y-12">
              {/* Source Mode Toggle */}
              <div className="grid grid-cols-2 gap-4 p-2 bg-[#FFF9F5] rounded-[2rem] border-2 border-orange-50/50">
                {[
                  { id: 'text', icon: AlignLeft, label: 'Nhập văn bản' },
                  { id: 'file', icon: FileText, label: 'Tải file .PDF / .Word' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id as 'text' | 'file')}
                    className={`flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black transition-all ${
                      mode === m.id
                        ? 'bg-white text-orange-600 shadow-xl shadow-orange-500/10 border-2 border-orange-100 scale-[1.02]'
                        : 'text-gray-300 hover:text-orange-400'
                    }`}
                  >
                    <m.icon size={20} strokeWidth={3} /> {m.label}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Plus size={14} className="text-orange-300" /> Tiêu đề bộ đề bài tập *
                   </label>
                   <input 
                     type="text" 
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     placeholder="VD: Kiểm tra chương 1 Vật Lí 12 - Dao động cơ"
                     className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-gray-900 transition-all placeholder:text-gray-200" 
                     required={mode === 'text'}
                   />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Target size={14} className="text-rose-300" /> Độ khó mong muốn
                    </label>
                    <div className="relative">
                      <select 
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-orange-600 transition-all cursor-pointer appearance-none"
                      >
                        <option value="easy">Dễ (Nhận biết)</option>
                        <option value="medium">Trung bình (Thông hiểu)</option>
                        <option value="hard">Khó (Vận dụng cao)</option>
                        <option value="mixed">Trộn lẫn kiến thức</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-orange-200">
                         <Zap size={20} className="fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Zap size={14} className="text-sky-300" /> Số lượng câu hỏi
                    </label>
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

                {mode === 'text' ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <AlignLeft size={14} className="text-orange-300" /> Nội dung cần ôn tập *
                    </label>
                    <textarea 
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={10}
                      placeholder="Dán nội dung bài học, chương trình ôn thi hoặc định nghĩa vào đây..."
                      className="w-full px-8 py-6 bg-[#FFF9F5] border-4 border-orange-50 rounded-[2.5rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-200 resize-none leading-relaxed" 
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <FileText size={14} className="text-rose-300" /> Tải lên tài liệu (.PDF, .Docx) *
                    </label>
                    <label className="group/drop relative flex flex-col items-center justify-center w-full min-h-[300px] border-4 border-dashed border-orange-100 bg-orange-50/50 rounded-[3rem] cursor-pointer hover:bg-orange-100/50 hover:border-orange-200 transition-all overflow-hidden">
                       <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-orange-500 group-hover/drop:scale-110 group-hover/drop:rotate-6 transition-all">
                             <UploadCloud size={36} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-1">
                             <p className="text-xl font-black text-orange-600">Chọn file tài liệu</p>
                             <p className="text-sm text-orange-300 font-bold">Kéo thả hoặc nhấp để chọn tệp</p>
                          </div>
                          {file && (
                            <div className="px-4 py-2 bg-white border-2 border-orange-100 rounded-xl text-orange-600 font-black text-xs animate-in slide-in-from-top-2">
                               📄 {file.name}
                            </div>
                          )}
                       </div>
                       <input 
                         type="file" 
                         className="hidden" 
                         accept=".pdf,.doc,.docx"
                         onChange={e => setFile(e.target.files?.[0] || null)}
                       />
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-6 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-2xl text-sm font-black flex items-center gap-3 animate-in shake-1">
                  <AlertTriangle size={20} strokeWidth={3} /> {error}
                </div>
              )}

              <div className="pt-10 border-t-2 border-orange-50 flex items-center justify-end relative z-10">
                 <button
                   type="submit"
                   disabled={isLoading}
                   className="px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center gap-3 hover:from-orange-600 hover:to-rose-600 shadow-2xl shadow-orange-500/30 active:scale-95 transition-all text-xl group"
                 >
                   <Sparkles size={24} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} /> 
                   Phân tích & Soạn đề thi ngay
                 </button>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
}
