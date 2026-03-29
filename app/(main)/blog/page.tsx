import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Kiến Thức & Mẹo Học Tập | Nebula Study',
  description: 'Khám phá kiến thức mới, mẹo học tập thông minh và cách ứng dụng AI để bứt phá điểm số cùng Nebula Study.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] pt-24 pb-20 px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -mr-48 -z-10" />
      <div className="absolute bottom-40 left-0 w-72 h-72 bg-rose-100/30 rounded-full blur-3xl -ml-36 -z-10" />

      <div className="max-w-6xl mx-auto space-y-16 relative">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm shadow-sm">
            <Sparkles size={16} /> Góc học thuật Nebula
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">Blog & Mẹo Học Tập</h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Chia sẻ những bí kíp "hack" điểm số, phương pháp học tập khoa học và tin tức công nghệ giáo dục mới nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-[2.5rem] border-2 border-orange-50 overflow-hidden hover:border-orange-200 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-black text-orange-600 uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} /> {new Date(post.date).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} /> {post.author}
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-orange-500 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="pt-4 flex items-center text-orange-500 font-black text-sm gap-2">
                  Đọc tiếp <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
