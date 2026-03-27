'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

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
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  if (!token || !email) {
    return (
      <div className="w-full space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 text-center">
        <h1 className="text-2xl font-black text-rose-500">Liên kết không hợp lệ</h1>
        <p className="text-gray-500 font-medium">Liên kết đặt lại mật khẩu đã hết hạn hoặc không đúng.</p>
        <Link href="/forgot-password" className="block mt-4">
          <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2">Yêu cầu liên kết mới</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        email,
        new_password: data.new_password,
      });
      alert('Đặt lại mật khẩu thành công! Hãy đăng nhập với mật khẩu mới.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Token có thể đã hết hạn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-500 mb-2 rotate-3 shadow-sm font-black text-2xl">
          ✨
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-800">Đặt lại mật khẩu</h1>
        <p className="text-gray-500 font-medium text-sm">Cho tài khoản: <strong className="text-gray-700">{email}</strong></p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Mật khẩu mới"
          type="password"
          placeholder="••••••••"
          {...register('new_password')}
          error={errors.new_password?.message}
        />
        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          placeholder="••••••••"
          {...register('confirm_password')}
          error={errors.confirm_password?.message}
        />
        <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-[0_4px_0_0_#c2410c] hover:translate-y-1 hover:shadow-none transition-all" isLoading={isSubmitting}>
          Đổi Mật Khẩu
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 font-bold text-gray-500">⏳ Đang tải...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
