'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MessageSquare, 
  ChevronUp, 
  ChevronDown, 
  Calendar, 
  User, 
  Share2,
  MoreVertical,
  CornerDownRight,
  Send,
  Sparkles,
  Quote,
  Loader2,
  MessageCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/lib/toast-util';
import { formatTimeAgo } from '@/lib/time-util';

interface ForumPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  vote_score: number;
  user_vote: number | null;
  created_at: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string;
  category_name: string;
  vote_score: number;
  user_vote: number | null;
  tags: string[];
  created_at: string;
}

export default function ForumTopicDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [slug]);

  const fetchTopic = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/community/forum/topic/${slug}`);
      setTopic(res.data.data.topic);
      setPosts(res.data.data.posts || []);
    } catch (err) {
      console.error('Failed to fetch topic:', err);
      toast.error('Không tìm thấy chủ đề này');
      router.push('/social/forum');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (type: number, topic_id?: string, post_id?: string) => {
     try {
        await apiClient.post('/community/forum/vote', {
           topic_id,
           post_id,
           vote_type: type
        });
        fetchTopic();
     } catch (err) {
        toast.error('Bình chọn thất bại');
     }
  };

  const handleQuote = (authorName: string, content: string) => {
    const quoted = `> **${authorName} viết:**\n> ${content.split('\n').join('\n> ')}\n\n`;
    setReplyContent(prev => quoted + prev);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/community/forum/post', {
        topic_id: topic?.id,
        content: replyContent
      });
      setReplyContent('');
      fetchTopic();
      toast.success('Đã gửi phản hồi! ✨');
    } catch (err) {
      toast.error('Gửi phản hồi thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="p-32 text-center space-y-4">
       <Loader2 className="animate-spin text-orange-200 mx-auto" size={48} />
       <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Đang tải cuộc thảo luận...</p>
    </div>
  );
  if (!topic) return null;

  return (
    <div className="flex flex-col h-full bg-white relative overflow-y-auto custom-scrollbar">
      {/* Thread Header */}
      <div className="bg-[#FFF9F5] p-5 md:p-6 border-b-2 border-orange-50/50 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none">
           <MessageSquare size={100} />
        </div>
        
        <Link 
          href="/social/forum" 
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-orange-500 font-black text-[9px] uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quay lại
        </Link>

        <div className="space-y-2 relative z-10">
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white text-orange-600 text-[8px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">
                 {topic.category_name}
              </span>
              <span className="text-[8px] font-black text-gray-300 flex items-center gap-1.5 uppercase tracking-widest">
                 <Calendar size={10} className="text-orange-300" /> {formatTimeAgo(topic.created_at)}
              </span>
           </div>
           <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tighter">
             {topic.title}
           </h1>
           {topic.tags && topic.tags.length > 0 && (
             <div className="flex flex-wrap gap-1 pt-0.5">
               {topic.tags.map(tag => (
                 <span key={tag} className="px-2 py-0.5 rounded-lg bg-orange-50 text-[8px] font-black text-orange-400 uppercase tracking-wider border border-orange-100/50">
                   #{tag}
                 </span>
               ))}
             </div>
           )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full py-6 px-6 md:px-8 space-y-6 pb-48">
         {/* Original Post */}
         <div className="bg-white rounded-[2.5rem] border-4 border-[#FFF9F5] shadow-2xl shadow-orange-500/5 p-5 flex flex-col md:flex-row gap-5 relative group">
            {/* Side Vote */}
            <div className="flex flex-row md:flex-col items-center shrink-0 space-y-1 bg-[#FFF9F5] rounded-[1.2rem] p-1.5 border-2 border-orange-50 shadow-inner h-fit">
               <button 
                 onClick={() => handleVote(topic.user_vote === 1 ? 0 : 1, topic.id)}
                 className={`p-1 rounded-lg transition-all ${topic.user_vote === 1 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-orange-200 hover:text-orange-500'}`}
               >
                  <ChevronUp size={20} strokeWidth={3} />
               </button>
               <span className="font-black text-lg text-gray-800 px-1">{topic.vote_score}</span>
               <button 
                 onClick={() => handleVote(topic.user_vote === -1 ? 0 : -1, topic.id)}
                 className={`p-1 rounded-lg transition-all ${topic.user_vote === -1 ? 'bg-zinc-800 text-white shadow-lg shadow-zinc-800/20' : 'text-orange-200 hover:text-zinc-800'}`}
               >
                  <ChevronDown size={20} strokeWidth={3} />
               </button>
            </div>

            <div className="flex-1 space-y-5">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-orange-50">
                        {topic.author_avatar ? <img src={topic.author_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-black text-xs">{topic.author_name.charAt(0)}</div>}
                     </div>
                     <div>
                        <p className="font-black text-xs text-gray-900 flex items-center gap-1.5 truncate max-w-[200px]">{topic.author_name} <Sparkles size={10} className="text-orange-400" /></p>
                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">Tác giả • {formatTimeAgo(topic.created_at)}</p>
                     </div>
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center text-gray-300 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-all">
                     <MoreVertical size={18} />
                  </button>
               </div>

               <div className="prose prose-orange max-w-none text-gray-700 font-bold leading-relaxed text-sm tracking-tight bg-gray-50/50 p-5 rounded-[1.8rem] border-2 border-white shadow-inner">
                  <ReactMarkdown>{topic.content}</ReactMarkdown>
               </div>

               <div className="pt-1 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                     <button 
                        onClick={() => handleQuote(topic.author_name, topic.content)}
                        className="h-9 px-4 rounded-xl bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-95 group/btn"
                     >
                        <Quote size={12} className="text-orange-300 group-hover/btn:text-white" /> Trích dẫn
                     </button>
                     <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#FFF9F5] text-gray-400 hover:text-orange-500 transition-all border-2 border-white shadow-sm">
                        <Share2 size={14} />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Replies Divider */}
         <div className="flex items-center gap-4 px-8">
            <span className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] whitespace-nowrap">{posts.length} Phản hồi</span>
            <div className="flex-1 h-1 bg-orange-50/50 rounded-full" />
         </div>

         {/* Replies List */}
         <div className="space-y-5">
            {posts.map((post) => (
               <div key={post.id} className="group bg-white rounded-[2rem] border-4 border-transparent hover:border-[#FFF9F5] hover:shadow-2xl hover:shadow-orange-500/5 transition-all p-5 flex flex-col sm:flex-row gap-5 relative overflow-hidden">
                  <div className="flex flex-row sm:flex-col items-center shrink-0 space-y-1 scale-90 bg-gray-50/50 rounded-xl p-1.5 border border-white shadow-inner h-fit">
                     <button 
                       onClick={() => handleVote(post.user_vote === 1 ? 0 : 1, undefined, post.id)}
                       className={`p-1.5 rounded-lg transition-all ${post.user_vote === 1 ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-300 hover:text-orange-500'}`}
                     >
                        <ChevronUp size={20} strokeWidth={3} />
                     </button>
                     <span className="font-black text-lg text-gray-700 px-1">{post.vote_score}</span>
                     <button 
                        onClick={() => handleVote(post.user_vote === -1 ? 0 : -1, undefined, post.id)}
                        className={`p-1.5 rounded-lg transition-all ${post.user_vote === -1 ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-300 hover:text-zinc-800'}`}
                     >
                        <ChevronDown size={20} strokeWidth={3} />
                     </button>
                  </div>

                  <div className="flex-1 space-y-5">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#FFF9F5] border-2 border-white shadow-md">
                             {post.author_avatar ? <img src={post.author_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-black text-orange-400">{post.author_name.charAt(0)}</div>}
                           </div>
                           <div>
                              <span className="font-black text-xs text-gray-800 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{post.author_name}</span>
                              <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mt-0.5">• {formatTimeAgo(post.created_at)}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                              onClick={() => handleQuote(post.author_name, post.content)}
                              className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center gap-1.5"
                           >
                              <MessageSquare size={12} /> Trích dẫn
                           </button>
                        </div>
                     </div>
                     <div className="text-gray-600 font-bold leading-relaxed text-sm bg-gray-50/30 p-5 rounded-[1.8rem] border-2 border-white">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Sticky Reply Area */}
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
           <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border-4 border-white shadow-[0_20px_50px_-10px_rgba(251,146,60,0.2)] p-5 space-y-3 group transition-all hover:bg-white animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between px-3">
                 <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 shadow-inner"><CornerDownRight size={16} /></div>
                    <p className="font-black text-gray-900 text-xs tracking-tight">Gửi phản hồi</p>
                 </div>
                 <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic tracking-tighter">Markdown supported ✨</div>
              </div>
              <div className="relative group/area">
                 <textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Chia sẻ ý kiến của bạn..."
                    className="w-full h-20 rounded-[1.8rem] bg-orange-50/30 border-none p-5 text-xs font-black text-gray-700 placeholder:text-gray-300 focus:ring-4 focus:ring-orange-500/10 resize-none transition-all"
                 />
                 <div className="absolute bottom-2.5 right-2.5">
                    <button 
                      disabled={isSubmitting || !replyContent.trim()}
                      onClick={handleSubmitReply}
                      className="h-10 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black shadow-xl shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 group/send text-xs"
                    >
                       {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (
                         <>Gửi ngay <Send size={16} className="group-hover/send:translate-x-1 transition-transform" /></>
                       )}
                    </button>
                 </div>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}

