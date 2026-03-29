'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2, MessageCircle, User, Clock, Check, CheckCheck, Image as ImageIcon, Film, Smile, Plus, X, Sparkles, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast-util';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useSocket } from '@/context/socket-context';

const STICKERS = [
  { id: 'smile', url: 'https://res.cloudinary.com/demo/image/upload/v1611000000/sample.jpg' },
  { id: 'heart', url: 'https://res.cloudinary.com/demo/image/upload/v1611000000/sample.jpg' },
  { id: 'like', url: 'https://res.cloudinary.com/demo/image/upload/v1611000000/sample.jpg' },
  { id: 'wow', url: 'https://res.cloudinary.com/demo/image/upload/v1611000000/sample.jpg' },
];

function ChatContent() {
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
  const [isUploading, setIsUploading] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (targetUserId) {
        const existing = conversations.find(c => c.partner_id === targetUserId);
        if (existing) {
            setActivePartner(existing);
        } else {
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
            if (activePartner && (msg.sender_id === activePartner.partner_id || msg.sender_id === currentUser?.id)) {
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            }
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
      const res = await apiClient.post(`/social/messages/${activePartner.partner_id}`, { 
        content: newMessage,
        type: 'text'
      });
      
      const sentMsg = res.data.data.message;
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      toast.error('Gửi tin nhắn thất bại');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePartner) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await apiClient.post('/social/messages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { url, mimetype, metadata } = uploadRes.data.data;
      const type = mimetype.startsWith('video/') ? 'video' : 'image';

      const res = await apiClient.post(`/social/messages/${activePartner.partner_id}`, { 
        content: url,
        type: type,
        metadata: metadata
      });

      const sentMsg = res.data.data.message;
      setMessages(prev => [...prev, sentMsg]);
      fetchConversations();
    } catch (err) {
      toast.error('Tải tệp lên thất bại');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const sendSticker = async (stickerUrl: string) => {
    if (!activePartner || isSending) return;
    setIsSending(true);
    try {
      const res = await apiClient.post(`/social/messages/${activePartner.partner_id}`, { 
        content: stickerUrl,
        type: 'sticker'
      });
      const sentMsg = res.data.data.message;
      setMessages(prev => [...prev, sentMsg]);
      setShowStickers(false);
      fetchConversations();
    } catch (err) {
      toast.error('Gửi sticker thất bại');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageContent = (msg: any) => {
    switch (msg.type) {
      case 'image':
        return (
          <div className="relative max-w-sm rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
            <Image 
              src={msg.content} 
              alt="Sent image" 
              width={300} 
              height={300} 
              className="object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
              onClick={() => window.open(msg.content, '_blank')}
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative max-w-sm rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-black">
            <video src={msg.content} controls className="w-full h-auto max-h-[400px]" />
          </div>
        );
      case 'sticker':
        return (
          <div className="w-32 h-32 hover:scale-110 transition-transform">
            <Image src={msg.content} alt="Sticker" width={128} height={128} className="object-contain" />
          </div>
        );
      case 'icon':
        return <span className="text-4xl animate-bounce inline-block">{msg.content}</span>;
      default:
        return <div className="whitespace-pre-wrap leading-relaxed px-1">{msg.content}</div>;
    }
  };

  return (
    <div className="flex h-full min-h-[600px]">
      {/* Sidebar - Conversations List */}
      <div className="w-72 md:w-80 border-r-2 border-orange-50/50 flex flex-col bg-[#FFF9F5]/30">
        <div className="p-5 border-b-2 border-orange-50/50 bg-white/70 backdrop-blur-md">
           <h2 className="text-lg font-black text-gray-900 tracking-tighter flex items-center gap-2">
             Tin nhắn
             {conversations.some(c => !c.is_read && c.sender_id !== currentUser?.id) && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse border-2 border-white shadow-lg shadow-rose-500/20" />
             )}
           </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
           {isLoadingConversations ? (
              // ... loading ...
             <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="animate-spin text-orange-200" size={24} />
                <p className="text-[9px] font-black text-orange-200 uppercase tracking-widest text-center">Kết nối...</p>
             </div>
           ) : conversations.length === 0 ? (
              // ... empty ...
             <div className="py-20 px-6 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-[1.8rem] border-4 border-orange-50 flex items-center justify-center text-orange-200 mx-auto rotate-6 shadow-inner">
                   <MessageCircle size={32} />
                </div>
                <p className="text-gray-400 font-bold text-xs leading-relaxed italic">Chưa có cuộc trò chuyện nào ✨</p>
             </div>
           ) : (
             conversations.map((conv) => {
               const isActive = activePartner?.partner_id === conv.partner_id;
               const isUnread = !conv.is_read && conv.sender_id !== currentUser?.id;
               
               return (
                 <button
                    key={conv.partner_id}
                    onClick={() => setActivePartner(conv)}
                    className={'w-full flex items-center gap-3 p-3.5 rounded-[1.8rem] transition-all relative border-4 ' + 
                      (isActive 
                        ? 'bg-white shadow-2xl shadow-orange-500/10 border-orange-50/50' 
                        : 'bg-white/40 hover:bg-white border-transparent hover:border-orange-50 hover:shadow-xl hover:shadow-orange-500/5')}
                 >
                    <div className="relative shrink-0">
                       <div className="w-11 h-11 rounded-[1.2rem] bg-orange-100 overflow-hidden border-2 border-white shadow-md transition-transform group-hover:rotate-6">
                          {conv.avatar_url ? <Image src={conv.avatar_url} alt={conv.full_name} width={44} height={44} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-orange-500 text-lg">{conv.full_name[0]}</div>}
                       </div>
                       {isUnread && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-lg animate-bounce" />}
                       <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    </div>
                    
                    <div className="flex-1 text-left overflow-hidden py-0.5">
                       <div className="flex justify-between items-center mb-0.5">
                          <p className={'text-sm font-black truncate tracking-tight ' + (isUnread ? 'text-gray-900' : 'text-gray-700')}>{conv.full_name}</p>
                          <span className="text-[9px] font-black text-gray-300 uppercase leading-none">
                             {new Date(conv.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <p className={'text-[11px] truncate tracking-tight ' + (isUnread ? 'text-orange-600 font-black' : 'text-gray-400 font-bold')}>
                          {conv.sender_id === currentUser?.id && 'Bạn: '}
                          {conv.type === 'text' ? conv.content : `[${conv.type === 'image' ? 'Hình ảnh' : conv.type === 'video' ? 'Video' : 'Sticker'}]`}
                       </p>
                    </div>
                 </button>
               );
             })
           )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {activePartner ? (
          <>
            {/* Header */}
            <div className="p-5 border-b-2 border-orange-50/50 bg-white/50 backdrop-blur-md flex items-center justify-between relative z-10">
               <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF9F5] overflow-hidden border-2 border-white shadow-xl rotate-3">
                     {activePartner.avatar_url ? <Image src={activePartner.avatar_url} alt={activePartner.full_name} width={36} height={36} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-orange-500 text-base">{activePartner.full_name?.[0]}</div>}
                  </div>
                  <div>
                     <p className="text-base font-black text-gray-900 tracking-tighter">{activePartner.full_name}</p>
                     <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] leading-none">Trực tuyến</p>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FFF9F5] border-2 border-orange-50 text-gray-300 hover:text-orange-500 transition-all hover:scale-110 active:scale-95 shadow-sm">
                     <Clock size={16} />
                  </button>
                  <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FFF9F5] border-2 border-orange-50 text-gray-400 hover:text-orange-500 transition-all hover:scale-110 active:scale-95 shadow-sm">
                     <MoreHorizontal size={16} />
                  </button>
               </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FFF9F5]/30">
               {isLoadingMessages && messages.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-12 h-12 rounded-[1.5rem] bg-white border-4 border-orange-50 flex items-center justify-center shadow-xl rotate-12">
                       <Loader2 className="animate-spin text-orange-200" size={24} />
                    </div>
                    <p className="text-[9px] font-black text-orange-300 uppercase tracking-widest">Đang tải...</p>
                 </div>
               ) : (
                  messages.map((msg, idx) => {
                    const isMine = msg.sender_id === currentUser?.id;
                    const isMedia = msg.type !== 'text';
                    
                    return (
                      <div key={msg.id} className={'flex animate-in fade-in slide-in-from-bottom-2 duration-300 ' + (isMine ? 'justify-end' : 'justify-start')}>
                         <div className={'flex max-w-[80%] ' + (isMine ? 'flex-row-reverse' : 'flex-row') + ' gap-3 group/msg'}>
                            {!isMine && (
                               <div className="w-8 h-8 rounded-lg bg-white shrink-0 mt-auto mb-1 overflow-hidden border-2 border-white shadow-md transition-transform group-hover/msg:rotate-12">
                                  {activePartner.avatar_url ? <Image src={activePartner.avatar_url} alt="" width={32} height={32} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-orange-400">{activePartner.full_name?.[0]}</div>}
                               </div>
                            )}
                            <div className="space-y-1.5 text-left">
                               <div className={
                                  (isMedia ? '' : 'px-3.5 py-2.5 rounded-[1.5rem] shadow-xl shadow-gray-500/5 border-2 ') + 
                                  'text-xs font-black tracking-tight ' + 
                                  (isMine 
                                    ? (isMedia ? '' : 'bg-gradient-to-br from-orange-500 to-rose-500 text-white border-transparent rounded-br-none') 
                                    : (isMedia ? '' : 'bg-white text-gray-700 border-white rounded-bl-none'))}>
                                  {renderMessageContent(msg)}
                               </div>
                               <div className={'flex items-center gap-1.5 ' + (isMine ? 'justify-end pr-1' : 'justify-start pl-1')}>
                                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">
                                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {isMine && (
                                     msg.is_read ? <CheckCheck size={10} className="text-orange-400" /> : <Check size={10} className="text-gray-200" />
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

            {/* Input Area */}
            <div className="p-5 border-t-2 border-orange-50/50 bg-white/70 backdrop-blur-xl relative z-10">
               {showStickers && (
                 <div className="absolute bottom-full mb-4 left-6 bg-white border-4 border-orange-50 shadow-[0_20px_40px_-10px_rgba(251,146,60,0.2)] rounded-[2.5rem] p-6 w-80 animate-in slide-in-from-bottom-8 duration-300 z-50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="flex justify-between items-center mb-4 relative z-10">
                       <h4 className="text-lg font-black text-gray-900 tracking-tighter flex items-center gap-2">Stickers <Sparkles size={14} className="text-orange-400" /></h4>
                       <button onClick={() => setShowStickers(false)} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all"><X size={14} /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 relative z-10">
                       {STICKERS.map(s => (
                          <button 
                            key={s.id} 
                            onClick={() => sendSticker(s.url)}
                            className="bg-[#FFF9F5] rounded-xl p-2 hover:bg-orange-100 hover:scale-110 transition-all duration-300 group"
                          >
                             <Image src={s.url} alt={s.id} width={48} height={48} className="object-contain group-hover:rotate-6" />
                          </button>
                       ))}
                    </div>
                 </div>
               )}

               <form onSubmit={handleSendMessage} className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center gap-2">
                     <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                     />
                     <div className="flex items-center bg-[#FFF9F5] rounded-xl p-1 border-2 border-white shadow-sm ring-1 ring-orange-50/50">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white hover:text-orange-500 text-gray-400 transition-all"
                        >
                           <ImageIcon size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white hover:text-orange-500 text-gray-400 transition-all"
                        >
                           <Film size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowStickers(!showStickers)}
                          className={'h-9 w-9 flex items-center justify-center rounded-lg transition-all ' + (showStickers ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-gray-400 hover:bg-white hover:text-orange-500')}
                        >
                           <Smile size={16} />
                        </button>
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <div className="relative flex-1 group">
                        <input
                           type="text"
                           placeholder="Nhắn gì đó cute..."
                           className="w-full h-12 pl-6 pr-12 rounded-[1.5rem] bg-[#FFF9F5] border-4 border-transparent focus:border-orange-100 outline-none font-black text-xs text-gray-800 placeholder:text-gray-300 transition-all shadow-inner"
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           disabled={isSending || isUploading}
                        />
                        {(isSending || isUploading) && (
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <Loader2 className="animate-spin text-orange-200" size={18} />
                           </div>
                        )}
                     </div>
                     <button 
                        type="submit" 
                        disabled={!newMessage.trim() || isSending || isUploading}
                        className="h-12 w-12 rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-2xl shadow-orange-500/20 flex items-center justify-center transition-all active:scale-95 hover:scale-105 disabled:opacity-50"
                     >
                        <Send size={20} className="-mr-0.5 -mt-0.5" />
                     </button>
                  </div>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-[#FFF9F5]/30 relative">
             <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-20 right-20 w-48 h-48 bg-orange-100 rounded-full blur-[80px]" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-rose-100 rounded-full blur-[80px]" />
             </div>
             <div className="w-32 h-32 rounded-[3.5rem] bg-white border-4 border-orange-100 flex items-center justify-center text-orange-200 shadow-xl rotate-6 mb-2 animate-in zoom-in-50 duration-700">
                <MessageCircle size={64} strokeWidth={1} />
             </div>
             <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Chọn một bạn học! ✨</h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto text-xs leading-relaxed">Kết nối để thảo luận bài tập và hỗ trợ nhau học tốt hơn nhé.</p>
             </div>
             <div className="flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-md border-2 border-white rounded-full text-[9px] font-black uppercase tracking-widest text-orange-400 shadow-sm relative z-10">
                <Sparkles size={12} /> Hệ thống bảo mật
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
       <div className="flex-1 flex flex-col items-center justify-center p-32 text-center space-y-8 bg-[#FFF9F5]/30">
          <div className="w-24 h-24 rounded-[2.5rem] bg-white border-4 border-orange-50 flex items-center justify-center shadow-xl">
             <Loader2 className="animate-spin text-orange-500" size={48} />
          </div>
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Nebula đang tải hội thoại...</p>
       </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
