import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Nebula Study | Học tập thông minh cùng trợ lý AI',
    template: '%s | Nebula Study',
  },
  description: 'Nền tảng học tập thế hệ mới bứt phá giới hạn cùng công nghệ AI. Giải bài tập, luyện đề, học từ vựng 5 phút mỗi ngày.',
  keywords: ['học tập', 'AI', 'giải bài tập', 'flashcard', 'luyện đề', 'gia sư'],
  metadataBase: new URL('https://nebulastudy.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://nebulastudy.vercel.app',
    siteName: 'Nebula Study',
    title: 'Nebula Study | Học siêu vui, điểm siêu cao!',
    description: 'Nền tảng học tập thế hệ mới bứt phá giới hạn cùng công nghệ AI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nebula Study Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebula Study | Học siêu vui, điểm siêu cao!',
    description: 'Cùng AI chinh phục mọi đỉnh cao kiến thức.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import { Toaster } from 'sonner';
import { SocketProvider } from '@/context/socket-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${nunito.variable} h-full antialiased`}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-900 selection:bg-orange-200">
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster position="top-right" closeButton />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
