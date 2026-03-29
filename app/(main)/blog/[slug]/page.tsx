import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  MessageSquare, 
  Send, 
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) return { title: 'Không tìm thấy bài viết' };

  return {
    title: `${post.title} | Nebula Study Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "description": post.excerpt
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-black uppercase tracking-widest text-xs transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại Blog
            </Link>
            <div className="space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-widest shadow-lg">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar size={18} /> {new Date(post.date).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} /> {post.author}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 pt-16 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <article className="prose prose-lg prose-orange max-w-none">
            <div className="text-xl text-gray-500 font-medium italic border-l-4 border-orange-500 pl-6 mb-12 py-2">
              {post.excerpt}
            </div>
            
            <div className="blog-content font-medium text-gray-700 leading-relaxed space-y-6">
               <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-gray-100">
             <div className="flex items-center justify-between">
                <p className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center gap-2">
                  <Share2 size={18} /> Chia sẻ bài viết
                </p>
                <div className="flex items-center gap-3">
                   <button className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                      <MessageSquare size={20} />
                   </button>
                   <button className="p-3 bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20">
                      <Send size={20} />
                   </button>
                   <button className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors">
                      <LinkIcon size={20} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-12 shrink-0">
           <div className="bg-[#FFF9F5] p-8 rounded-[3rem] border-2 border-orange-100 space-y-6">
              <h3 className="text-2xl font-black text-gray-900 leading-tight">Gia nhập cộng đồng Nebula ✨</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Nơi hội tụ hàng ngàn học sinh cùng chí hướng, bứt phá mọi giới hạn kiến thức.
              </p>
              <Link href="/register">
                 <button className="w-full h-14 bg-orange-500 text-white rounded-[1.5rem] font-black shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95">
                    Đăng ký ngay
                 </button>
              </Link>
           </div>
           
           <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest pl-2 flex items-center gap-2">
                 Thêm mẹo hay <ChevronRight size={18} />
              </h3>
              <div className="space-y-4">
                 {blogPosts.filter(p => p.slug !== slug).slice(0, 3).map(related => (
                    <Link 
                      key={related.slug} 
                      href={`/blog/${related.slug}`}
                      className="group flex gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors"
                    >
                       <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                          <img src={related.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 font-bold">
                            {new Date(related.date).toLocaleDateString('vi-VN')}
                          </p>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h1 { font-size: 2.5rem; font-weight: 900; color: #111827; margin: 3rem 0 1.5rem; }
        .blog-content h2 { font-size: 2rem; font-weight: 900; color: #111827; margin: 2.5rem 0 1.25rem; }
        .blog-content h3 { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 2rem 0 1rem; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content li { margin-bottom: 0.75rem; }
        .blog-content strong { font-weight: 800; color: #111827; }
      `}} />
    </div>
  );
}
