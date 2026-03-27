'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2, MessageCircle, User, Clock, Check, CheckCheck, Image as ImageIcon, Film, Smile, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast-util';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useSocket } from '@/context/socket-context';

const STICKERS = [
  { id: 'smile', url: 'https://res.cloudinary.com/demo/image/upload/v1611000000/sample.jpg' }, // Placeholders
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
                    // Avoid duplicates if we've already added it locally
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
      // 1. Upload file
      const uploadRes = await apiClient.post('/social/messages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { url, mimetype, metadata } = uploadRes.data.data;
      const type = mimetype.startsWith('video/') ? 'video' : 'image';

      // 2. Send message with media URL
      const res = await apiClient.post(`/social/messages/${activePartner.partner_id}`, { 
        content: url, // For media, content stores the URL
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
          <div className="relative max-w-sm rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm">
            <Image 
              src={msg.content} 
              alt="Sent image" 
              width={300} 
              height={300} 
              className="object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(msg.content, '_blank')}
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative max-w-sm rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm bg-black">
            <video src={msg.content} controls className="w-full h-auto max-h-[400px]" />
          </div>
        );
      case 'sticker':
        return (
          <div className="w-32 h-32">
            <Image src={msg.content} alt="Sticker" width={128} height={128} className="object-contain" />
          </div>
        );
      case 'icon':
        return <span className="text-4xl">{msg.content}</span>;
      default:
        return <div className="whitespace-pre-wrap">{msg.content}</div>;
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
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activePartner ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 overflow-hidden border-2 border-white shadow-md">
                     {activePartner.avatar_url ? <Image src={activePartner.avatar_url} alt={activePartner.full_name} width={40} height={40} /> : <div className="w-full h-full flex items-center justify-center font-black text-orange-500">{activePartner.full_name?.[0]}</div>}
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
                    const isMedia = msg.type !== 'text';
                    
                    return (
                      <div key={msg.id} className={'flex animate-in fade-in duration-300 ' + (isMine ? 'justify-end' : 'justify-start')}>
                         <div className={'flex max-w-[70%] ' + (isMine ? 'flex-row-reverse' : 'flex-row') + ' gap-3'}>
                            {!isMine && (
                               <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0 mt-auto mb-1 overflow-hidden border border-white">
                                  {activePartner.avatar_url ? <Image src={activePartner.avatar_url} alt="" width={32} height={32} /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">{activePartner.full_name?.[0]}</div>}
                               </div>
                            )}
                            <div className="space-y-1">
                               <div className={
                                  (isMedia ? '' : 'px-5 py-3 rounded-[1.5rem] shadow-sm ') + 
                                  'text-sm font-medium ' + 
                                  (isMine 
                                    ? (isMedia ? '' : 'bg-orange-500 text-white rounded-br-none') 
                                    : (isMedia ? '' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'))}>
                                  {renderMessageContent(msg)}
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
            <div className="p-6 border-t border-gray-50 bg-white relative">
               {/* Sticker Picker Popover */}
               {showStickers && (
                 <div className="absolute bottom-full mb-4 left-6 bg-white border-2 border-gray-50 shadow-2xl rounded-[2rem] p-6 w-80 animate-in slide-in-from-bottom-5 duration-200 z-50">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="font-black text-gray-800">Stickers</h4>
                       <button onClick={() => setShowStickers(false)} className="text-gray-300 hover:text-gray-900 transition-colors"><X size={20} /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {STICKERS.map(s => (
                          <button 
                            key={s.id} 
                            onClick={() => sendSticker(s.url)}
                            className="bg-gray-50 rounded-2xl p-2 hover:bg-orange-50 transition-colors"
                          >
                             <Image src={s.url} alt={s.id} width={48} height={48} className="object-contain" />
                          </button>
                       ))}
                    </div>
                 </div>
               )}

               <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                  {/* Action Bar */}
                  <div className="flex items-center gap-2">
                     <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                     />
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="rounded-xl hover:bg-orange-50 hover:text-orange-500 text-gray-400"
                     >
                        <ImageIcon size={20} />
                     </Button>
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="rounded-xl hover:bg-orange-50 hover:text-orange-500 text-gray-400"
                     >
                        <Film size={20} />
                     </Button>
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowStickers(!showStickers)}
                        className={'rounded-xl hover:bg-orange-50 transition-colors ' + (showStickers ? 'bg-orange-50 text-orange-500' : 'text-gray-400')}
                     >
                        <Smile size={20} />
                     </Button>
                  </div>

                  <div className="flex gap-4">
                     <div className="relative flex-1">
                        <input
                           type="text"
                           placeholder="Viết lời chào của bạn..."
                           className="w-full h-14 pl-6 pr-14 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-200 outline-none font-bold text-gray-700 transition-all shadow-inner"
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           disabled={isSending || isUploading}
                        />
                        {(isSending || isUploading) && (
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <Loader2 className="animate-spin text-orange-200" size={20} />
                           </div>
                        )}
                     </div>
                     <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || isSending || isUploading}
                        className="h-14 w-14 rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 p-0 flex items-center justify-center transition-all active:scale-95"
                     >
                        <Send size={24} className="-mr-1 -mt-0.5" />
                     </Button>
                  </div>
               </form>
            </div>
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

export default function ChatPage() {
  return (
    <Suspense fallback={
       <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 bg-gray-50/30">
          <Loader2 className="animate-spin text-orange-200" size={48} />
          <p className="text-gray-400 font-bold">Đang tải cuộc trò chuyện...</p>
       </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
