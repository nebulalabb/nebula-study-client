'use client';

import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X, Users, MessageCircle, Loader2 } from 'lucide-react';
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
          // Refresh requests list
          fetchFriendsAndRequests();
      };
      socket.on('friend_request', handleFriendRequest);
      socket.on('friend_accepted', handleFriendRequest); // Reuse the same refresh logic
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
      toast.success('Đã gửi lời mời kết bạn');
      // Update local state to reflect sent request
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
      <div className="h-full flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12">
      {/* Search Section */}
      <section className="space-y-6">
        <div className="max-w-xl">
          <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
            <Search size={20} className="text-orange-500" />
            Tìm bạn học mới
          </h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập tên hoặc email..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-200 outline-none font-bold text-gray-700 transition-all"
                value={searchQuery}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="h-12 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 font-bold"
            >
              {isSearching ? <Loader2 className="animate-spin" size={20} /> : 'Tìm kiếm'}
            </Button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
            {searchResults.map((user) => (
              <div key={user.id} className="p-4 rounded-[2rem] border-2 border-gray-50 bg-gray-50/30 flex items-center justify-between group hover:border-orange-200 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.full_name} width={48} height={48} />
                      ) : (
                        <span className="text-lg font-black text-orange-500">{user.full_name[0]}</span>
                      )}
                   </div>
                   <div>
                      <p className="font-black text-gray-800">{user.full_name}</p>
                      <p className="text-xs font-bold text-gray-400">{user.email}</p>
                   </div>
                </div>
                
                {user.friendship_status === 'accepted' ? (
                   <div className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-black">BẠN BÈ</div>
                ) : user.friendship_status === 'pending' ? (
                   <div className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 text-xs font-black">CHỜ DUYỆT</div>
                ) : (
                   <Button 
                      size="sm" 
                      onClick={() => sendRequest(user.id)}
                      className="rounded-xl font-bold bg-white text-orange-500 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <UserPlus size={16} className="mr-2" /> Kết bạn
                   </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">💌</span>
            Lời mời kết bạn ({requests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div key={req.request_id} className="p-6 rounded-[2.5rem] bg-white border-2 border-orange-100 shadow-[0_8px_0_0_rgba(255,237,213,1)]">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-md">
                       {req.avatar_url ? <Image src={req.avatar_url} alt={req.full_name} width={56} height={56} /> : null}
                    </div>
                    <div>
                       <p className="font-black text-gray-800 text-lg">{req.full_name}</p>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Muốn đi đua top cùng bạn</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <Button 
                       onClick={() => acceptRequest(req.request_id)}
                       className="flex-1 rounded-2xl bg-orange-500 hover:bg-orange-600 font-bold"
                    >
                       Chấp nhận
                    </Button>
                    <Button variant="outline" className="rounded-2xl border-2 border-gray-100 font-bold">Từ chối</Button>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Friends List Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Users size={20} className="text-indigo-500" />
          Bạn bè ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <div className="p-12 rounded-[3rem] border-2 border-dashed border-gray-100 text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-300">
                <Users size={32} />
             </div>
             <p className="text-gray-400 font-bold">Chưa có bạn bè nào. Hãy thử tìm kiếm những "đồng môn" khác nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div key={friend.user_id} className="group p-6 rounded-[2.5rem] bg-white border-2 border-gray-50 hover:border-orange-100 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
                 <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-[2rem] bg-orange-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:rotate-6 transition-transform">
                       {friend.avatar_url ? (
                         <Image src={friend.avatar_url} alt={friend.full_name} width={80} height={80} />
                       ) : (
                         <span className="text-3xl font-black text-orange-500">{friend.full_name[0]}</span>
                       )}
                    </div>
                    <div>
                       <h3 className="font-black text-gray-800 text-lg group-hover:text-orange-500 transition-colors">{friend.full_name}</h3>
                       <p className="text-xs font-bold text-gray-400 mb-1">Cấp độ 12 • Học bá</p>
                    </div>
                    <Link href={`/social/chat?u=${friend.user_id}`} className="w-full">
                       <Button variant="outline" className="w-full rounded-2xl border-2 border-indigo-50 text-indigo-500 font-bold hover:bg-indigo-50 hover:border-indigo-100 transition-all gap-2">
                          <MessageCircle size={18} /> Nhắn tin
                       </Button>
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
