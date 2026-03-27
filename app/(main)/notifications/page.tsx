'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  Bell, 
  CheckCheck, 
  Sparkles, 
  Trash2, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Zap,
  Flame,
  Calendar,
  CreditCard,
  Target,
  Info,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ICON_MAP: Record<string, React.ReactNode> = {
  flashcard_review_due: <Zap size={20} className="text-amber-500" />,
  streak_reminder: <Flame size={20} className="text-orange-500" />,
  booking_confirmed: <Calendar size={20} className="text-blue-500" />,
  booking_reminder: <Clock size={20} className="text-indigo-500" />,
  payment_success: <CreditCard size={20} className="text-emerald-500" />,
  payment_failed: <AlertCircle size={20} className="text-rose-500" />,
  system: <Info size={20} className="text-sky-500" />,
};

const TYPE_LABEL: Record<string, string> = {
  flashcard_review_due: 'Flashcard',
  streak_reminder: 'Học tập',
  booking_confirmed: 'Lịch học',
  booking_reminder: 'Nhắc nhở',
  payment_success: 'Thanh toán',
  payment_failed: 'Lỗi',
  system: 'Hệ thống',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/notification', {
        params: { unread_only: unreadOnly ? 'true' : undefined, limit: 50 }
      });
      setNotifications(data.data.items || []);
      setUnreadCount(data.data.unread_count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [unreadOnly]);

  const markOneRead = async (id: string) => {
    try {
      await apiClient.patch('/notification/' + id + '/read');
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notification/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 selection:bg-orange-200 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/20 rounded-full blur-3xl -ml-40 -mb-40" />

      <div className="max-w-4xl mx-auto px-6 pt-20 relative z-10 space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-200 shadow-sm">
                 <Sparkles size={14} /> Có gì mới hôm nay?
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
                 Hộp <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Thông báo</span>
              </h1>
              <p className="text-gray-400 font-bold text-lg">Cập nhật những hoạt động quan trọng nhất của bạn.</p>
           </div>

           <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button 
                  onClick={markAllRead}
                  variant="outline"
                  className="rounded-2xl h-14 px-6 font-black border-2 border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckCheck size={20} strokeWidth={3} /> Đã đọc hết
                </Button>
              )}
           </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex p-2 bg-white rounded-[2rem] border-4 border-orange-50 shadow-xl shadow-orange-500/5 w-fit">
           <button
             onClick={() => setUnreadOnly(false)}
             className={`px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all ${
               !unreadOnly 
                 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                 : 'text-gray-400 hover:text-orange-500'
             }`}
           >
             Tất cả
           </button>
           <button
             onClick={() => setUnreadOnly(true)}
             className={`px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all flex items-center gap-2 ${
               unreadOnly 
                 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                 : 'text-gray-400 hover:text-orange-500'
             }`}
           >
             Chưa đọc
             {unreadCount > 0 && (
               <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${unreadOnly ? 'bg-white text-orange-500' : 'bg-rose-100 text-rose-500'}`}>
                 {unreadCount}
               </span>
             )}
           </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-[2.5rem] border-4 border-orange-50 animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-[3.5rem] border-4 border-orange-50 p-20 text-center space-y-6 shadow-xl shadow-orange-500/5">
               <div className="w-24 h-24 bg-[#FFF9F5] rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto border-4 border-white shadow-inner">
                  <Bell size={48} strokeWidth={2} />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-gray-900">
                    {unreadOnly ? 'Vắng lặng quá...' : 'Hộp thư trống'}
                 </h3>
                 <p className="text-gray-400 font-bold max-w-xs mx-auto">
                    {unreadOnly ? 'Bạn đã đọc toàn bộ tin nhắn rồi đó! ✨' : 'Các thông báo mới từ NebulaStudy sẽ xuất hiện tại đây.'}
                 </p>
               </div>
               <Link href="/dashboard">
                  <Button className="rounded-2xl h-12 px-8 font-black bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all">
                     Quay lại Dashboard
                  </Button>
               </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markOneRead(n.id)}
                  className={`group relative flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer ${
                    !n.is_read
                      ? 'bg-white border-orange-200 shadow-2xl shadow-orange-500/10 hover:-translate-y-1'
                      : 'bg-white/60 border-orange-50 hover:border-orange-100'
                  }`}
                >
                  {/* Unread dot */}
                  {!n.is_read && (
                    <div className="absolute top-8 right-8 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                  )}

                  {/* Icon Area */}
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform ${!n.is_read ? 'bg-[#FFF9F5]' : 'bg-gray-50 opacity-60'}`}>
                    {ICON_MAP[n.type] || <Bell size={20} className="text-gray-400" />}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg w-fit mx-auto md:mx-0 ${!n.is_read ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                         {TYPE_LABEL[n.type] || 'Thông báo'}
                       </span>
                       <p className={`text-xs font-black text-gray-300 flex items-center gap-1 justify-center md:justify-start`}>
                          <Clock size={12} /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: vi })}
                       </p>
                    </div>
                    <h4 className={`text-xl font-black leading-tight ${!n.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                      {n.title}
                    </h4>
                    <p className={`text-sm font-medium leading-relaxed ${!n.is_read ? 'text-gray-600' : 'text-gray-400'}`}>
                      {n.body}
                    </p>
                  </div>

                  {/* Action Link (Mock) */}
                  <div className={`opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all hidden md:block`}>
                     <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                        <ChevronRight size={24} strokeWidth={3} />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Motivation */}
        <div className="text-center pt-8 space-y-4">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Tinh vân Nebula ✨</p>
           <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed italic">
             "Mỗi thông báo là một bước chân nhỏ trên hành trình chinh phục vũ trụ tri thức của bạn."
           </p>
        </div>

      </div>
    </div>
  );
}
