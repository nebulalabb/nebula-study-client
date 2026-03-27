'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, ChevronRight, User, BookOpen, Calendar as CalIcon, Sparkles, Rocket, ArrowLeft, Heart, Award, Clock, ShieldCheck, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TutorRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [myProfile, setMyProfile] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await apiClient.get('/tutor/my-profile');
        if (data.success && data.data.profile) {
          setMyProfile(data.data.profile);
        }
      } catch (err) {
        console.error('Error checking tutor status:', err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkStatus();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    bio: '',
    education: '',
    experience_years: 0,
    hourly_rate_vnd: 150000,
    teaching_style: '',
    video_intro_url: '',
    subjects: [{ subject: 'Toán học', grade_levels: ['12'], proficiency: 'advanced' }],
    availabilities: [] as any[]
  });

  const updateForm = (key: string, val: any) => setFormData(p => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/tutor/register', formData);
      alert('Đăng ký hồ sơ gia sư thành công! Hệ thống đang chờ duyệt.');
      router.push('/learn/tutor');
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (isLoadingStatus) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (myProfile) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] pb-24">
        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12 text-center">
          <div className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-16 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-bl-[8rem] opacity-50 -mr-20 -mt-20" />
            
            <div className="relative z-10 space-y-8">
              {myProfile.status === 'pending' && (
                <>
                  <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                    <Clock size={48} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hồ sơ đang chờ duyệt ✨</h1>
                  <p className="text-xl text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
                    Nebula đã nhận được hồ sơ "xịn sò" của bạn! Đội ngũ Admin đang kiểm tra thông tin và sẽ phản hồi bạn sớm nhất có thể.
                  </p>
                  <div className="pt-8">
                    <Link href="/learn/tutor" className="px-10 py-5 bg-orange-50 text-orange-600 font-black rounded-2xl hover:bg-orange-100 transition-all text-lg">
                      Quay lại Trang chủ
                    </Link>
                  </div>
                </>
              )}

              {myProfile.status === 'approved' && (
                <>
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                    <ShieldCheck size={48} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">Chúc mừng, Gia sư Nebula! 🎉</h1>
                  <p className="text-xl text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
                    Hồ sơ của bạn đã được phê duyệt chính thức. Bạn đã sẵn sàng truyền cảm hứng cho hàng ngàn học sinh rồi đấy!
                  </p>
                  <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/my/sessions" className="px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl shadow-2xl shadow-orange-500/30 hover:scale-105 transition-all text-lg">
                      Vào Dashboard Quản lý
                    </Link>
                    <Link href="/learn/tutor" className="px-10 py-5 bg-white border-2 border-orange-50 text-gray-400 font-black rounded-2xl hover:border-orange-200 transition-all text-lg">
                      Xem danh sách Gia sư
                    </Link>
                  </div>
                </>
              )}

              {myProfile.status === 'rejected' && (
                <>
                  <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                    <XCircle size={48} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hồ sơ cần điều chỉnh ✍️</h1>
                  <p className="text-xl text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
                    Admin có một vài lưu ý cho hồ sơ của bạn: <br/>
                    <span className="text-rose-500 italic mt-2 block">"{myProfile.reject_reason || 'Thông tin chưa đầy đủ'}"</span>
                  </p>
                  <div className="pt-8">
                    <button 
                      onClick={() => setMyProfile(null)}
                      className="px-10 py-5 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all text-lg"
                    >
                      Bấm để Sửa hồ sơ ngay
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12">
        
        <div className="text-center space-y-6 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
             <Sparkles size={120} className="text-orange-200" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tighter leading-tight relative z-10">
            Trở thành <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Gia Sư</span> Nebula
          </h1>
          <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed relative z-10">
            Chia sẻ kiến thức, truyền cảm hứng và tạo thu nhập cùng hàng ngàn học sinh hiếu học trên khắp cả nước. ✨
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center max-w-2xl mx-auto relative px-4">
           <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-2 bg-orange-50 rounded-full -z-10" />
           <div className="absolute left-8 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full -z-10 transition-all duration-700" style={{ width: `${(step - 1) * 44}%` }} />
           
           {[
             { num: 1, label: 'Cá nhân', icon: <User size={20} /> },
             { num: 2, label: 'Chuyên môn', icon: <Award size={20} /> },
             { num: 3, label: 'Lịch dạy', icon: <CalIcon size={20} /> },
           ].map(s => {
             const isActive = step >= s.num;
             const isDone = step > s.num;
             return (
               <div key={s.num} className="flex flex-col items-center gap-3 bg-[#FFF9F5] px-4 animate-in zoom-in-95 duration-500">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 font-black transition-all transform ${
                    isActive 
                      ? 'bg-orange-500 border-orange-100 text-white shadow-xl shadow-orange-500/20 scale-110' 
                      : 'bg-white border-orange-50 text-gray-300'
                  }`}>
                    {isDone ? <CheckCircle2 size={24} strokeWidth={3} /> : s.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-orange-600' : 'text-gray-300'}`}>
                    {s.label}
                  </span>
               </div>
             );
           })}
        </div>

        {/* Form Content */}
        <div className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

           {step === 1 && (
             <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 rotate-3">
                      <User size={24} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-950 tracking-tight">Hồ sơ cá nhân</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Trường học / Bằng cấp hiện tại *</label>
                  <input 
                    className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-gray-900 transition-all placeholder:text-gray-200" 
                    placeholder="VD: Sinh viên năm 4 ĐH Bách Khoa TP.HCM"
                    value={formData.education} onChange={e => updateForm('education', e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Lời giới thiệu (Bio) hấp dẫn *</label>
                  <textarea 
                    className="w-full px-8 py-6 bg-[#FFF9F5] border-4 border-orange-50 rounded-[2.5rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-200 resize-none leading-relaxed" 
                    rows={4} placeholder="Hãy kể về niềm đam mê giảng dạy của bạn để thu hút học sinh nhé..."
                    value={formData.bio} onChange={e => updateForm('bio', e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Kinh nghiệm giảng dạy (Số năm)</label>
                  <div className="relative max-w-xs">
                    <input 
                      type="number"
                      className="w-full pl-8 pr-16 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-orange-500 text-xl transition-all" 
                      value={formData.experience_years} onChange={e => updateForm('experience_years', Number(e.target.value))}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300 uppercase text-[10px] tracking-widest">NĂM</span>
                  </div>
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20 -rotate-3">
                      <Award size={24} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-950 tracking-tight">Kỹ năng & Chi phí</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Học phí đề xuất mỗi giờ (VNĐ) *</label>
                  <div className="relative max-w-md">
                    <input 
                      type="text"
                      className="w-full pl-8 pr-16 py-6 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-black text-orange-600 text-3xl transition-all shadow-inner" 
                      value={formData.hourly_rate_vnd.toLocaleString('vi-VN')} 
                      onChange={e => {
                        const val = e.target.value.replace(/\./g, '');
                        if (!isNaN(Number(val))) updateForm('hourly_rate_vnd', Number(val));
                      }}
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl font-serif lowercase">đ</span>
                  </div>
                  <p className="text-[10px] text-gray-300 font-bold italic ml-2">Trung bình gia sư trên Nebula nhận khoảng 150.000đ - 300.000đ/giờ ✨</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phương pháp giảng dạy độc bản</label>
                  <textarea 
                    className="w-full px-8 py-6 bg-[#FFF9F5] border-4 border-orange-50 rounded-[2.5rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-200 resize-none leading-relaxed" 
                    rows={4} placeholder="Cách bạn làm bài học trở nên thú vị và dễ hiểu hơn..."
                    value={formData.teaching_style} onChange={e => updateForm('teaching_style', e.target.value)}
                  />
                  {/* Wait, the updateForm bind above is wrong, let's just use regular arrow */}
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Video Intro (YouTube/TikTok) - Tùy chọn</label>
                  <div className="relative">
                    <input 
                      className="w-full px-8 py-5 bg-[#FFF9F5] border-4 border-orange-50 rounded-[1.75rem] focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-orange-500 transition-all placeholder:text-gray-200" 
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.video_intro_url} onChange={e => updateForm('video_intro_url', e.target.value)}
                    />
                    <Rocket className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-200" size={20} />
                  </div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 rotate-6">
                      <CalIcon size={24} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-950 tracking-tight">Sẵn sàng huấn luyện</h2>
                </div>
                
                <div className="p-10 border-4 border-dashed border-orange-100 bg-orange-50/50 rounded-[3rem] text-center space-y-6">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl text-orange-500 rotate-6">
                      <Heart size={32} className="fill-current" />
                   </div>
                   <h4 className="text-xl font-black text-orange-700 tracking-tight">Bạn tuyệt vời lắm!</h4>
                   <p className="text-gray-600 font-bold leading-relaxed max-w-sm mx-auto">
                     Trong phiên bản hiện tại, Nebula sẽ mặc định gán cho bạn môn <strong>Toán lớp 12</strong> và lịch dạy buổi tối. 
                     <br/><br/>
                     Bạn có thể thay đổi chi tiết hồ sơ ngay sau khi được Admin phê duyệt nhé! ✨
                   </p>
                </div>
             </div>
           )}

           {/* Actions */}
           <div className="mt-16 pt-10 border-t-2 border-orange-50 flex items-center justify-between gap-6 relative z-10">
              <button 
                onClick={prevStep} 
                disabled={step === 1}
                className={`px-8 py-4 font-black transition-all flex items-center gap-2 rounded-xl border-2 ${
                  step === 1 ? 'opacity-0' : 'bg-white border-orange-50 text-gray-400 hover:text-orange-500 hover:border-orange-100 active:scale-95'
                }`}
              >
                <ArrowLeft size={20} strokeWidth={3} /> Quay lại
              </button>

              {step < 3 ? (
                <button 
                   onClick={nextStep}
                   className="px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center gap-3 hover:from-orange-600 hover:to-rose-600 shadow-2xl shadow-orange-500/30 active:scale-95 transition-all text-lg group"
                >
                  Tiếp tục bước kế <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                   onClick={handleSubmit} 
                   disabled={isSubmitting}
                   className="px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center gap-3 hover:from-orange-600 hover:to-rose-600 shadow-2xl shadow-orange-500/30 active:scale-95 transition-all text-lg"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Hoàn thành Đăng ký <Rocket size={24} className="animate-bounce" />
                    </>
                  )}
                </button>
              )}
           </div>

        </div>

        <div className="text-center">
           <Link href="/learn/tutor" className="text-sm font-black text-gray-300 hover:text-orange-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
              Huỷ đăng ký & quay lại tìm gia sư
           </Link>
        </div>
      </div>
    </div>
  );
}
