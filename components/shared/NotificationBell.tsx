'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSocket } from '@/context/socket-context';
import { useRouter } from 'next/navigation';

const ICON_MAP: Record<string, string> = {
  flashcard_review_due: '🧠',
  streak_reminder: '🔥',
  booking_confirmed: '📅',
  booking_reminder: '⏰',
  payment_success: '✅',
  payment_failed: '❌',
  system: '📣',
  friend_request: '💌',
  friend_accepted: '🤝',
  feed_like: '❤️',
  feed_comment: '💬',
  forum_reply: '📝',
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread count on mount (and every 60 seconds for polling)
  const fetchUnread = async () => {
    try {
      const { data } = await apiClient.get('/notification', { params: { limit: 5 } });
      setUnreadCount(data.data.unread_count || 0);
      setNotifications(data.data.items || []);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNotification = (notif: any) => {
        if (!notif) return;
        setUnreadCount(prev => prev + 1);
        setNotifications(prev => [notif, ...prev.slice(0, 4)]); // Keep top 5
      };
      socket.on('notification', handleNotification);
      return () => {
          socket.off('notification', handleNotification);
      };
    }
  }, [socket]);

  const handleOpen = async () => {
    setIsOpen(prev => !prev);
    if (!isOpen && notifications.length === 0) {
      setIsLoading(true);
      await fetchUnread();
      setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notification/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch { /* silent */ }
  };

  const handleNotificationClick = async (n: any) => {
    setIsOpen(false);
    
    // Mark as read if not already
    if (!n.is_read) {
      try {
        await apiClient.patch(`/notification/${n.id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(notif => 
          notif.id === n.id ? { ...notif, is_read: true } : notif
        ));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }

    // Navigate based on type
    switch (n.type) {
      case 'friend_request':
        router.push('/social');
        break;
      case 'friend_accepted':
        const friendId = n.data?.friend_id || n.data?.requester_id;
        if (friendId) router.push(`/user/${friendId}`);
        else router.push('/social');
        break;
      case 'flashcard_review_due':
        router.push('/learn/flashcard');
        break;
      case 'feed_like':
      case 'feed_comment':
        router.push('/social/feed');
        break;
      case 'forum_reply':
        if (n.data?.slug) router.push(`/social/forum/${n.data.slug}`);
        else router.push('/social/forum');
        break;
      default:
        router.push('/notifications');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Thông báo"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-1rem)] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-zinc-800">
            <h3 className="font-black text-gray-900 dark:text-zinc-100">Thông báo</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors">
                <CheckCheck size={14} /> Đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="p-8 text-center text-gray-400 animate-pulse">Đang tải...</div>
            )}
            {!isLoading && notifications.length === 0 && (
              <div className="p-8 text-center">
                <Bell className="text-gray-300 mx-auto mb-2" size={32} />
                <p className="text-sm text-gray-400 font-medium">Chưa có thông báo nào</p>
              </div>
            )}
            {!isLoading && notifications.map(n => {
              if (!n) return null;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={'w-full text-left flex gap-3 px-5 py-4 border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors ' + (!n.is_read ? 'bg-sky-50/50 dark:bg-sky-900/10' : '')}
                >
                <div className="text-2xl w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
                  {ICON_MAP[n.type] || '📣'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={'text-sm font-bold leading-tight mb-0.5 ' + (!n.is_read ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-600 dark:text-zinc-400')}>
                    {n.title}
                    {!n.is_read && <span className="ml-2 w-2 h-2 bg-sky-500 rounded-full inline-block" />}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: vi })}
                  </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-gray-50/50 dark:bg-zinc-800/20 border-t border-gray-100 dark:border-zinc-800 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-sky-500 hover:text-sky-600 transition-colors flex items-center justify-center gap-1"
            >
              Xem tất cả thông báo <ExternalLink size={13} />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
