'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { Mail, CheckCircle2, XCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

const resetSchema = z.object({
  new_password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Mật khẩu không khớp',
  path: ['confirm_password'],
});

type ResetForm = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  if (!email) {
    return (
      <div className="w-full space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 text-center">
        <h1 className="text-2xl font-black text-rose-500">Thiếu thông tin</h1>
        <p className="text-gray-500 font-medium">Vui lòng quay lại trang quên mật khẩu để bắt đầu lại.</p>
        <Link href="/forgot-password" className="block mt-4">
          <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2">Quay lại</Button>
        </Link>
      </div>
    );
  }

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
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

  const onSubmit = async (data: ResetForm) => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.post('/auth/reset-password', {
        email,
        otp: otpValue,
        new_password: data.new_password,
      });
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Mã OTP có thể đã hết hạn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 border-2 border-emerald-100 relative z-10 text-center animate-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-800">Cập nhật thành công!</h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          Mật khẩu của bạn đã được thay đổi. <br />
          Hãy sử dụng mật khẩu mới để đăng nhập nhé! 🚀
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
    <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-orange-100 text-orange-500 mb-2 rotate-3 shadow-sm font-black text-2xl">
          🔐
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-800">Đặt lại mật khẩu</h1>
        <p className="text-gray-500 font-medium text-sm">Nhập mã OTP vừa được gửi đến email:</p>
        <p className="font-black text-orange-600 tracking-tight">{email}</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center shadow-sm flex items-center justify-center gap-2">
          <XCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* OTP Inputs */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 block text-center">Mã OTP 6 chữ số</label>
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={() => setActiveInput(index)}
                className={`w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all outline-none ${
                  activeInput === index ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' : 'border-gray-100 bg-gray-50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="••••••••"
            {...register('new_password')}
            error={errors.new_password?.message}
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />
        </div>

        <div className="space-y-4 pt-2">
          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-[0_4px_0_0_#c2410c] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2" 
            isLoading={isSubmitting}
            disabled={otp.join('').length < 6}
          >
            <ShieldCheck size={20} /> Xác nhận đổi mật khẩu
          </Button>
          
          <Link href="/forgot-password" title="Quay lại">
             <button type="button" className="w-full text-center text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Gửi lại mã khác
             </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center">
        <p className="text-orange-500 font-bold animate-pulse italic">Đang tải dữ liệu... ✨</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
