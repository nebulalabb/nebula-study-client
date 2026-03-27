'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import { Trophy, Star, Target, Crown, Zap, Flame, Award, Sparkles, ChevronRight, Search, Medal } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
  rank: number;
}

export default function RankingPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiClient.get('/user/leaderboard');
        const items = res.data.data.items || [];
        
        // Add rank if not provided by backend
        const rankedItems = items.map((u: any, i: number) => ({
          ...u,
          rank: i + 1
        }));

        setUsers(rankedItems);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [currentUser]);

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
         <div className="text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-lg">
               <Trophy size={48} className="text-orange-300" />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Đang tải bảng xếp hạng thực tế...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 text-gray-900 selection:bg-orange-100">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-400 to-rose-500 pt-20 pb-48 px-6 overflow-hidden">
         {/* Particles */}
         <div className="absolute top-10 left-10 text-white/20 animate-bounce delay-100"><Star size={40} fill="currentColor" /></div>
         <div className="absolute top-40 right-20 text-white/10 animate-pulse"><Sparkles size={80} fill="currentColor" /></div>
         <div className="absolute bottom-20 left-1/4 text-white/20 animate-bounce delay-700"><Crown size={48} /></div>

         <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 animate-in zoom-in duration-700">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] border border-white/30 text-white shadow-xl shadow-orange-500/10">
               <Trophy size={16} /> Bảng vinh danh Nebula
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-xl">
               Học Bá <span className="text-orange-200">Tinh Vân</span> ✨
            </h1>
            <p className="text-xl text-orange-50 font-bold max-w-lg mx-auto leading-relaxed opacity-90">
               Cùng khám phá những "Ngôi sao" đang dẫn đầu dải ngân hà tri thức NebulaStudy.
            </p>
         </div>

         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF9F5] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-20 space-y-12">
         
         {/* Podium Section */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Rank 2 */}
            {topThree[1] && (
               <div className="flex flex-col items-center gap-6 order-2 md:order-1 group">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-gray-100 shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
                        {topThree[1].avatar_url ? <img src={topThree[1].avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-3xl uppercase">{topThree[1].full_name.charAt(0)}</div>}
                     </div>
                     <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-slate-300 border-4 border-white rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Medal size={20} />
                     </div>
                  </div>
                  <div className="w-full bg-white border-4 border-gray-100 rounded-[2.5rem] p-8 text-center space-y-2 shadow-2xl shadow-gray-200/50 h-40 flex flex-col justify-center">
                     <p className="font-black text-xl text-gray-950 truncate px-2 leading-none mb-1">{topThree[1].full_name}</p>
                     <p className="text-sm font-black text-orange-500 uppercase tracking-widest">{topThree[1].xp.toLocaleString()} XP</p>
                     <div className="flex justify-center gap-2 pt-2">
                        <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">Cấp {topThree[1].level}</span>
                     </div>
                  </div>
               </div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
               <div className="flex flex-col items-center gap-6 order-1 md:order-2 group -mt-12">
                  <div className="relative">
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                        <Crown size={48} fill="currentColor" />
                     </div>
                     <div className="w-32 h-32 rounded-[2.5rem] bg-white border-4 border-amber-200 shadow-2xl shadow-amber-500/20 overflow-hidden group-hover:scale-110 transition-transform ring-8 ring-amber-400/10">
                        {topThree[0].avatar_url ? <img src={topThree[0].avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-4xl uppercase">{topThree[0].full_name.charAt(0)}</div>}
                     </div>
                  </div>
                  <div className="w-full bg-gradient-to-br from-white to-orange-50 border-4 border-amber-100 rounded-[3rem] p-10 text-center space-y-2 shadow-2xl shadow-amber-500/10 h-52 flex flex-col justify-center">
                     <p className="font-black text-2xl text-gray-950 truncate px-2 leading-none mb-1">{topThree[0].full_name}</p>
                     <p className="text-lg font-black text-amber-500 uppercase tracking-widest">{topThree[0].xp.toLocaleString()} XP</p>
                     <div className="flex justify-center gap-3 pt-3">
                        <span className="text-xs font-black bg-amber-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 border border-amber-400 uppercase tracking-widest">Cấp {topThree[0].level}</span>
                        <span className="text-xs font-black bg-orange-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-1 border border-orange-400">
                           <Flame size={14} fill="currentColor" /> {topThree[0].streak}
                        </span>
                     </div>
                  </div>
               </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
               <div className="flex flex-col items-center gap-6 order-3 group">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-orange-50 shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
                        {topThree[2].avatar_url ? <img src={topThree[2].avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-3xl uppercase">{topThree[2].full_name.charAt(0)}</div>}
                     </div>
                     <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-amber-700 border-4 border-white rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Medal size={20} />
                     </div>
                  </div>
                  <div className="w-full bg-white border-4 border-orange-50 rounded-[2.5rem] p-8 text-center space-y-2 shadow-2xl shadow-orange-500/5 h-40 flex flex-col justify-center">
                     <p className="font-black text-xl text-gray-950 truncate px-2 leading-none mb-1">{topThree[2].full_name}</p>
                     <p className="text-sm font-black text-orange-500 uppercase tracking-widest">{topThree[2].xp.toLocaleString()} XP</p>
                     <div className="flex justify-center gap-2 pt-2">
                        <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">Cấp {topThree[2].level}</span>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* List View */}
         <div className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10" />
            
            <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 rotate-3">
                     <Target size={24} strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-950 tracking-tight">Vũ trụ học bá</h2>
               </div>
               
               <div className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[#FFF9F5] border-2 border-orange-50 rounded-2xl">
                  <Search size={18} className="text-orange-200" />
                  <input type="text" placeholder="Tìm kiếm bạn bè..." className="bg-transparent border-none outline-none font-bold text-sm text-gray-700 placeholder:text-gray-300" />
               </div>
            </div>

            <div className="space-y-4 relative z-10">
               {others.length === 0 && topThree.length === 0 && (
                 <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <p className="font-black text-gray-300 text-xl tracking-tight uppercase">Chưa có dữ liệu xếp hạng thực tế.</p>
                 </div>
               )}

               {others.map((u) => {
                 const isMe = u.id === currentUser?.id;
                 return (
                    <div 
                      key={u.id} 
                      className={`flex items-center justify-between p-6 rounded-[2rem] border-4 transition-all hover:scale-[1.01] ${
                        isMe ? 'bg-orange-50 border-orange-200 shadow-xl shadow-orange-500/10 scale-[1.02]' : 'bg-white border-gray-50 hover:border-orange-100 hover:bg-orange-50/20'
                      }`}
                    >
                       <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${
                            isMe ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-300'
                          }`}>
                             #{u.rank}
                          </div>
                          
                          <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-orange-50 flex items-center justify-center text-orange-200 font-black uppercase">
                             {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : u.full_name.charAt(0)}
                          </div>
                          
                          <div className="space-y-1">
                             <p className={`font-black tracking-tight ${isMe ? 'text-orange-600 text-xl' : 'text-gray-900 text-lg'}`}>
                                {u.full_name} {isMe && <span className="ml-2 text-[10px] bg-white px-2 py-1 rounded-lg border border-orange-200 uppercase tracking-widest text-orange-500">Bạn</span>}
                             </p>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1">
                                   <Medal size={12} className="text-amber-500" /> Cấp {u.level}
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1">
                                   <Flame size={12} className="text-orange-500" /> {u.streak} ngày
                                </span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-end gap-1">
                          <p className={`font-black tracking-tighter ${isMe ? 'text-3xl text-orange-600' : 'text-2xl text-gray-950'}`}>
                             {u.xp.toLocaleString()}
                          </p>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none">XP Tổng</p>
                       </div>
                    </div>
                 );
               })}
            </div>
         </div>

         <div className="text-center pt-8">
            <p className="text-sm font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Mục tiêu của bạn là gì? ✨</p>
            <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed italic">
              "Ngọc càng mài càng sáng, người càng học càng tinh." Đừng bỏ cuộc, hãy tích lũy XP từ các bài học ngay hôm nay nhé!
            </p>
         </div>
      </div>
    </div>
  );
}
