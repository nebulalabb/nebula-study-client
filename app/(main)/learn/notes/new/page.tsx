'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { QuotaBadge, invalidateQuotaCache } from '@/components/QuotaBadge';
import Link from 'next/link';
import { ArrowLeft, FileText, AlignLeft, Sparkles, AlertTriangle, CloudUpload, Rocket, Lightbulb, Check, ChevronRight } from 'lucide-react';

type CreateMode = 'text' | 'file';

export default function NewNotePage() {
  const router = useRouter();
  
  const [mode, setMode] = useState<CreateMode>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tagsStr, setTagsStr] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      let tags: string[] = [];
      if (tagsStr) {
        tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      }

      let noteId = '';

      if (mode === 'text') {
        if (!content || content.length < 50) throw new Error('Nội dung quá ngắn (cần ít nhất 50 ký tự).');
        const { data } = await apiClient.post('/note/summarize', {
          title, text: content, tags
        });
        noteId = data.data.note_id;
      } else {
        if (!file) throw new Error('Vui lòng chọn file PDF hoặc DOCX để tóm tắt.');
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        if (tags.length > 0) formData.append('tags', JSON.stringify(tags));
        
        const { data } = await apiClient.post('/note/summarize/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        noteId = data.data.note_id;
      }

      invalidateQuotaCache();
      router.push(`/learn/notes/${noteId}`);

    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const msg = err?.response?.data?.error?.message ?? 'Đã xảy ra lỗi trong quá trình tóm tắt';
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-xl w-full flex flex-col items-center justify-center p-16 text-center rounded-[3.5rem] bg-white border-2 border-orange-100 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="relative w-32 h-32 mb-10">
            <div className="absolute inset-0 bg-orange-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 rounded-[2rem] rotate-12 flex items-center justify-center shadow-xl animate-bounce duration-1000">
              <Sparkles size={56} className="text-white -rotate-12 animate-pulse" />
            </div>
          </div>
          
          <h3 className="text-3xl font-black mb-4 tracking-tight text-gray-900">Đang "chắt lọc" trí tuệ...</h3>
          <p className="text-gray-400 font-bold max-w-xs mx-auto mb-8 leading-relaxed">
            Nebula AI đang phân tích tài liệu của bạn để trích xuất các ý cốt lõi và kiến thức quan trọng nhất. 🚀
          </p>
          
          <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] bg-orange-50 px-4 py-2 rounded-full border border-orange-100/50">
             Vui lòng đừng đóng trang nhé ✨
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12">
        
        <div className="flex items-center gap-6">
          <Link href="/learn/notes" className="p-4 bg-white hover:bg-orange-50 border-2 border-orange-50 hover:border-orange-100 rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-95">
            <ArrowLeft size={24} className="text-orange-500" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Lightbulb className="text-orange-400" size={16} />
               <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">AI Intelligence</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-950">Tóm tắt tài liệu mới</h1>
            <p className="text-gray-400 font-bold mt-2">Giao phó kiến thức dài cho AI, nhận lại trí thức cô đọng 📖</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] border-2 border-orange-50 p-10 md:p-14 shadow-2xl shadow-orange-500/5 space-y-12 relative overflow-hidden group">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

          {/* Source Mode Toggle */}
          <div className="relative z-10 grid grid-cols-2 gap-4 p-2 bg-orange-50/50 rounded-[2rem] border-2 border-orange-50">
            {[
              { id: 'text', icon: AlignLeft, label: 'Nhập văn bản' },
              { id: 'file', icon: FileText, label: 'Tải PDF/Word' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id as CreateMode)}
                className={`flex items-center justify-center gap-3 py-4 px-6 rounded-[1.5rem] text-sm font-black transition-all ${
                  mode === m.id
                    ? 'bg-white text-orange-600 shadow-xl shadow-orange-500/5 border-2 border-orange-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                }`}
              >
                <m.icon size={20} /> {m.label}
              </button>
            ))}
          </div>

          {/* Dynamic Inputs */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề ghi chú (Tùy chọn)</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Tổng kết Chiến tranh Thế giới 2"
                className="w-full px-8 py-5 rounded-[1.75rem] border-4 border-orange-50 bg-[#FFF9F5] text-sm font-black focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-gray-200"
              />
            </div>

            {mode === 'text' ? (
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung cần tóm tắt *</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={10}
                  placeholder="Dán bài báo, đoạn trích sách hoặc trang Wikipedia vào đây (ít nhất 50 ký tự)..."
                  className="w-full px-8 py-6 rounded-[2.5rem] border-4 border-orange-50 bg-[#FFF9F5] text-sm font-bold focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-gray-200 resize-none leading-relaxed"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">File tài liệu (PDF, DOCX) *</label>
                <div className="relative group/file">
                   <div className="absolute inset-0 bg-orange-100/50 rounded-[2.5rem] border-4 border-dashed border-orange-200 animate-pulse group-hover/file:bg-orange-100 group-hover/file:border-orange-300 transition-colors" />
                   <div className="relative p-12 flex flex-col items-center justify-center gap-4 text-center">
                     <div className="p-4 bg-white rounded-2xl shadow-lg shadow-orange-500/5 text-orange-500">
                        <CloudUpload size={40} />
                     </div>
                     <div>
                        <p className="text-lg font-black text-orange-950">{file ? file.name : 'Nhấn để chọn file hoặc kéo thả'}</p>
                        <p className="text-xs text-orange-400 font-bold mt-1 uppercase tracking-widest">Hỗ trợ PDF và Word · Tối đa 10MB</p>
                     </div>
                     <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                   </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Gắn thẻ tags (Cách nhau bằng dấu phẩy)</label>
              <input 
                type="text" 
                value={tagsStr}
                onChange={e => setTagsStr(e.target.value)}
                placeholder="VD: lich-su, the-gioi, quan-trong"
                className="w-full px-8 py-5 rounded-[1.75rem] border-4 border-orange-50 bg-[#FFF9F5] text-sm font-black focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-gray-200"
              />
              <p className="text-[10px] text-gray-300 font-bold italic ml-2 tracking-wide">Nếu bỏ trống, Nebula AI sẽ tự trích xuất từ khóa phù hợp nhất cho bạn ✨</p>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-rose-50 text-rose-700 rounded-3xl text-sm font-black flex items-center gap-4 border-2 border-rose-100 animate-in shake-in duration-300">
              <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <AlertTriangle size={20} /> 
              </div>
              <p>{error}</p>
            </div>
          )}

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t-2 border-orange-50">
            <div className="bg-orange-50/50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
              <Sparkles size={16} className="text-orange-500" />
              <QuotaBadge module="note" label="Lượt hôm nay:" compact />
            </div>
            <button
              type="submit"
              disabled={isLoading || (mode === 'text' && content.length < 50) || (mode === 'file' && !file)}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black rounded-2xl transition-all shadow-2xl shadow-orange-500/30 active:scale-95 text-lg group/btn"
            >
              Phân tích & Tóm tắt <ChevronRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
