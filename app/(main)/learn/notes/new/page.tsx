'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { QuotaBadge, invalidateQuotaCache } from '@/components/QuotaBadge';
import Link from 'next/link';
import { ArrowLeft, FileText, AlignLeft, Sparkles, AlertTriangle, CloudUpload, Rocket, ChevronRight } from 'lucide-react';

type CreateMode = 'text' | 'file';

export default function NewNotePage() {
  const router = useRouter();
  
  const [mode, setMode] = useState<CreateMode>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tagsStr, setTagsStr] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview State
  const [previewData, setPreviewData] = useState<{
    summary: string;
    bullet_points: string[];
    keywords: { term: string; explanation: string }[];
    source_type: string;
    source_url?: string;
    source_filename?: string;
    word_count?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (mode === 'text') {
        if (!content || content.length < 50) throw new Error('Nội dung quá ngắn (cần ít nhất 50 ký tự).');
        const { data } = await apiClient.post('/note/summarize', {
          text: content
        });
        setPreviewData({ ...data.data, source_type: 'text' });
      } else {
        if (!file) throw new Error('Vui lòng chọn file PDF hoặc DOCX để tóm tắt.');
        const formData = new FormData();
        formData.append('file', file);
        
        const { data } = await apiClient.post('/note/summarize/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setPreviewData(data.data);
      }
      if (!title) {
        setTitle(mode === 'text' ? 'Ghi chú văn bản' : (file?.name || 'Ghi chú tài liệu'));
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Đã xảy ra lỗi trong quá trình tóm tắt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!previewData) return;
    setIsSaving(true);
    try {
      let tags: string[] = [];
      if (tagsStr) {
        tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      } else {
        // Use top 3 keywords as default tags
        tags = previewData.keywords.slice(0, 3).map(k => k.term.toLowerCase().replace(/\s+/g, '-'));
      }

      const { data } = await apiClient.post('/note', {
        title,
        source_type: previewData.source_type,
        source_url: previewData.source_url,
        source_filename: previewData.source_filename,
        source_content: mode === 'text' ? content : null,
        summary: previewData.summary,
        bullet_points: previewData.bullet_points,
        keywords: previewData.keywords,
        tags
      });

      invalidateQuotaCache();
      router.push(`/learn/notes/${data.data.note_id}`);
    } catch (err: any) {
      setError('Không thể lưu ghi chú. Vui lòng thử lại.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-xl w-full flex flex-col items-center justify-center p-16 text-center rounded-[3.5rem] bg-white border-2 border-orange-100 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="relative w-32 h-32 mb-10">
            <div className="absolute inset-0 bg-orange-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 rounded-[2rem] rotate-12 flex items-center justify-center shadow-xl animate-bounce duration-1000">
              <Sparkles size={56} className="text-white -rotate-12 animate-pulse" />
            </div>
          </div>
          <h3 className="text-3xl font-black mb-4 tracking-tight text-gray-900">Đang "chắt lọc" trí tuệ...</h3>
          <p className="text-gray-400 font-bold max-w-xs mx-auto mb-8 leading-relaxed">Hệ thống đang phân tích tài liệu để trích xuất kiến thức cốt lõi. 🚀</p>
        </div>
      </div>
    );
  }

  if (previewData) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] pb-24">
        <div className="max-w-5xl mx-auto px-6 pt-16 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <button onClick={() => setPreviewData(null)} className="p-4 bg-white hover:bg-orange-50 border-2 border-orange-50 rounded-2xl transition-all shadow-sm">
                 <ArrowLeft size={24} className="text-orange-500" />
               </button>
               <div>
                 <h1 className="text-3xl font-black tracking-tight text-gray-950">Kiểm tra kết quả</h1>
                 <p className="text-gray-400 font-bold">Chỉnh sửa lại nếu AI làm chưa chuẩn bạn nhé ✨</p>
               </div>
            </div>
            <button
               onClick={handleSave}
               disabled={isSaving}
               className="flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:from-orange-600 hover:to-rose-600 transition-all disabled:opacity-50 active:scale-95 text-lg"
            >
              <Rocket size={20} /> {isSaving ? 'Đang lưu...' : 'Lưu vào thư viện'}
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[2.5rem] border-2 border-orange-50 shadow-xl shadow-orange-500/5 space-y-6">
                 <label className="block text-xs font-black text-orange-400 uppercase tracking-widest">Tiêu đề ghi chú</label>
                 <input 
                   type="text" 
                   value={title} 
                   onChange={e => setTitle(e.target.value)}
                   className="w-full text-2xl font-black border-b-4 border-orange-50 focus:border-orange-500 focus:outline-none pb-2 transition-colors bg-transparent placeholder:text-gray-200"
                   placeholder="Nhập tiêu đề..."
                 />
                 
                 <div className="space-y-4 pt-4">
                    <label className="block text-xs font-black text-orange-400 uppercase tracking-widest">Tóm tắt tổng quan</label>
                    <textarea 
                      value={previewData.summary}
                      onChange={e => setPreviewData({ ...previewData, summary: e.target.value })}
                      rows={6}
                      className="w-full p-6 bg-orange-50/50 rounded-2xl text-sm font-bold text-gray-700 leading-relaxed focus:ring-4 focus:ring-orange-100 focus:outline-none border-2 border-orange-50 transition-all resize-none"
                    />
                 </div>
               </div>

               <div className="bg-white p-10 rounded-[2.5rem] border-2 border-orange-50 shadow-xl shadow-orange-500/5 space-y-6">
                 <label className="block text-xs font-black text-orange-400 uppercase tracking-widest">Các từ khóa chính</label>
                 <div className="grid grid-cols-1 gap-4">
                   {previewData.keywords.map((kw, idx) => (
                     <div key={idx} className="p-5 bg-[#FFF9F5] rounded-[1.5rem] border-2 border-orange-50 flex flex-col gap-2 group/kw transition-all hover:border-orange-200">
                       <input 
                         value={kw.term}
                         onChange={e => {
                           const n = [...previewData.keywords];
                           n[idx]!.term = e.target.value;
                           setPreviewData({ ...previewData, keywords: n });
                         }}
                         placeholder="Thuật ngữ..."
                         className="font-black text-orange-600 bg-transparent outline-none uppercase text-sm tracking-widest"
                       />
                       <textarea 
                         value={kw.explanation}
                         onChange={e => {
                           const n = [...previewData.keywords];
                           n[idx]!.explanation = e.target.value;
                           setPreviewData({ ...previewData, keywords: n });
                         }}
                         placeholder="Giải thích ý nghĩa..."
                         rows={2}
                         className="text-xs font-bold text-gray-400 bg-transparent outline-none resize-none leading-relaxed"
                       />
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-orange-50 shadow-xl shadow-orange-500/5 flex flex-col h-full min-h-[40rem]">
               <label className="block text-xs font-black text-orange-400 uppercase tracking-widest mb-6 border-l-4 border-orange-500 pl-3">Các ý chính (Bullet Points)</label>
               <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                  {previewData.bullet_points.map((bp, idx) => (
                    <div key={idx} className="relative group">
                      <textarea 
                        value={bp}
                        onChange={e => {
                          const n = [...previewData.bullet_points];
                          n[idx] = e.target.value;
                          setPreviewData({ ...previewData, bullet_points: n });
                        }}
                        rows={3}
                        className="w-full p-5 pl-14 bg-gray-50/50 rounded-2xl text-sm font-bold text-gray-600 leading-relaxed focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none border-2 border-transparent focus:border-orange-50 transition-all resize-none"
                      />
                      <div className="absolute left-4 top-5 w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:rotate-6">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 pt-8 border-t-2 border-orange-50 font-black text-xs text-orange-300 italic flex items-center gap-2">
                  <Sparkles size={14} /> Bạn có thể chỉnh sửa trực tiếp nội dung trên các khối ✨
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12">
        <div className="flex items-center gap-6">
          <Link href="/learn/notes" className="p-4 bg-white hover:bg-orange-50 border-2 border-orange-50 hover:border-orange-100 rounded-2xl transition-all shadow-sm">
            <ArrowLeft size={24} className="text-orange-500" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-950">Tóm tắt tài liệu mới</h1>
            <p className="text-gray-400 font-bold mt-2">Giao phó tài liệu dài cho AI, nhận lại trí thức cô đọng 📖</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] border-2 border-orange-50 p-10 md:p-14 shadow-2xl shadow-orange-500/5 space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />
          
          <div className="relative z-10 grid grid-cols-2 gap-4 p-2 bg-orange-50/50 rounded-[2rem] border-2 border-orange-50 text-center">
            <button type="button" onClick={() => setMode('text')} className={`py-4 rounded-[1.5rem] text-sm font-black transition-all ${mode === 'text' ? 'bg-white text-orange-600 shadow-xl border-2 border-orange-100' : 'text-gray-400 hover:text-gray-600'}`}>Nhập văn bản</button>
            <button type="button" onClick={() => setMode('file')} className={`py-4 rounded-[1.5rem] text-sm font-black transition-all ${mode === 'file' ? 'bg-white text-orange-600 shadow-xl border-2 border-orange-100' : 'text-gray-400 hover:text-gray-600'}`}>Tải PDF/Word</button>
          </div>

          <div className="relative z-10 space-y-8">
            {mode === 'text' ? (
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                placeholder="Dán nội dung vào đây (ít nhất 50 ký tự)..."
                className="w-full px-8 py-8 rounded-[2.5rem] border-4 border-orange-50 bg-[#FFF9F5] text-sm font-bold focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-gray-200 resize-none leading-relaxed"
              />
            ) : (
              <div className="relative group/file h-72 flex flex-col items-center justify-center p-12 bg-orange-50/50 rounded-[3rem] border-4 border-dashed border-orange-200 hover:bg-orange-100/50 hover:border-orange-400 transition-all cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CloudUpload size={56} className="text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-lg font-black text-gray-500 group-hover:text-orange-950 transition-colors uppercase tracking-tight">{file ? file.name : 'Nhấn hoặc kéo PDF/DOCX vào đây'}</p>
                <p className="text-xs text-orange-400 font-bold mt-2 uppercase tracking-[0.2em]">Hỗ trợ PDF và Word · Tối đa 10MB</p>
                <input type="file" accept=".pdf,.docx,.doc" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Tiêu đề (Lưu trữ)</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Tiêu đề gợi nhớ..."
                  className="w-full px-8 py-5 rounded-2xl border-4 border-orange-50 bg-[#FFF9F5] focus:border-orange-200 outline-none text-sm font-black transition-all placeholder:text-gray-200"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Gắn thẻ tags</label>
                <input 
                  type="text" 
                  value={tagsStr} 
                  onChange={e => setTagsStr(e.target.value)}
                  placeholder="lich-su, quan-trong..."
                  className="w-full px-8 py-5 rounded-2xl border-4 border-orange-50 bg-[#FFF9F5] focus:border-orange-200 outline-none text-sm font-black transition-all placeholder:text-gray-200"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-rose-50 text-rose-700 rounded-3xl text-sm font-black border-2 border-rose-100 flex items-center gap-4 animate-in shake-in duration-300">
               <div className="p-2 bg-rose-500 text-white rounded-lg"><AlertTriangle size={20} /></div>
               {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t-2 border-orange-50">
             <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
                <QuotaBadge module="note" label="Lượt hôm nay:" compact />
             </div>
             <button 
                type="submit" 
                disabled={isLoading || (mode === 'text' && content.length < 50) || (mode === 'file' && !file)}
                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all text-lg flex items-center justify-center gap-3 group/btn"
             >
                Phân tích & Tóm tắt <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
