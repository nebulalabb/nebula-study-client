'use client';

import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  User,
  Lock,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
  Globe,
  Star,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Crown
} from 'lucide-react';

import { toast } from '@/lib/toast-util';

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, icon, children, description }: { title: string; icon: React.ReactNode; children: React.ReactNode; description?: string }) {
  return (
    <div className="bg-white rounded-[2.5rem] border-4 border-orange-50/50 p-8 md:p-12 space-y-8 shadow-xl shadow-orange-500/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-30 -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
      
      <div className="space-y-1 relative z-10">
        <h2 className="flex items-center gap-4 text-2xl font-black text-gray-900 tracking-tight">
          <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 shadow-sm rotate-3 group-hover:rotate-0 transition-transform">
             {icon}
          </div>
          {title}
        </h2>
        {description && <p className="text-gray-400 font-medium text-sm ml-14">{description}</p>}
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ─── Input field ─────────────────────────────────────────────────────────────
function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 focus:bg-white transition-all text-sm font-bold shadow-inner";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  };

  // ── Profile form ──────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name ?? '',
    locale: user?.locale ?? 'vi',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await apiClient.patch('/user/me', profileForm);
      await refreshUser();
      showToast('Hồ sơ của bạn đã được cập nhật xịn hơn rồi!', 'success');
    } catch {
      showToast('Ôi, có lỗi nhỏ xảy ra. Hãy thử lại nhé!', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────────────
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url ?? null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await apiClient.post('/user/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await refreshUser();
      showToast('Ảnh đại diện mới trông thật tuyệt!', 'success');
    } catch {
      showToast('Tải ảnh thất bại. Bạn kiểm tra lại file nhé!', 'error');
      setAvatarPreview(user?.avatar_url ?? null);
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Password form ─────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [pwLoading, setPwLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      showToast('Mật khẩu xác nhận không khớp mất rồi', 'error');
      return;
    }
    if (pwForm.new_password.length < 8) {
      showToast('Mật khẩu mới phải từ 8 ký tự trở lên nha', 'error');
      return;
    }
    setPwLoading(true);
    try {
      await apiClient.post('/user/me/change-password', {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      showToast('Mật khẩu đã được bảo mật thành công!', 'success');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch {
      showToast('Mật khẩu hiện tại không đúng. Hãy kiểm tra lại!', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F5] p-6 space-y-6">
         <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/10">
            <ShieldCheck size={48} strokeWidth={2.5} />
         </div>
         <p className="text-gray-400 font-black uppercase tracking-widest text-center">Bạn cần đăng nhập để xem cài đặt.</p>
         <Link href="/login">
            <Button className="rounded-2xl px-10 h-14 font-black bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">Đăng nhập ngay</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 selection:bg-orange-200">
      <div className="max-w-4xl mx-auto px-6 pt-20 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-200 shadow-sm">
               <Sparkles size={14} /> Tùy chỉnh không gian học
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
               Cài đặt <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Tài khoản</span>
            </h1>
            <p className="text-gray-400 font-bold text-lg">Quản lý thông tin và bảo mật không gian học tập của bạn.</p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3 p-2 bg-white rounded-3xl border-2 border-orange-50 shadow-sm">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shadow-lg rotate-6">
                <Crown size={24} fill="currentColor" />
             </div>
             <div className="pr-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Cấp độ học sĩ</p>
                <p className="font-black text-gray-900">LV {user?.level || 1}</p>
             </div>
          </div>
        </header>

        {/* Section 1: Avatar + Profile */}
        <Section 
          title="Thông tin cơ bản" 
          icon={<User size={22} strokeWidth={2.5} />}
          description="Cập nhật ảnh đại diện và thông tin định danh của bạn."
        >
          <div className="space-y-10">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white border-4 border-white shadow-2xl shadow-orange-500/10 overflow-hidden ring-8 ring-orange-500/5 group-hover:scale-105 transition-transform duration-300">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-orange-500 bg-orange-50">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarLoading}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-4 border-orange-50 rounded-2xl flex items-center justify-center text-orange-500 hover:scale-110 disabled:opacity-50 transition-all shadow-xl shadow-orange-500/20 active:scale-95 z-20"
                  title="Thay ảnh đại diện"
                >
                  {avatarLoading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} strokeWidth={3} />}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              
              <div className="space-y-4 text-center sm:text-left">
                <div className="space-y-1">
                   <h3 className="font-black text-xl text-gray-900">Ảnh chân dung học bá</h3>
                   <p className="text-sm font-medium text-gray-400">Tải lên một tấm ảnh thật rạng rỡ để bạn bè cùng nhận diện nhé!</p>
                </div>
                <Button 
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarLoading}
                  className="rounded-2xl h-12 px-8 font-black bg-white text-orange-600 border-2 border-orange-100 hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm"
                >
                  <Upload size={16} className="mr-2" strokeWidth={3} /> Chọn ảnh mới
                </Button>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Định dạng JPG, PNG, WebP — Tối đa 5MB</p>
              </div>
            </div>

            {/* Profile form */}
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <Field label="Họ và tên của bạn" id="full_name">
                  <input
                    id="full_name"
                    type="text"
                    className={inputCls}
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </Field>
                <Field label="Địa chỉ Email" id="email">
                  <input
                    id="email"
                    type="email"
                    className={`${inputCls} opacity-50 cursor-not-allowed bg-gray-100`}
                    value={user?.email ?? ''}
                    readOnly
                    title="Email không thể thay đổi"
                  />
                </Field>
              </div>

              <Field label="Ngôn ngữ hiển thị" id="locale">
                <div className="relative">
                  <select
                    id="locale"
                    className={`${inputCls} appearance-none pr-12`}
                    value={profileForm.locale}
                    onChange={(e) => setProfileForm({ ...profileForm, locale: e.target.value })}
                  >
                    <option value="vi">Tiếng Việt (Mặc định)</option>
                    <option value="en">English (Coming Soon)</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Globe size={18} />
                  </div>
                </div>
              </Field>

              {/* Plan info card */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white to-orange-50 border-4 border-orange-100/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-500/5 group">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-[1.25rem] bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:rotate-6 transition-transform">
                      <Star size={28} fill="currentColor" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Gói thành viên</p>
                      <p className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors capitalize">{user?.plan || 'Học sinh mới'}</p>
                   </div>
                </div>
                {user?.plan === 'free' && (
                  <Link href="/billing/upgrade">
                    <Button 
                      className="rounded-[1rem] h-12 px-8 font-black bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
                    >
                      Nâng cấp ngay <ArrowRight size={16} strokeWidth={3} className="ml-2" />
                    </Button>
                  </Link>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={profileLoading}
                  className="rounded-2xl h-14 px-12 font-black bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all w-full sm:w-auto text-lg"
                >
                  {profileLoading ? <Loader2 size={24} className="animate-spin mr-2" /> : <CheckCircle size={24} className="mr-2" strokeWidth={3} />}
                  Cập nhật hồ sơ
                </Button>
              </div>
            </form>
          </div>
        </Section>

        {/* Section 2: Change Password */}
        <Section 
          title="Bảo mật & Mật khẩu" 
          icon={<Lock size={22} strokeWidth={2.5} />}
          description="Giữ cho tài khoản của bạn luôn an toàn với mật khẩu mạnh."
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-8">
            <Field label="Mật khẩu hiện tại" id="current_password">
              <input
                id="current_password"
                type="password"
                className={inputCls}
                value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                placeholder="Nhập mật khẩu đang dùng"
                required
              />
            </Field>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <Field label="Mật khẩu mới xịn hơn" id="new_password">
                <input
                  id="new_password"
                  type="password"
                  className={inputCls}
                  value={pwForm.new_password}
                  onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                  placeholder="Ít nhất 8 ký tự"
                  minLength={8}
                  required
                />
              </Field>
              <Field label="Xác nhận lại một lần nữa" id="confirm_password">
                <input
                  id="confirm_password"
                  type="password"
                  className={inputCls}
                  value={pwForm.confirm_password}
                  onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </Field>
            </div>

            <div className="pt-4">
               <Button 
                 type="submit" 
                 disabled={pwLoading}
                 variant="outline"
                 className="rounded-2xl h-14 px-10 font-black border-2 border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-all w-full sm:w-auto"
               >
                 {pwLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : <ShieldCheck size={20} className="mr-2" strokeWidth={3} />}
                 Thiết lập mật khẩu mới
               </Button>
            </div>
          </form>
        </Section>

        {/* Support Section */}
        <div className="text-center py-12 space-y-4">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Cần hỗ trợ? ✨</p>
           <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
             Nếu bạn gặp khó khăn trong việc quản lý tài khoản, đừng ngần ngại liên hệ với đội ngũ Nebula qua <a href="/help" className="text-orange-400 hover:underline">Trung tâm trợ giúp</a> nhé!
           </p>
        </div>
      </div>
    </div>
  );
}
