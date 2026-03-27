'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Video, 
  Star, 
  Sparkles, 
  ChevronRight, 
  GraduationCap, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  BookOpen,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await apiClient.get('/tutor/my/bookings');
      setBookings(data.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleReview = async (bookingId: string) => {
    try {
      await apiClient.post(`/tutor/booking/${bookingId}/review`, { rating, comment });
      // alert('Đánh giá thành công!');
      setReviewingId(null);
      fetchBookings();
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const getStatusConfig = (status: string) => {
    const map: any = {
      pending: { 
        label: 'Chờ thanh toán', 
        color: 'text-amber-500 bg-amber-50 border-amber-100',
        icon: <Clock size={14} />
      },
      confirmed: { 
        label: 'Sắp diễn ra', 
        color: 'text-sky-500 bg-sky-50 border-sky-100',
        icon: <Video size={14} />
      },
      completed: { 
        label: 'Đã hoàn thành', 
        color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
        icon: <CheckCircle2 size={14} />
      },
      cancelled: { 
        label: 'Đã huỷ', 
        color: 'text-rose-500 bg-rose-50 border-rose-100',
        icon: <XCircle size={14} />
      },
      no_show: { 
        label: 'Vắng mặt', 
        color: 'text-gray-500 bg-gray-50 border-gray-100',
        icon: <AlertCircle size={14} />
      }
    };
    return map[status] || map.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF9F5]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 selection:bg-orange-200 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/20 rounded-full blur-3xl -ml-40 -mb-40" />

      <div className="max-w-5xl mx-auto px-6 pt-20 relative z-10 space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-200 shadow-sm">
                 <GraduationCap size={14} /> Học cùng chuyên gia
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
                 Lịch học <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Của tôi</span>
              </h1>
              <p className="text-gray-400 font-bold text-lg">Quản lý các buổi học 1:1 và tiến trình kiến thức của bạn.</p>
           </div>

           <Link href="/learn/tutor">
              <Button className="rounded-2xl h-14 px-8 font-black bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all text-lg flex items-center gap-2">
                 <Sparkles size={20} /> Đặt lịch mới
              </Button>
           </Link>
        </header>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-[3.5rem] border-4 border-orange-50 p-20 text-center space-y-6 shadow-xl shadow-orange-500/5">
               <div className="w-24 h-24 bg-[#FFF9F5] rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto border-4 border-white shadow-inner">
                  <Calendar size={48} strokeWidth={2} />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-gray-900">Bạn chưa có lịch học nào</h3>
                 <p className="text-gray-400 font-bold max-w-xs mx-auto">
                    Hãy bắt đầu hành trình chinh phục kiến thức cùng gia sư xịn sò của Nebula nhé! ✨
                 </p>
               </div>
               <Link href="/learn/tutor">
                  <Button className="rounded-2xl h-12 px-8 font-black bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all">
                     Tìm gia sư ngay
                  </Button>
               </Link>
            </div>
          ) : (
            <div className="grid gap-8">
              {bookings.map((b) => {
                const config = getStatusConfig(b.status);
                return (
                  <div 
                    key={b.id} 
                    className={`group bg-white rounded-[3rem] border-4 border-orange-50 p-8 shadow-xl shadow-orange-500/5 flex flex-col lg:flex-row gap-10 lg:items-center relative overflow-hidden active:scale-[0.99] transition-all ${b.status === 'confirmed' ? 'ring-4 ring-sky-500/5' : ''}`}
                  >
                    {/* Status Ribbon (Mobile Only) */}
                    <div className="absolute top-0 right-10 lg:hidden">
                       <div className={`px-4 py-2 rounded-b-2xl font-black text-[10px] uppercase tracking-widest shadow-sm ${config.color}`}>
                          {config.label}
                       </div>
                    </div>

                    {/* Left: Session Date/Time Info */}
                    <div className="lg:w-1/4 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-2xl bg-[#FFF9F5] border-2 border-orange-100 flex flex-col items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                             <p className="text-[10px] font-black text-orange-400 leading-none mb-0.5">T.{new Date(b.session_date).getMonth() + 1}</p>
                             <p className="text-xl font-black text-gray-900 leading-none">{new Date(b.session_date).getDate()}</p>
                          </div>
                          <div>
                             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Thời gian</p>
                             <p className="text-xl font-black text-gray-900 tracking-tight">{b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}</p>
                          </div>
                       </div>
                       
                       <div className={`hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 ${config.color}`}>
                          {config.icon} {config.label}
                       </div>
                    </div>

                    {/* Middle: Tutor & Subject */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
                       <div className="relative group/avatar">
                          <div className="w-20 h-20 rounded-[1.75rem] bg-orange-100 border-4 border-white shadow-lg overflow-hidden ring-4 ring-orange-500/5 transition-transform group-hover/avatar:rotate-6">
                            {b.tutor_avatar ? (
                              <img src={b.tutor_avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-orange-500">
                                {b.tutor_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                       </div>

                       <div className="space-y-2 text-center sm:text-left flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                             <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors tracking-tight">
                                {b.tutor_name}
                             </h3>
                             <span className="px-3 py-1 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-lg w-fit mx-auto sm:mx-0">
                                {b.subject}
                             </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-bold text-gray-400">
                             <p className="flex items-center gap-1.5"><Video size={16} /> {b.platform === 'google_meet' ? 'Google Meet' : 'Zoom'}</p>
                             <p className="flex items-center gap-1.5"><BookOpen size={16} /> Học chính quy</p>
                          </div>
                       </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                       {b.status === 'confirmed' && (
                          <a 
                            href={b.meeting_url || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full h-14 rounded-2xl font-black bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/20 text-lg flex items-center justify-center gap-2 group/btn transition-all active:scale-95"
                          >
                             <PlayCircle size={22} className="group-hover/btn:scale-110 transition-transform" /> Vào học thôi!
                          </a>
                       )}

                       {b.status === 'pending' && (
                          <Button className="w-full h-14 rounded-2xl font-black bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 text-lg">
                             Thanh toán tiếp
                          </Button>
                       )}

                       {b.status === 'completed' && String(reviewingId) !== String(b.id) && (
                          <Button 
                            onClick={() => setReviewingId(b.id)}
                            variant="outline"
                            className="w-full h-14 rounded-2xl font-black border-2 border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200"
                          >
                             Đánh giá buổi học
                          </Button>
                       )}

                       {b.status === 'confirmed' && (
                          <p className="text-[10px] font-black text-sky-500 text-center uppercase tracking-widest animate-pulse">Lớp sắp bắt đầu!</p>
                       )}
                    </div>

                    {/* Review Modal-like inline form */}
                    {reviewingId === b.id && (
                      <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                         <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <Star size={32} fill="currentColor" />
                         </div>
                         <h4 className="text-2xl font-black text-gray-900 mb-2">Đánh giá gia sư {b.tutor_name}</h4>
                         <p className="text-gray-400 font-bold mb-6">Buổi học của bạn tuyệt vời chứ? Đừng ngại chia sẻ nhé!</p>
                         
                         <div className="flex gap-4 mb-8">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <button 
                                key={v} 
                                onClick={() => setRating(v)} 
                                className="transform hover:scale-125 transition-all outline-none"
                              >
                                <Star size={36} className={v <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} strokeWidth={3} />
                              </button>
                            ))}
                         </div>

                         <div className="w-full max-w-md space-y-4">
                            <textarea
                              className="w-full p-6 bg-gray-50 border-4 border-gray-100 rounded-[2rem] text-sm font-bold focus:bg-white focus:border-orange-200 outline-none transition-all placeholder-gray-300 shadow-inner"
                              rows={3}
                              placeholder="Nhập cảm nhận của bạn tại đây..."
                              value={comment}
                              onChange={e => setComment(e.target.value)}
                            />
                            
                            <div className="flex gap-4">
                               <Button 
                                 onClick={() => setReviewingId(null)}
                                 variant="outline"
                                 className="flex-1 h-12 rounded-xl font-black border-2 border-gray-100 text-gray-400 hover:bg-gray-50"
                               >
                                 Bỏ qua
                               </Button>
                               <Button 
                                 onClick={() => handleReview(b.id)}
                                 className="flex-1 h-12 rounded-xl font-black bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                               >
                                 Gửi đánh giá ✨
                               </Button>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivation Footer */}
        <div className="text-center pt-12 space-y-4">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Tinh vân Nebula ✨</p>
           <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed italic">
             "Mỗi buổi học là một hạt giống tri thức. Hãy kiên trì chăm sóc để hái quả ngọt bạn nhé!"
           </p>
        </div>

      </div>
    </div>
  );
}
