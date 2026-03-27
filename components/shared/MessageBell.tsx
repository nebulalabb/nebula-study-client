'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { useSocket } from '@/context/socket-context';

export function MessageBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    fetchUnread();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = () => {
        // If not on chat page, increment count
        if (window.location.pathname !== '/social/chat') {
           setUnreadCount(prev => prev + 1);
        }
      };

      socket.on('new_message', handleNewMessage);
      return () => {
        socket.off('new_message', handleNewMessage);
      }
    }
  }, [socket]);

  const fetchUnread = async () => {
    try {
      const res = await apiClient.get('/social/messages/unread-count');
      setUnreadCount(res.data.data.count);
    } catch (err) {
      console.error('Failed to fetch unread messages:', err);
    }
  };

  return (
    <Link 
      href="/social/chat" 
      className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors group"
      aria-label="Tin nhắn"
    >
      <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white animate-in zoom-in duration-300">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
