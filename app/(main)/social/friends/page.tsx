'use client';

import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X, Users, MessageCircle, Loader2, Sparkles, UserCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast-util';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useSocket } from '@/context/socket-context';
import { useAuth } from '@/context/auth-context';

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleFriendRequest = (data: any) => {
          fetchFriendsAndRequests();
      };
      socket.on('friend_request', handleFriendRequest);
      socket.on('friend_accepted', handleFriendRequest);
      return () => {
          socket.off('friend_request', handleFriendRequest);
          socket.off('friend_accepted', handleFriendRequest);
      };
    }
  }, [socket]);

  const fetchFriendsAndRequests = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        apiClient.get('/social/friends'),
        apiClient.get('/social/friends/requests')
      ]);
      setFriends(friendsRes.data.data.items);
      setRequests(requestsRes.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await apiClient.get(`/social/search?q=${searchQuery}`);
      setSearchResults(res.data.data.items);
    } catch (err) {
      toast.error('Lỗi khi tìm kiếm người dùng');
    } finally {
      setIsSearching(false);
    }
  };

  const sendRequest = async (userId: string) => {
    try {
      await apiClient.post(`/social/friends/request/${userId}`);
      toast.success('Đã gửi lời mời kết bạn ✨');
      setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: 'pending' } : u));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể gửi lời mời');
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await apiClient.post(`/social/friends/accept/${requestId}`);
      toast.success('Đã kết bạn thành công! 🎉');
      fetchFriendsAndRequests();
    } catch (err) {
      toast.error('Lỗi khi chấp nhận lời mời');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-32">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="animate-spin text-orange-500" size={48} />
           <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">
      {/* Welcome Header */}
      <div className="space-y-0.5 animate-in fade-in slide-in-from-left-4 duration-500">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Bạn bè & Kết nối</span>
             <Users size={20} className="text-orange-500" />
          </h2>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Cùng nhau bứt phá bảng xếp hạng! 🚀</p>
      </div>

      {/* Search Section */}
      <section className="bg-[#FFF9F5] p-6 rounded-[2.5rem] border-4 border-white shadow-inner space-y-5 relative overflow-hidden">
        <div className="max-w-xl relative z-10 space-y-3">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border-2 border-orange-100 flex items-center justify-center text-orange-500 shadow-sm"><Search size={16} /></div>
            Tìm bạn học mới
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Tên hoặc email..."
                className="w-full h-12 rounded-xl bg-white border-none pl-12 pr-4 text-xs font-black text-gray-700 placeholder:text-gray-300 shadow-sm focus:ring-4 focus:ring-orange-500/5 transition-all"
                value={searchQuery}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200 group-focus-within:text-orange-500 transition-colors" size={18} />
            </div>
            <button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.05] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-xs"
            >
              {isSearching ? <Loader2 className="animate-spin" size={18} /> : 'Tìm kiếm'}
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10 pt-2">
            {searchResults.map((user) => (
              <div key={user.id} className="p-4 rounded-[1.8rem] border-4 border-white bg-white/50 backdrop-blur-sm flex items-center justify-between group hover:bg-white hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-500/5 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-md group-hover:rotate-6 transition-transform">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.full_name} width={48} height={48} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-black text-orange-500">{user.full_name[0]}</span>
                      )}
                   </div>
                   <div>
                      <p className="font-black text-sm text-gray-900 group-hover:text-orange-600 transition-colors">{user.full_name}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{user.email}</p>
                   </div>
                </div>
                
                {user.friendship_status === 'accepted' ? (
                   <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                      <UserCheck size={12} /> BẠN BÈ
                   </div>
                ) : user.friendship_status === 'pending' ? (
                   <div className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-[0.2em] border border-amber-100 flex items-center gap-1.5 shadow-sm animate-pulse">
                      <Sparkles size={12} /> CHỜ DUYỆT
                   </div>
                ) : (
                   <button 
                      onClick={() => sendRequest(user.id)}
                      className="h-10 px-4 rounded-xl font-black bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-105 transition-all text-[10px] flex items-center gap-1.5"
                    >
                      <UserPlus size={14} /> Kết bạn
                   </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <section className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 px-1">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center shadow-sm text-xs">💌</div>
            Lời mời kết bạn <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] rounded-full shadow-lg shadow-rose-500/30">{requests.length}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <div key={req.request_id} className="p-5 rounded-[2rem] bg-white border-4 border-orange-50 shadow-2xl shadow-orange-500/5 relative group overflow-hidden transition-all hover:border-orange-200">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50/50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-100 transition-colors" />
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-[1.4rem] bg-gray-50 overflow-hidden border-2 border-white shadow-xl group-hover:rotate-12 transition-transform">
                       {req.avatar_url ? <Image src={req.avatar_url} alt={req.full_name} width={56} height={56} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-black text-xl">{req.full_name[0]}</div>}
                    </div>
                    <div>
                       <p className="font-black text-gray-900 text-lg tracking-tighter">{req.full_name}</p>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Muốn kết nối cùng bạn</p>
                    </div>
                 </div>
                 <div className="flex gap-2 relative z-10">
                    <button 
                       onClick={() => acceptRequest(req.request_id)}
                       className="flex-1 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.05] transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                       Chấp nhận
                    </button>
                    <button className="px-4 rounded-xl bg-[#FFF9F5] border-2 border-orange-50 text-gray-400 font-black hover:bg-white hover:text-rose-500 hover:border-rose-100 transition-all text-[10px] uppercase tracking-widest">Từ chối</button>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Friends List Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-1">
           <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-indigo-500 flex items-center justify-center shadow-sm"><Users size={16} /></div>
              Bạn cùng học <span className="text-[10px] font-black text-gray-300 ml-1">({friends.length})</span>
           </h3>
        </div>
        
        {friends.length === 0 ? (
          <div className="p-12 rounded-[3rem] bg-[#FFF9F5] border-4 border-dashed border-orange-100 text-center space-y-4 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 rounded-[2rem] bg-white border-4 border-orange-50 flex items-center justify-center mx-auto text-orange-200 shadow-xl shadow-orange-500/5 rotate-6">
                <Users size={40} />
             </div>
             <p className="text-gray-400 font-black text-base max-w-sm mx-auto tracking-tight">Chưa có bạn bè nào. Tìm kiếm ngay nhé! ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {friends.map((friend) => (
              <div key={friend.user_id} className="group p-5 rounded-[2rem] bg-white border-4 border-white hover:border-orange-50 shadow-xl shadow-orange-500/5 transition-all hover:-translate-y-2 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                       {friend.avatar_url ? (
                         <Image src={friend.avatar_url} alt={friend.full_name} width={80} height={80} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-3xl font-black text-orange-500">{friend.full_name[0]}</span>
                       )}
                    </div>
                    <div>
                       <h4 className="font-black text-gray-900 text-lg tracking-tighter group-hover:text-orange-500 transition-colors">{friend.full_name}</h4>
                       <div className="flex items-center justify-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded-lg border border-indigo-100 shadow-sm uppercase tracking-widest">Học bá</span>
                          <span className="text-[9px] font-bold text-gray-300 flex items-center gap-1"><Sparkles size={8} className="text-orange-300" /> Cấp 12</span>
                       </div>
                    </div>
                    <Link href={`/social/chat?u=${friend.user_id}`} className="w-full">
                       <button className="w-full h-11 rounded-xl bg-[#FFF9F5] border-2 border-orange-50 text-gray-600 font-black text-xs hover:bg-orange-500 hover:text-white hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group/btn">
                          <MessageCircle size={16} className="text-orange-400 group-hover/btn:text-white transition-colors" /> Nhắn tin
                       </button>
                    </Link>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
