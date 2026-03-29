import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
  description: 'Tham gia cộng đồng Nebula Study ngay hôm nay. Chỉ mất 30 giây để bắt đầu trải nghiệm học tập đỉnh cao cùng AI.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
