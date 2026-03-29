'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Video, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  BookOpen,
  User,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import CuteModal from '@/components/ui/CuteModal';

export default function MySessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateConfig, setUpdateConfig] = useState<{ id: string, status: 'confirmed' | 'cancelled' } | null>(null);

  const fetchSessions = async () => {
    try {
      const { data } = await apiClient.get('/tutor/my/sessions');
      setSessions(data.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateStatus = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setUpdateConfig({ id: bookingId, status });
    setIsModalOpen(true);
  };

  const confirmUpdateStatus = async () => {
    if (!updateConfig) return;
    try {
      await apiClient.patch(`/tutor/bookings/${updateConfig.id}/status`, { status: updateConfig.status });
      fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsModalOpen(false);
      setUpdateConfig(null);
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
    <>
      <div className="min-h-screen bg-[#FFF9F5] pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64" />
        
        <div className="max-w-5xl mx-auto px-6 pt-20 relative z-10 space-y-12">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-200 shadow-sm">
                   <UserCheck size={14} /> Chế độ Gia Sư
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
                   Lịch dạy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Của tôi</span>
                </h1>
                <p className="text-gray-400 font-bold text-lg">Quản lý các buổi dạy và tương tác với học sinh.</p>
             </div>
          </header>

          <div className="space-y-6">
            {sessions.length === 0 ? (
              <div className="bg-white rounded-[3.5rem] border-4 border-orange-50 p-20 text-center space-y-6 shadow-xl shadow-orange-500/5">
                 <div className="w-24 h-24 bg-[#FFF9F5] rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto border-4 border-white shadow-inner">
                    <Calendar size={48} strokeWidth={2} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900">Bạn chưa có lịch dạy nào</h3>
                 <p className="text-gray-400 font-bold max-w-xs mx-auto">Hồ sơ của bạn sẽ sớm có học sinh đặt lịch thôi. Hãy chuẩn bị bài giảng thật tốt nhé! ✨</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {sessions.map((s) => {
                  const config = getStatusConfig(s.status);
                  return (
                    <div 
                      key={s.id} 
                      className="group bg-white rounded-[3rem] border-4 border-orange-50 p-8 shadow-xl shadow-orange-500/5 flex flex-col lg:flex-row gap-10 lg:items-center relative"
                    >
                      <div className="lg:w-1/4 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl bg-[#FFF9F5] border-2 border-orange-100 flex flex-col items-center justify-center shadow-inner`}>
                               <p className="text-[10px] font-black text-orange-400 leading-none mb-0.5">T.{new Date(s.session_date).getMonth() + 1}</p>
                               <p className="text-xl font-black text-gray-900 leading-none">{new Date(s.session_date).getDate()}</p>
                            </div>
                            <div>
                               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Thời gian</p>
                               <p className="text-xl font-black text-gray-900 tracking-tight">{s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}</p>
                            </div>
                         </div>
                         <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 ${config.color}`}>
                            {config.icon} {config.label}
                         </div>
                      </div>

                      <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
                         <div className="w-20 h-20 rounded-[1.75rem] bg-indigo-100 border-4 border-white shadow-lg overflow-hidden shrink-0">
                           {s.student_avatar ? (
                             <img src={s.student_avatar} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-2xl font-black text-indigo-500">
                               {s.student_name?.charAt(0).toUpperCase()}
                             </div>
                           )}
                         </div>
                         <div className="space-y-2 text-center sm:text-left flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                               <h3 className="text-2xl font-black text-gray-900">{s.student_name}</h3>
                               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-lg">
                                  {s.subject}
                               </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 flex items-center gap-1.5 justify-center sm:justify-start">
                               <User size={16} /> Học sinh Nebula
                            </p>
                            {s.notes && (
                              <p className="text-xs text-gray-400 italic font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                                 " {s.notes} "
                              </p>
                            )}
                         </div>
                      </div>

                      <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                         {s.status === 'confirmed' && (
                            <a 
                              href={s.meeting_url || '#'} 
                              target="_blank" rel="noreferrer"
                              className="w-full h-14 rounded-2xl font-black bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                               <Video size={20} /> Vào dạy học
                            </a>
                         )}

                         {s.status === 'confirmed' && (
                            <Button 
                              onClick={() => handleUpdateStatus(s.id, 'cancelled')}
                              variant="outline"
                              className="w-full h-12 rounded-xl font-black border-2 border-rose-100 text-rose-500 hover:bg-rose-50"
                            >
                               Huỷ buổi dạy
                            </Button>
                         )}

                         {s.status === 'pending' && (
                            <p className="text-[10px] font-black text-amber-500 text-center uppercase tracking-widest bg-amber-50 py-2 rounded-xl border border-amber-100">
                               Chờ học sinh thanh toán
                            </p>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <CuteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmUpdateStatus}
        title="Xác nhận thay đổi"
        description={`Bạn có chắc muốn ${updateConfig?.status === 'confirmed' ? 'xác nhận' : 'huỷ'} buổi học này không?`}
        type="confirm"
      />
    </>
  );
}
