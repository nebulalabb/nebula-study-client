'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { BookingCalendar } from '@/components/tutor/BookingCalendar';
import { Star, MapPin, GraduationCap, Video, BookOpen, Quote, CheckCircle2, Award, Heart, MessageCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingRef, setBookingRef] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState<string>('');

  useEffect(() => {
    apiClient.get('/tutor/' + params.tutor_id)
      .then(res => {
         setData(res.data.data);
         if (res.data.data.subjects?.length > 0) {
           setSubjectSelected(res.data.data.subjects[0].subject);
         }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params.tutor_id]);

  const handleBook = async (date: string, startTime: string, durationMinutes: number) => {
    if (!subjectSelected) return alert('Vui lòng chọn môn học');
    
    setBookingRef(true);
    try {
      const { data: bData } = await apiClient.post('/tutor/' + params.tutor_id + '/book', {
        subject: subjectSelected,
        session_date: date,
        start_time: startTime,
        duration_minutes: durationMinutes,
        notes: ''
      });
      
      const bookingId = bData.data.booking_id;
      // Trực tiếp redirect qua VNPay url sinh tự động
      const { data: pData } = await apiClient.post('/billing/booking/' + bookingId + '/pay', {
        return_url: window.location.origin + '/my/bookings'
      });
      
      window.location.href = pData.data.checkout_url;
      
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
      setBookingRef(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-orange-500/10">
            <GraduationCap size={40} className="text-orange-500" />
          </div>
          <p className="text-lg font-black text-orange-400 animate-pulse tracking-widest uppercase">Đang tải hồ sơ bảo mật...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-20">
        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-orange-50 text-center shadow-xl shadow-orange-500/5">
           <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Không tìm thấy gia sư này bạn ơi 😭</h2>
           <Link href="/learn/tutor" className="px-8 py-3 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2 mx-auto w-fit">
              <ChevronLeft size={20} className="stroke-[3px]" /> Ghé thư viện xem sao
           </Link>
        </div>
      </div>
    );
  }

  const { profile, subjects, availabilities, reviews } = data;

  return (
    <div className="bg-[#FFF9F5] min-h-screen pb-24 font-medium">
      
      {/* Banner Cover */}
      <div className="h-64 md:h-96 w-full bg-gradient-to-br from-orange-500 via-rose-500 to-rose-600 relative overflow-hidden">
         <div className="absolute inset-0 bg-white/10" />
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl -ml-20 -mb-20" />
         
         <div className="max-w-6xl mx-auto px-6 h-full flex items-center">
            <Link href="/learn/tutor" className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-2xl font-black transition-all border border-white/20 -mt-20">
               <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform stroke-[3px]" /> Quay lại
            </Link>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 md:-mt-48 relative z-10 w-full flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Col - Info */}
        <div className="flex-1 w-full space-y-10">
           
           <div className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 transition-all hover:border-orange-100/50">
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] bg-orange-100 p-1.5 shrink-0 overflow-hidden shadow-2xl border-8 border-white group-hover:rotate-2 transition-transform">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="tutor" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-black text-orange-400">
                      {profile.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={12} strokeWidth={3} /> Trusted Mentor
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter leading-none">{profile.full_name}</h1>
                  <h2 className="text-xl text-gray-400 font-bold">{profile.education}</h2>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-8 border-t-2 border-orange-50 mt-8">
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Đánh giá</span>
                       <div className="flex items-center gap-2 text-orange-500 font-black">
                         <Star size={20} className="fill-current" />
                         <span className="text-2xl tracking-tighter">{Number(profile.rating_avg).toFixed(1)}</span>
                         <span className="text-xs font-bold text-gray-300">({profile.review_count})</span>
                       </div>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Kinh nghiệm</span>
                       <div className="flex items-center gap-2 text-gray-800 font-black">
                         <Award size={20} className="text-orange-500" />
                         <span className="text-2xl tracking-tighter">{profile.experience_years} +</span>
                         <span className="text-xs font-bold text-gray-300">năm KN</span>
                       </div>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Buổi dạy</span>
                       <div className="flex items-center gap-2 text-gray-800 font-black">
                         <Video size={20} className="text-orange-500" />
                         <span className="text-2xl tracking-tighter">{profile.total_sessions}</span>
                         <span className="text-xs font-bold text-gray-300">đã học</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-white border-2 border-orange-50/50 rounded-[3rem] p-10 md:p-14 space-y-10 shadow-xl shadow-orange-500/5">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-gray-950 flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
                    <Heart size={20} className="fill-current" />
                  </div>
                  Giới thiệu bản thân
                </h3>
                <p className="text-gray-600 font-bold leading-relaxed whitespace-pre-line text-lg">
                  {profile.bio}
                </p>
              </div>

              <div className="space-y-4 pt-10 border-t-2 border-orange-50">
                <h3 className="text-2xl font-black text-gray-950 flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  Phương pháp giảng dạy
                </h3>
                <p className="text-gray-600 font-bold leading-relaxed whitespace-pre-line">
                  {profile.teaching_style}
                </p>
              </div>
           </div>
           
           {reviews && reviews.length > 0 && (
             <div className="bg-white border-2 border-orange-50/50 rounded-[3rem] p-10 md:p-14 shadow-xl shadow-orange-500/5">
                <h3 className="text-2xl font-black text-gray-950 mb-10 flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
                    <MessageCircle size={20} />
                  </div>
                  Nhận xét từ học viên
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((r: any, i: number) => (
                    <div key={i} className="bg-orange-50/50 p-8 rounded-[2.5rem] border-2 border-orange-100 relative group overflow-hidden transition-all hover:bg-white hover:shadow-xl hover:shadow-orange-500/5">
                       <Quote className="absolute top-6 right-6 text-orange-100 group-hover:text-orange-200 transition-colors" size={48} />
                       <div className="flex gap-1 text-orange-400 mb-4 relative z-10">
                         {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={14} className="fill-current" />)}
                       </div>
                       <p className="text-gray-600 font-bold italic mb-6 leading-relaxed relative z-10">"{r.comment}"</p>
                       <div className="flex items-center gap-3 relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-white border-2 border-orange-100 overflow-hidden shadow-sm">
                             {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-50 flex items-center justify-center font-black text-orange-300">{r.full_name?.charAt(0)}</div>}
                          </div>
                          <span className="font-black text-sm text-gray-950 tracking-tight">{r.full_name}</span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

        </div>

        {/* Right Col - Booking Widget */}
        <div className="w-full lg:w-[450px] shrink-0 space-y-8 sticky top-24">
           
           {/* Subject Selector */}
           <div className="bg-white border-2 border-orange-50/50 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[3rem] opacity-50 -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
              
              <h3 className="text-xl font-black text-gray-950 mb-8 flex items-center gap-3 tracking-tight relative z-10">
                <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                    <BookOpen size={20} />
                </div>
                Bạn muốn học môn gì?
              </h3>
              <div className="space-y-4 relative z-10">
                 {subjects.map((s: any) => (
                   <button
                     key={s.subject}
                     onClick={() => setSubjectSelected(s.subject)}
                     className={`w-full text-left p-6 rounded-[1.75rem] border-4 transition-all flex flex-col gap-3 relative overflow-hidden ${
                       subjectSelected === s.subject 
                        ? 'border-orange-500 bg-orange-50 shadow-inner' 
                        : 'border-orange-50 bg-white hover:border-orange-200 hover:bg-orange-50/20'
                     }`}
                   >
                     <div className="flex justify-between items-center">
                       <span className={`font-black text-lg tracking-tight ${subjectSelected === s.subject ? 'text-orange-950' : 'text-gray-900 group-hover:text-orange-600'}`}>{s.subject}</span>
                       {subjectSelected === s.subject && <div className="p-1 px-3 bg-orange-500 text-white text-[8px] font-black uppercase rounded-lg shadow-sm">Đang chọn</div>}
                     </div>
                     <div className="flex flex-wrap gap-1.5">
                        {s.grade_levels.map((g: string) => (
                          <span key={g} className="px-3 py-1 bg-white border-2 border-orange-50 text-gray-400 rounded-lg text-[9px] font-black tracking-widest shadow-sm">LỚP {g}</span>
                        ))}
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           {/* Booking Calendar directly */}
           <BookingCalendar 
             availabilities={availabilities} 
             hourlyRateVnd={profile.hourly_rate_vnd} 
             onConfirm={handleBook}
             isSubmitting={bookingRef}
           />

        </div>
      </div>
    </div>
  );
}
