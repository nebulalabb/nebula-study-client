'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { QuotaBadge, invalidateQuotaCache } from '@/components/QuotaBadge';
import { FlashcardGenerating } from '@/components/FlashcardGenerating';
import Link from 'next/link';
import { AlignLeft, FileText, Settings, ArrowLeft, Send, Sparkles, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CreateMode = 'text' | 'pdf' | 'manual';

export default function FlashcardCreatePage() {
  const router = useRouter();
  
  const [mode, setMode] = useState<CreateMode>('text');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState('15');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return setError('Vui lòng nhập tên bộ Flashcard nhé!');
    
    setIsLoading(true);
    setError(null);

    try {
      let setId = '';

      if (mode === 'text') {
        if (!content || content.length < 20) throw new Error('Nội dung ngắn quá, AI cần ít nhất 20 ký tự nè!');
        const { data } = await apiClient.post('/flashcard/sets/generate/text', {
          title, subject, text: content, count: parseInt(count)
        });
        setId = data.data.set_id;
      } 
      else if (mode === 'pdf') {
        if (!file) throw new Error('Bạn chưa chọn file PDF kìa!');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        if (subject) formData.append('subject', subject);
        formData.append('count', count);
        
        const { data } = await apiClient.post('/flashcard/sets/generate/pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setId = data.data.set_id;
      }
      else if (mode === 'manual') {
        const { data } = await apiClient.post('/flashcard/sets', {
          title, subject
        });
        setId = data.data.id;
      }

      invalidateQuotaCache();
      
      // Redirect to the set management page
      if (mode === 'manual') {
        router.push(`/learn/flashcard/${setId}?focus=new`);
      } else {
        router.push(`/learn/flashcard/study/${setId}`);
      }
      
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const msg = err?.response?.data?.error?.message ?? 'Đã xảy ra lỗi, bạn thử lại xem sao nhé!';
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode !== 'manual') {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <FlashcardGenerating />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-8">
        
        {/* Navigation Back */}
        <div className="flex items-center gap-4">
          <Link href="/learn/flashcard" className="p-3 bg-white hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-2xl shadow-sm transition-all border border-transparent hover:border-orange-100">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Tạo bộ Flashcard mới</h1>
            <p className="text-gray-500 font-bold mt-1 tracking-tight">✨ Soạn thẻ cực nhanh với sức mạnh NebulaAI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border-2 border-orange-50 p-10 shadow-xl shadow-orange-500/5 space-y-10">
          
          {/* Basic Info Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3 ml-1">Tên bộ Flashcard *</label>
              <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="VD: Từ vựng IELTS chủ đề Môi trường"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-lg font-bold focus:outline-none focus:border-orange-200 focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3 ml-1">Môn học</label>
              <select 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-base font-bold focus:outline-none focus:border-orange-200 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Tổng hợp</option>
                <option value="Tiếng Anh">Tiếng Anh 🇬🇧</option>
                <option value="Toán">Toán Học 📐</option>
                <option value="Vật lý">Vật Lý 🧪</option>
                <option value="Hóa học">Hóa Học ⚗️</option>
                <option value="Sinh học">Sinh Học 🌿</option>
                <option value="Lịch sử">Lịch Sử 📜</option>
                <option value="Địa lý">Địa Lý 🌏</option>
              </select>
            </div>

            {mode !== 'manual' && (
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3 ml-1">Số lượng thẻ</label>
                <select 
                  value={count} 
                  onChange={e => setCount(e.target.value)} 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-base font-bold focus:outline-none focus:border-orange-200 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="10">10 thẻ</option>
                  <option value="15">15 thẻ</option>
                  <option value="20">20 thẻ (Phổ biến)</option>
                  <option value="30">30 thẻ 🌟</option>
                  <option value="50">50 thẻ 🔥</option>
                </select>
              </div>
            )}
          </div>

          <hr className="border-orange-50" />

          {/* Source Selection Section */}
          <div className="space-y-6">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-1 ml-1">Nguồn dữ liệu</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'text', icon: AlignLeft, label: 'Nhập văn bản', color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50' },
                { id: 'pdf', icon: FileText, label: 'Tải PDF lên', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50' },
                { id: 'manual', icon: Settings, label: 'Soạn thủ công', color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as CreateMode)}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all group overflow-hidden ${
                    mode === m.id 
                      ? `border-orange-200 ${m.bg} shadow-lg shadow-orange-500/5`
                      : 'border-transparent bg-gray-50/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  <div className={`p-3 rounded-2xl mb-3 transition-all ${
                    mode === m.id ? `bg-gradient-to-br ${m.color} text-white shadow-lg` : 'bg-white text-gray-400'
                  }`}>
                    <m.icon size={24} />
                  </div>
                  <span className={`text-sm font-black ${mode === m.id ? 'text-gray-800' : 'text-gray-400'}`}>{m.label}</span>
                  
                  {mode === m.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Input Area */}
          <div className="bg-orange-50/30 rounded-[2rem] p-8 border-2 border-orange-50/50">
            {mode === 'text' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-orange-800 flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-500" /> 
                  Mẹo: Dán nội dung bài học hoặc ghi chú vào đây nhé!
                </p>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  placeholder="Ví dụ: Một bài báo, định nghĩa các thuật ngữ, hoặc nội dung bài giảng..."
                  className="w-full px-6 py-5 rounded-3xl border-2 border-transparent bg-white text-base font-bold focus:outline-none focus:border-orange-200 transition-all shadow-sm resize-none"
                />
              </div>
            )}
            
            {mode === 'pdf' && (
              <div className="space-y-6">
                <div className="text-center p-10 bg-white rounded-[2rem] border-2 border-dashed border-rose-200 relative group cursor-pointer hover:bg-rose-50/30 transition-all">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="relative z-0 space-y-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 group-hover:scale-110 transition-transform">
                      <FileText size={40} />
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <p className="font-black text-rose-600 truncate max-w-xs mx-auto">{file.name}</p>
                        <p className="text-xs text-gray-400">Nhấn để thay đổi file khác</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-black text-gray-700">Tải tài liệu PDF lên</p>
                        <p className="text-xs text-gray-400">Hỗ trợ file tối đa 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mode === 'manual' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Settings size={36} />
                </div>
                <h3 className="font-black text-gray-800 text-lg">Khởi tạo bộ thẻ trống</h3>
                <p className="text-sm text-gray-500 font-medium max-w-[280px] mx-auto">
                  Bạn sẽ tự tay nhập từng nội dung cho thẻ (Mặt trước, mặt sau và gợi ý).
                </p>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-black flex items-center gap-3 animate-head-shake">
              <AlertTriangle size={20} /> {error}
            </div>
          )}

          {/* Submit Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
            <div className="order-2 sm:order-1">
              {mode !== 'manual' && <QuotaBadge module="flashcard" label="Lượt AI của bạn" compact />}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !title || (mode === 'text' && content.length < 20) || (mode === 'pdf' && !file)}
              className="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-4 bg-gradient-to-r from-orange-400 to-rose-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 text-lg group"
            >
              {mode === 'manual' ? (
                <><Settings size={22} className="group-hover:rotate-90 transition-transform" /> Tạo bộ thẻ trống</>
              ) : (
                <><Sparkles size={22} className="animate-pulse" /> NebulaAI, soạn thẻ đi!</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
