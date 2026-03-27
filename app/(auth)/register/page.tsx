'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { Sparkles, Heart } from 'lucide-react';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Mật khẩu không khớp',
  path: ['confirm_password'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await registerUser(data);
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-rose-100 text-rose-500 mb-2 -rotate-3 shadow-sm font-black text-2xl">
          🚀
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-800">
          Tạo tài khoản mới
        </h1>
        <p className="text-gray-500 font-medium">
          Dành ra 30s để bắt đầu học tập
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Họ và tên"
          placeholder="Nguyen Van A"
          {...register('full_name')}
          error={errors.full_name?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="••••••••"
          {...register('confirm_password')}
          error={errors.confirm_password?.message}
        />

        <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-[0_4px_0_0_#c2410c] hover:translate-y-1 hover:shadow-none transition-all mt-6" isLoading={isSubmitting}>
          Đăng Ký Ngay
        </Button>
      </form>

      <div className="text-center text-sm font-medium text-gray-500 pt-2">
        Đã có tài khoản?{' '}
        <Link
          href="/login"
          className="font-black text-rose-500 hover:text-rose-600 transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
