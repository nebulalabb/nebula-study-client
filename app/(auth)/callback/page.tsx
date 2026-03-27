'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api-client';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // 1. Set temporary cookies for the API call
      Cookies.set('access_token', accessToken, { expires: 1/96 }); // 15m
      Cookies.set('refresh_token', refreshToken, { expires: 7 });

      // 2. Fetch user info to populate localStorage
      apiClient.get('/auth/me')
        .then((res) => {
          const user = res.data.data.user;
          localStorage.setItem('user', JSON.stringify(user));
          
          // 3. Redirect to dashboard
          window.location.href = '/dashboard';
        })
        .catch((err) => {
          console.error('Failed to fetch user during callback:', err);
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          router.push('/login?error=callback_failed');
        });
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F5]">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-2xl font-black text-gray-800 animate-pulse">Đang kết nối với NebulaStudy...</h2>
      <p className="text-gray-500 font-medium">Bạn sẽ được chuyển hướng trong giây lát.</p>
    </div>
  );
}
