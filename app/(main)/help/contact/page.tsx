'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, ArrowLeft, HelpCircle, Bug, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast-util';

export default function ContactFormPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'other',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/support/request', formData);
      setIsSuccess(true);
      toast.success('Yêu cầu đã được gửi!');
    } catch (err: any) {
      console.error('Support submission error:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'bug', label: 'Báo lỗi kỹ thuật', icon: <Bug size={18} /> },
    { value: 'feature', label: 'Đề xuất tính năng', icon: <Sparkles size={18} /> },
    { value: 'account', label: 'Vấn đề tài khoản', icon: <HelpCircle size={18} /> },
    { value: 'other', label: 'Vấn đề khác', icon: <MessageSquare size={18} /> },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Gửi thành công!</h2>
          <p className="text-gray-600 font-medium">
            Cảm ơn bạn đã phản hồi. Đội ngũ NebulaStudy sẽ xem xét và phản hồi sớm nhất có thể qua thông báo hệ thống.
          </p>
          <div className="pt-4">
             <Link href="/help">
               <Button className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                 Quay lại trung tâm trợ giúp
               </Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/help" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold mb-8 transition-colors group">
           <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
             <ArrowLeft size={18} />
           </div>
           Quay lại
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-orange-500/5 border-2 border-orange-100 space-y-10">
          <div className="text-center space-y-4">
             <h1 className="text-4xl font-black text-gray-800">Liên hệ hỗ trợ 🦸‍♂️</h1>
             <p className="text-gray-500 font-medium text-lg">Bạn gặp khó khăn? Đừng ngần ngại nhắn tin cho chúng mình nhé!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Tiêu đề yêu cầu</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all font-medium text-gray-800"
                placeholder="VD: Không đăng nhập được, Lỗi tạo flashcard..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Chủ đề</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-bold ${
                      formData.category === cat.value
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-md'
                        : 'border-gray-100 hover:border-orange-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {cat.icon}
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full min-h-[150px] p-6 rounded-2xl border-2 border-gray-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all font-medium text-gray-800 resize-none"
                placeholder="Hãy mô tả chi tiết vấn đề bạn đang gặp phải hoặc đề xuất của bạn..."
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Gửi yêu cầu ngay <Send size={24} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
