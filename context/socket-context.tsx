'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { toast } from '@/lib/toast-util';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || 'http://localhost:3001';
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
        newSocket.emit('register', user.id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      // Global event listeners
      newSocket.on('friend_request', (data) => {
        toast.info(data.message || 'Bạn có lời mời kết bạn mới!', {
            action: {
                label: 'Xem ngay',
                onClick: () => window.location.href = '/social/friends'
            }
        });
      });

      newSocket.on('friend_accepted', (data) => {
        toast.success(data.message || 'Lời mời kết bạn đã được chấp nhận!', {
            action: {
                label: 'Nhắn tin ngay',
                onClick: () => window.location.href = `/social/chat?u=${data.addressee_id}`
            }
        });
      });

      newSocket.on('new_message', (data) => {
        // If not in chat page, show toast
        if (window.location.pathname !== '/social/chat') {
           toast.info(`Tin nhắn mới: ${data.content.substring(0, 30)}...`, {
               action: {
                   label: 'Trả lời',
                   onClick: () => window.location.href = `/social/chat?u=${data.sender_id}`
               }
           });
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
