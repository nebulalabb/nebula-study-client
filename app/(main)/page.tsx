import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nebula Study | Nền tảng học tập thông minh cùng AI',
  description: 'Biến việc học nhàm chán thành cuộc phiêu lưu thú vị. Giải bài tập, luyện đề, học từ vựng 5 phút mỗi ngày cùng trợ lý AI siêu đỉnh.',
  openGraph: {
    title: 'Nebula Study | Học siêu vui, điểm siêu cao!',
    description: 'Nền tảng học tập thế hệ mới bứt phá giới hạn cùng công nghệ AI.',
    images: ['/og-image.png'],
  },
};
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, 
  Brain, 
  BookOpen, 
  PenTool, 
  FileText, 
  Users, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nebula Study",
    "alternateName": ["Nebula Study", "Học cùng Nebula"],
    "url": "https://nebulastudy.vercel.app",
    "description": "Nền tảng học tập thông minh cùng trợ lý AI - Giải bài tập, Flashcard, Luyện đề.",
    "publisher": {
      "@type": "Organization",
      "name": "Nebula Study Team",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nebulastudy.vercel.app/logo.png"
      }
    }
  };

  const features = [
    {
      title: 'Flashcard Thần Tốc',
      description: 'Học bài siêu lẹ, nhớ siêu lâu với bộ flashcard AI tự động tạo.',
      icon: <Zap className="text-orange-500" />,
      color: 'bg-orange-100 border-orange-200'
    },
    {
      title: 'Gia Sư AI Giải Bài',
      description: 'Kẹt bài khó? Có AI lo! Giải chi tiết từng bước dễ hiểu.',
      icon: <Brain className="text-rose-400" />,
      color: 'bg-rose-100 border-rose-200'
    },
    {
      title: 'Thi Thử Báo Điểm',
      description: 'Luyện đề như thi thật, AI chỉ ra điểm yếu bám sát lộ trình.',
      icon: <BookOpen className="text-amber-400" />,
      color: 'bg-amber-100 border-amber-200'
    },
    {
      title: 'Học Mỗi Ngày 5 Phút',
      description: 'Xây dựng thói quen học tập cực nhàn, dễ nhằn như ăn kẹo!',
      icon: <Star className="text-yellow-500" />,
      color: 'bg-yellow-100 border-yellow-200'
    },
    {
      title: 'Tóm Tắt Ý Chính',
      description: 'Tài liệu dài lê thê? AI tóm gọn lại thành vài gạch đầu dòng siêu đỉnh.',
      icon: <FileText className="text-emerald-400" />,
      color: 'bg-emerald-100 border-emerald-200'
    },
    {
      title: 'Tìm Gia Sư Xịn',
      description: 'Kết nối với các anh chị gia sư siêu xịn sò, giải cứu cấp tốc.',
      icon: <Users className="text-sky-400" />,
      color: 'bg-sky-100 border-sky-200'
    },
    {
      title: 'Tạo Bài Test Nhanh',
      description: 'Tự động ra đề thi từ bất kỳ bài giảng nào chỉ bằng 1 cú click.',
      icon: <CheckCircle className="text-teal-400" />,
      color: 'bg-teal-100 border-teal-200'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F5] font-sans text-gray-800 overflow-x-hidden selection:bg-orange-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* CUTE DECORATIONS */}
      <div className="absolute top-20 left-10 text-orange-300 opacity-50 animate-bounce">
        <Sparkles size={48} />
      </div>
      <div className="absolute top-40 right-20 text-yellow-300 opacity-60 animate-pulse">
        <Star size={56} fill="currentColor" />
      </div>
      <div className="absolute top-96 left-32 text-rose-300 opacity-40">
        <Rocket size={40} className="rotate-45" />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-orange-200 text-orange-600 font-bold shadow-[0_4px_0_0_rgba(254,215,170,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-default">
            <span className="text-xl">🎓</span>
            Nền tảng học tập thế hệ mới
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.2] text-gray-800">
            Học siêu vui, điểm <br className="hidden md:block" />
            siêu cao cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">NebulaStudy!</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 font-medium">
            Biến việc học nhàm chán thành cuộc phiêu lưu thú vị với các công cụ AI siêu việt. Khám phá ngay! ✨
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-[0_6px_0_0_#c2410c] hover:translate-y-1 hover:shadow-[0_0px_0_0_#c2410c] transition-all flex items-center gap-2">
                Bắt đầu ngay thôi! <ArrowRight strokeWidth={3} />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-16 px-10 text-xl rounded-full border-2 border-orange-200 text-orange-600 font-bold bg-white hover:bg-orange-50 shadow-[0_6px_0_0_rgba(254,215,170,1)] hover:translate-y-1 hover:shadow-none transition-all">
                Xem có gì vui? 👇
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Soft blob background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-4 bg-white rounded-[3rem] mx-4 md:mx-10 shadow-sm border border-orange-100 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800">Bí kíp học tập dành cho bạn 🌟</h2>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">Tất tần tật những vũ khí bí mật giúp bạn "hack" điểm số một cách thật dễ dàng!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`group p-8 rounded-[2rem] bg-white border-2 border-orange-100 hover:${feature.color} hover:border-transparent transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-xl cursor-default flex flex-col items-center text-center`}
              >
                <div className={`w-20 h-20 rounded-[1.5rem] bg-white shadow-sm border-2 ${feature.color.split(' ')[1]} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 40 })}
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4 relative">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-orange-400 to-rose-400 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
          
          <div className="absolute top-0 right-0 text-white/20 translate-x-1/4 -translate-y-1/4 rotate-12">
            <Sparkles size={300} />
          </div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-6xl font-black drop-shadow-md">Sẵn sàng đua top chưa? 🏆</h2>
            <p className="text-orange-50 text-xl md:text-2xl max-w-2xl mx-auto font-medium">
              Gia nhập ngay hội học bá cùng hàng ngàn bạn bè trên khắp mọi miền. Đăng ký tài khoản cực nhanh chỉ mất 30 giây!
            </p>
            <Link href="/register" className="inline-block">
              <button className="h-16 px-12 text-2xl rounded-full bg-white text-orange-500 font-black shadow-[0_8px_0_0_#fdba74] hover:shadow-[0_0px_0_0_#fdba74] hover:translate-y-2 hover:bg-orange-50 transition-all">
                Chiến luôn! 🚀
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
