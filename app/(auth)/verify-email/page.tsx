'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = React.useState(60);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 text-orange-500 mb-4 shadow-sm -rotate-6">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-3xl font-black text-gray-800">Kiểm tra hộp thư!</h1>
      <p className="text-gray-500 font-medium">
        Chúng mình đã gửi một đường link kích hoạt tài khoản đến địa chỉ email của bạn. Vui lòng kiểm tra (kể cả trong thư mục Spam) và nhấn vào link để hoàn tất đăng ký nhé!
      </p>

      <div className="space-y-4 pt-4">
        <Button 
          variant="outline" 
          disabled={countdown > 0} 
          className="w-full h-14 rounded-2xl border-2 border-orange-200 text-orange-600 font-bold hover:bg-orange-50 transition-colors"
        >
          {countdown > 0 ? `Gửi lại email sau ${countdown}s` : 'Gửi lại email xác thực'}
        </Button>
        <Link
          href="/login"
          className="block text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors pt-2"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
