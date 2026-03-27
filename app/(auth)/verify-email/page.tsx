'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Only numbers
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveInput(index - 1);
    }
    if (e.key === 'Enter' && otp.join('').length === 6) {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
    setActiveInput(nextIndex);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/verify-otp', {
        email: email || '', 
        otp: otpValue
      });
      setIsSuccess(true);
      // Success toast would go here
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  // If success, show specialized view
  if (isSuccess) {
    return (
      <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 border-2 border-emerald-100 relative z-10 text-center animate-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-800">Xác thực thành công!</h1>
        <p className="text-gray-500 font-medium">
          Chúc mừng! Tài khoản của bạn đã được kích hoạt. <br />
          Đang chuyển bạn đến trang đăng nhập... 🚀
        </p>
        <div className="pt-4">
          <Link href="/login">
            <Button className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 text-orange-500 mb-4 shadow-sm -rotate-6">
        <Mail className="w-12 h-12" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-gray-800">Nhập mã xác thực</h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          Chúng mình đã gửi mã OTP 6 chữ số đến <br />
          <span className="text-orange-600 font-black">{email || 'email của bạn'}</span>. <br />
          Vui lòng nhập mã để hoàn tất đăng ký! 📩
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pt-4">
        <div className="flex justify-center gap-2 md:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => setActiveInput(index)}
              className={`w-11 h-14 md:w-14 md:h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all outline-none ${
                activeInput === index ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-100 bg-gray-50'
              } ${error ? 'border-rose-400 bg-rose-50' : ''}`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-rose-500 font-bold animate-pulse">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={otp.join('').length < 6}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xl shadow-[0_6px_0_0_#c2410c] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
          >
            Xác nhận mã ngay
          </Button>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              type="button"
              disabled={countdown > 0} 
              className={`text-sm font-bold transition-colors ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-orange-500 hover:text-orange-600'}`}
              onClick={() => {
                setCountdown(60);
                // Resend logic would go here
              }}
            >
              {countdown > 0 ? `Gửi lại mã mới sau ${countdown}s` : 'Chưa nhận được mã? Gửi lại ngay'}
            </button>
            <Link
              href="/login"
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-4"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 text-center">
        <div className="flex justify-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
        </div>
        <p className="text-orange-500 font-bold animate-pulse">Đang tải...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
