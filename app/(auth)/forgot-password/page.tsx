'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.post('/auth/forgot-password', data);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 mb-4 shadow-sm">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-800">Yêu cầu đã được gửi!</h1>
        <p className="text-gray-500 font-medium">Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn qua hộp thư.</p>
        <Link href="/login" className="block mt-6">
          <Button className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-[0_4px_0_0_#c2410c] hover:translate-y-1 hover:shadow-none transition-all">
            Trở về đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-500 mb-2 rotate-3 shadow-sm font-black text-2xl">
          🔑
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-800">Quên mật khẩu?</h1>
        <p className="text-gray-500 font-medium">
          Đừng lo, hãy nhập email vào đây để nhận link đặt lại mật khẩu nhé.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-[0_4px_0_0_#c2410c] hover:translate-y-1 hover:shadow-none transition-all" isLoading={isSubmitting}>
          Gửi Hướng Dẫn
        </Button>
      </form>

      <div className="text-center text-sm font-medium text-gray-500">
        <Link
          href="/login"
          className="font-black text-orange-500 hover:text-orange-600 transition-colors"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
