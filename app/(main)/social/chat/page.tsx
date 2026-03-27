'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2, MessageCircle, User, Clock, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast-util';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useSocket } from '@/context/socket-context';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('u');
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartner, setActivePartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (targetUserId) {
        // Find existing or fetch specifically
        const existing = conversations.find(c => c.partner_id === targetUserId);
        if (existing) {
            setActivePartner(existing);
        } else {
            // New chat - fetch user info (not fully implemented in search, but we can try)
            fetchActivePartner(targetUserId);
        }
    }
  }, [targetUserId, conversations]);

  useEffect(() => {
    if (activePartner) {
        fetchMessages(activePartner.partner_id);
    }
  }, [activePartner]);

  useEffect(() => {
    if (socket) {
        const handleNewMessage = (msg: any) => {
            // If message is from current active partner, add to list
            if (activePartner && (msg.sender_id === activePartner.partner_id || msg.sender_id === currentUser?.id)) {
                setMessages(prev => [...prev, msg]);
            }
            // Always refresh conversations list to show last message/unread
            fetchConversations();
        };

        socket.on('new_message', handleNewMessage);
        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }
  }, [socket, activePartner, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/social/messages/conversations');
      setConversations(res.data.data.items);
      setIsLoadingConversations(false);
    } catch (err) { console.error(err); }
  };

  const fetchActivePartner = async (userId: string) => {
    try {
      const res = await apiClient.get(`/social/messages/partner/${userId}`);
      setActivePartner(res.data.data);
    } catch (err) {
      console.error('Failed to fetch partner info:', err);
      toast.error('Không tìm thấy thông tin bạn bè');
    }
  };

  const fetchMessages = async (partnerId: string, showLoading = true) => {
    if (showLoading) setIsLoadingMessages(true);
    try {
      const res = await apiClient.get(`/social/messages/${partnerId}`);
      setMessages(res.data.data.items);
    } catch (err) { console.error(err); }
    finally { if (showLoading) setIsLoadingMessages(false); }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activePartner || isSending) return;
    
    setIsSending(true);
    try {
      await apiClient.post(`/social/messages/${activePartner.partner_id}`, { content: newMessage });
      // We don't need to manually add to messages here because the backend will emit 'new_message' 
      // back to the sender as well if we set it up that way, OR we can just manually add it.
      // Current SocialController emits to RECIPIENT. Let's add it manually for immediate feedback.
      
      const tempMsg = {
         id: Date.now().toString(),
         sender_id: currentUser?.id,
         recipient_id: activePartner.partner_id,
         content: newMessage,
         is_read: false,
         created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      toast.error('Gửi tin nhắn thất bại');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-[600px]">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-50 flex flex-col bg-gray-50/20">
        <div className="p-6 border-b border-gray-50 bg-white">
           <h2 className="font-black text-gray-800 text-lg flex items-center gap-2">
             Đoạn chat
             {conversations.some(c => !c.is_read && c.sender_id !== currentUser?.id) && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
             )}
           </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {isLoadingConversations ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-200" /></div>
           ) : conversations.length === 0 ? (
             <p className="text-center text-gray-400 text-sm font-medium mt-10 px-6">Bạn chưa có cuộc trò chuyện nào. Hãy kết bạn để bắt đầu nhé!</p>
           ) : (
             conversations.map((conv) => {
               const isActive = activePartner?.partner_id === conv.partner_id;
               const isUnread = !conv.is_read && conv.sender_id !== currentUser?.id;
               
               return (
                 <button
                    key={conv.partner_id}
                    onClick={() => setActivePartner(conv)}
                    className={'w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all relative ' + 
                      (isActive 
                        ? 'bg-white shadow-xl shadow-orange-500/5 border-2 border-orange-100' 
                        : 'hover:bg-white/50 border-2 border-transparent')}
                 >
                    <div className="relative">
                       <div className="w-12 h-12 rounded-2xl bg-orange-100 overflow-hidden border-2 border-white shadow-sm">
                          {conv.avatar_url ? <Image src={conv.avatar_url} alt={conv.full_name} width={48} height={48} /> : <div className="w-full h-full flex items-center justify-center font-black text-orange-500">{conv.full_name[0]}</div>}
                       </div>
                       {isUnread && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white" />}
                    </div>
                    
                    <div className="flex-1 text-left overflow-hidden">
                       <div className="flex justify-between items-center mb-0.5">
                          <p className={'text-sm font-black truncate ' + (isUnread ? 'text-gray-900' : 'text-gray-700')}>{conv.full_name}</p>
                          <span className="text-[10px] font-bold text-gray-400 leading-none">
                             {new Date(conv.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <p className={'text-xs truncate ' + (isUnread ? 'text-gray-800 font-bold' : 'text-gray-400 font-medium')}>
                          {conv.sender_id === currentUser?.id && 'Bạn: '}{conv.content}
                       </p>
                    </div>
                 </button>
               );
             })
           )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activePartner ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 overflow-hidden border-2 border-white shadow-md">
                     {activePartner.avatar_url ? <Image src={activePartner.avatar_url} alt={activePartner.full_name} width={40} height={40} /> : <div className="w-full h-full flex items-center justify-center font-black text-orange-500">{activePartner.full_name[0]}</div>}
                  </div>
                  <div>
                     <p className="font-black text-gray-800">{activePartner.full_name}</p>
                     <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Đang trực tuyến</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-gray-100 h-10 w-10 p-0 text-gray-400 hover:text-orange-500">
                     <Clock size={18} />
                  </Button>
               </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/10">
               {isLoadingMessages && messages.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader2 className="animate-spin text-orange-200" size={32} />
                    <p className="text-gray-300 font-bold text-sm">Đang tải tin nhắn...</p>
                 </div>
               ) : (
                  messages.map((msg, idx) => {
                    const isMine = msg.sender_id === currentUser?.id;
                    const showAvatar = idx === 0 || messages[idx-1].sender_id !== msg.sender_id;
                    
                    return (
                      <div key={msg.id} className={'flex animate-in fade-in duration-300 ' + (isMine ? 'justify-end' : 'justify-start')}>
                         <div className={'flex max-w-[70%] ' + (isMine ? 'flex-row-reverse' : 'flex-row') + ' gap-3'}>
                            {!isMine && (
                               <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0 mt-auto mb-1 overflow-hidden border border-white">
                                  {activePartner.avatar_url ? <Image src={activePartner.avatar_url} alt="" width={32} height={32} /> : null}
                               </div>
                            )}
                            <div className="space-y-1">
                               <div className={'px-5 py-3 rounded-[1.5rem] text-sm font-medium shadow-sm ' + 
                                  (isMine 
                                    ? 'bg-orange-500 text-white rounded-br-none' 
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none')}>
                                  {msg.content}
                               </div>
                               <div className={'flex items-center gap-1 ' + (isMine ? 'justify-end' : 'justify-start')}>
                                  <span className="text-[9px] font-bold text-gray-300">
                                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {isMine && (
                                     msg.is_read ? <CheckCheck size={10} className="text-orange-300" /> : <Check size={10} className="text-gray-200" />
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-50 bg-white">
               <div className="flex gap-4">
                  <div className="relative flex-1">
                     <input
                        type="text"
                        placeholder="Viết lời chào của bạn..."
                        className="w-full h-14 pl-6 pr-14 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-200 outline-none font-bold text-gray-700 transition-all shadow-inner"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {/* Emoji or Attachment could go here */}
                     </div>
                  </div>
                  <Button 
                     type="submit" 
                     disabled={!newMessage.trim() || isSending}
                     className="h-14 w-14 rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 p-0 flex items-center justify-center transition-all active:scale-95"
                  >
                     {isSending ? <Loader2 className="animate-spin text-white" size={24} /> : <Send size={24} className="-mr-1 -mt-0.5" />}
                  </Button>
               </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 bg-gray-50/30">
             <div className="w-32 h-32 rounded-[3rem] bg-white border-2 border-orange-100 flex items-center justify-center text-orange-200 shadow-xl shadow-orange-500/5 rotate-3 mb-4">
                <MessageCircle size={64} strokeWidth={1.5} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">Chọn một bạn học để bắt đầu chat!</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto">Kết nối với mọi người để cùng nhau thảo luận bài tập và hỗ trợ nhau học tập hiệu quả hơn.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
