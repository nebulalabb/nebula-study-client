'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  Trophy, 
  Star, 
  Flame, 
  Award, 
  Target, 
  TrendingUp, 
  Sparkles,
  Crown,
  BookOpen,
  ShieldCheck,
  Zap,
  Heart,
  User,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface StudentStats {
  total_solved: number;
  accuracy: number;
  achievements: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  streak: number;
  role: string;
  created_at: string;
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchPublicProfile = async () => {
      try {
        const res = await apiClient.get(`/user/${id}`);
        setProfile(res.data.data.profile);
        setStats(res.data.data.stats);
      } catch (err) {
        console.error('Failed to fetch public profile:', err);
        setError('Không tìm thấy người dùng hoặc đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF9F5]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F5] p-6 space-y-6 text-center">
         <div className="w-24 h-24 bg-rose-100 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10">
            <User size={48} strokeWidth={2.5} />
         </div>
         <h2 className="text-2xl font-black text-gray-900">Ối!</h2>
         <p className="text-gray-400 font-bold max-w-md">{error || 'Không tìm thấy thông tin người dùng.'}</p>
         <Button 
           onClick={() => router.back()}
           className="rounded-2xl px-10 h-14 font-black bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
         >
            Quay lại
         </Button>
      </div>
    );
  }

  const achievementIcons: Record<string, React.ReactNode> = {
    zap: <Zap size={20} />,
    heart: <Heart size={20} />,
    target: <Target size={20} />,
    crown: <Crown size={20} />,
  };

  const achievementColors: Record<string, string> = {
    zap: "bg-amber-400",
    heart: "bg-rose-400",
    target: "bg-emerald-400",
    crown: "bg-indigo-400",
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 selection:bg-orange-200 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/20 rounded-full blur-3xl -ml-40 -mb-40" />

      <div className="max-w-5xl mx-auto px-6 pt-12 relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-orange-500 font-black uppercase tracking-widest text-xs transition-colors group"
        >
           <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100">
             <ArrowLeft size={16} />
           </div>
           Quay lại
        </button>

        {/* Main Profile Card */}
        <div className="bg-white rounded-[3.5rem] border-4 border-orange-50 shadow-2xl shadow-orange-500/5 overflow-hidden flex flex-col md:flex-row items-stretch">
          
          {/* Left Side: Avatar & Basic Info */}
          <div className="md:w-1/3 bg-gradient-to-br from-orange-400 to-rose-500 p-12 text-center text-white space-y-8 relative overflow-hidden">
             {/* Sparkle effects */}
             <div className="absolute top-4 left-4 opacity-20"><Sparkles size={24} /></div>
             <div className="absolute bottom-10 right-6 opacity-20 rotate-12"><Crown size={48} /></div>
             
             <div className="relative z-10 space-y-6">
                <div className="relative inline-block group">
                   <div className="w-32 h-32 rounded-[3.5rem] bg-white border-8 border-white/20 shadow-2xl overflow-hidden transform group-hover:scale-110 transition-transform duration-500 ring-4 ring-orange-500/10">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white flex items-center justify-center text-orange-500 font-black text-5xl">
                          {profile.full_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-amber-400 p-2 rounded-2xl shadow-lg border-4 border-white text-white">
                      <Star size={20} fill="currentColor" />
                   </div>
                </div>

                <div className="space-y-1">
                   <h1 className="text-3xl font-black tracking-tight leading-tight">{profile.full_name}</h1>
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/30">
                      <ShieldCheck size={14} /> {profile.role === 'admin' ? 'Quản trị viên' : 'Học sinh Nebula'}
                   </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                   <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Cấp độ</p>
                      <p className="text-2xl font-black">{profile.level || 1}</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Chuỗi ngày</p>
                      <p className="text-2xl font-black">{profile.streak || 0}</p>
                   </div>
                </div>

                <div className="pt-4">
                   <Button className="w-full rounded-2xl h-14 font-black bg-white text-orange-600 hover:bg-orange-50 shadow-xl shadow-orange-900/10 active:scale-95 transition-all text-lg border-none flex items-center justify-center gap-2">
                      <Flame size={20} fill="currentColor" /> Kết bạn ngay
                   </Button>
                </div>
             </div>
          </div>

          {/* Right Side: Stats & Details */}
          <div className="md:w-2/3 p-12 space-y-12">
             
             {/* XP Progress Section */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 text-orange-500 rounded-2xl">
                         <TrendingUp size={24} strokeWidth={3} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-950 tracking-tight">Thành tích học tập</h2>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Kinh nghiệm tích lũy</p>
                      <p className="text-2xl font-black text-orange-500 tracking-tighter">{profile.xp?.toLocaleString()} <span className="text-sm">XP</span></p>
                   </div>
                </div>

                <div className="relative pt-4">
                   <div className="h-6 w-full bg-gray-50 rounded-full border-4 border-white shadow-inner overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full shadow-lg" style={{ width: `${((profile.xp || 0) % 1000) / 10}%` }} />
                   </div>
                   <div className="flex justify-between mt-3 px-1">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">LV {profile.level || 1}</p>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">LV {(profile.level || 1) + 1}</p>
                   </div>
                </div>
             </div>

             {/* Dynamic Stats Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-[#FFF9F5] rounded-[2rem] border-4 border-orange-50 space-y-4 hover:border-orange-100 transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                         <BookOpen size={20} strokeWidth={3} />
                      </div>
                      <p className="font-black text-gray-900 tracking-tight text-lg">Câu hỏi đã vượt qua</p>
                   </div>
                   <p className="text-4xl font-black text-gray-950 tracking-tighter">{stats?.total_solved || 0} <span className="text-sm text-gray-300">câu</span></p>
                </div>

                <div className="p-6 bg-[#FFF9F5] rounded-[2rem] border-4 border-orange-50 space-y-4 hover:border-orange-100 transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                         <Target size={20} strokeWidth={3} />
                      </div>
                      <p className="font-black text-gray-900 tracking-tight text-lg">Tỉ lệ chính xác</p>
                   </div>
                   <p className="text-4xl font-black text-gray-950 tracking-tighter">{stats?.accuracy || 0} <span className="text-sm text-gray-300">%</span></p>
                </div>
             </div>

             {/* Achievements Section */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-amber-100 text-amber-500 rounded-2xl">
                      <Star size={24} fill="currentColor" />
                   </div>
                   <h2 className="text-2xl font-black text-gray-950 tracking-tight">Huy hiệu thành tựu</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {stats?.achievements && stats.achievements.length > 0 ? (
                     stats.achievements.map((item, idx) => (
                       <div key={idx} className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
                          <div className={`w-16 h-16 ${achievementColors[item.id] || 'bg-gray-400'} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all border-4 border-white`}>
                             {achievementIcons[item.id] || <Award size={20} />}
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-950">{item.label}</p>
                             <p className="text-[9px] font-bold text-gray-400 leading-tight">{item.description}</p>
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="col-span-4 p-8 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
                        <p className="text-gray-400 font-bold italic">Chưa có huy hiệu nào được mở khóa ✨</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Quick Actions Footer */}
             <div className="pt-4 flex items-center justify-between gap-4 py-6 border-t font-black">
                <p className="text-gray-300 uppercase tracking-widest text-[10px]">Đã tham gia Nebula từ {new Date(profile.created_at).toLocaleDateString('vi-VN')}</p>
             </div>

          </div>
        </div>

        {/* Motivation Section */}
        <div className="text-center pt-12 space-y-4">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Tinh vân Nebula ✨</p>
           <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed italic">
             Cùng lan tỏa tri thức và nỗ lực không ngừng nghỉ mỗi ngày bạn nhé!
           </p>
        </div>

      </div>
    </div>
  );
}
