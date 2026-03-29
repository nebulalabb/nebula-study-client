'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/lib/toast-util';

interface Category {
  id: string;
  name: string;
}

export default function NewTopicPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    content: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/community/forum/categories');
      const items = res.data.items || [];
      setCategories(items);
      if (items.length > 0) {
        setFormData(prev => ({ ...prev, category_id: items[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
       toast.error('Vui lòng điền đầy đủ thông tin');
       return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      const res = await apiClient.post('/community/forum/topic', {
        ...formData,
        tags: tagsArray
      });
      toast.success('Đã tạo chủ đề thành công! ✨');
      router.push(`/social/forum/${res.data.topic.slug}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tạo chủ đề thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-y-auto custom-scrollbar">
      <div className="bg-[#FFF9F5] p-6 md:p-8 border-b-2 border-orange-50/50 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link 
              href="/social/forum" 
              className="w-10 h-10 rounded-xl bg-white border-2 border-orange-50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-95"
            >
               <ArrowLeft size={18} />
            </Link>
            <div className="space-y-0.5">
               <h2 className="text-xl font-black text-gray-900 tracking-tight">Tạo chủ đề thảo luận mới</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chia sẻ thắc mắc hoặc kiến thức của bạn ✨</p>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto w-full py-8 px-6 md:px-8 space-y-8">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border-4 border-[#FFF9F5] shadow-2xl shadow-orange-500/5 p-6 md:p-8 space-y-6">
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 space-y-1">
                     <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest pl-1">Danh mục</label>
                     <p className="text-[9px] text-gray-400 font-bold leading-relaxed pl-1">Phân loại bài viết của bạn</p>
                  </div>
                  <div className="md:col-span-2">
                     <select 
                        value={formData.category_id}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl bg-orange-50/30 border-none font-bold text-gray-700 focus:ring-4 focus:ring-orange-500/10 text-xs shadow-inner"
                     >
                        {categories.map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 space-y-1">
                     <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest pl-1">Tiêu đề</label>
                     <p className="text-[9px] text-gray-400 font-bold leading-relaxed pl-1">Ngắn gọn và bao quát</p>
                  </div>
                  <div className="md:col-span-2">
                     <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Ví dụ: Làm sao để cân bằng phương trình này?..."
                        className="w-full h-12 px-5 rounded-xl bg-orange-50/30 border-none font-bold text-gray-800 placeholder:text-gray-300 focus:ring-4 focus:ring-orange-500/10 text-xs shadow-inner"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 space-y-1">
                     <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest pl-1">Thẻ (Tags)</label>
                     <p className="text-[9px] text-gray-400 font-bold leading-relaxed pl-1">Phân cách bằng dấu phẩy</p>
                  </div>
                  <div className="md:col-span-2">
                     <input 
                        type="text" 
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="toán, lớp 12, hỏi đáp..."
                        className="w-full h-12 px-5 rounded-xl bg-orange-50/30 border-none font-bold text-gray-700 placeholder:text-gray-300 focus:ring-4 focus:ring-orange-500/10 text-xs shadow-inner"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-1">
                     <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest pl-1">Nội dung</label>
                     <p className="text-[8px] text-orange-400 font-black tracking-widest uppercase italic">Markdown supported ✨</p>
                  </div>
                  <div className="md:col-span-2">
                     <textarea 
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Mô tả chi tiết câu hỏi của bạn tại đây..."
                        className="w-full h-56 px-5 py-5 rounded-2xl bg-orange-50/30 border-none font-bold text-gray-800 placeholder:text-gray-300 focus:ring-4 focus:ring-orange-500/10 resize-none leading-relaxed text-xs shadow-inner"
                     />
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-orange-50 rounded-[2.5rem] border-4 border-white shadow-xl shadow-orange-500/5">
               <div className="flex items-center gap-4 text-orange-600">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                     <AlertCircle size={24} />
                  </div>
                  <p className="text-[11px] font-black leading-relaxed uppercase tracking-tight">
                     Hãy đảm bảo bạn đã tìm kiếm câu hỏi tương tự trước khi tạo mới để tránh trùng lặp nhé! ✨
                  </p>
               </div>
               <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black shadow-xl shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95 text-xs"
               >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Đăng chủ đề ngay <Send size={18} /></>
                  )}
               </Button>
            </div>
         </form>
      </div>
    </div>
  );
}
