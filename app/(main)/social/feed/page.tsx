'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Smile, 
  Send, 
  MoreHorizontal,
  Plus,
  Rocket,
  Trash2,
  Copy,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/lib/toast-util';
import { useAuth } from '@/context/auth-context';
import { formatTimeAgo } from '@/lib/time-util';
import CuteModal from '@/components/ui/CuteModal';

interface FeedPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  media_urls: string[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: string;
  feeling?: { icon: string; label: string } | null;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ id: string, file: File, preview: string }[]>([]);
  const [feeling, setFeeling] = useState<{emoji: string, text: string} | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const { user } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/community/feed');
      setPosts(res.data.data.items || []);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchComments = async (postId: string) => {
    if (showCommentsFor === postId) {
      setShowCommentsFor(null);
      return;
    }
    setShowCommentsFor(postId);
    setComments([]);
    try {
      const res = await apiClient.get(`/community/feed/${postId}/comments`);
      setComments(res.data.data.items || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      await apiClient.post(`/community/feed/${postId}/comment`, { content: newComment });
      setNewComment('');
      const res = await apiClient.get(`/community/feed/${postId}/comments`);
      setComments(res.data.data.items || []);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p));
      toast.success('Đã gửi bình luận');
    } catch (err) {
      toast.error('Bình luận thất bại');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = async () => {
    if ((!newPostContent.trim() && selectedImages.length === 0) || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const uploadPromises = selectedImages.map(async (img) => {
         const formData = new FormData();
         formData.append('file', img.file);
         const res = await apiClient.post('/social/messages/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         return res.data.data.url || res.data.data.secure_url;
      });

      const mediaUrls = await Promise.all(uploadPromises);

      await apiClient.post('/community/feed', {
        content: newPostContent,
        media_urls: mediaUrls,
        privacy: 'public',
        feeling: feeling ? { icon: feeling.emoji, label: feeling.text } : null
      });

      setNewPostContent('');
      setSelectedImages([]);
      setFeeling(null);
      fetchPosts();
      toast.success('Đã đăng bài viết! 🎉');
    } catch (err) {
      toast.error('Đăng bài thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await apiClient.post(`/community/feed/${postId}/like`);
      setPosts(current => current.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            is_liked: res.data.liked,
            like_count: res.data.liked ? p.like_count + 1 : p.like_count - 1
          };
        }
        return p;
      }));
    } catch (err) {
      toast.error('Thực hiện thất bại');
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await apiClient.delete(`/community/feed/${postToDelete}`);
      setPosts(prev => prev.filter(p => p.id !== postToDelete));
      toast.success('Đã xóa bài viết');
    } catch (err) {
      toast.error('Xóa thất bại');
    } finally {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/social/feed?post=${postId}`;
    navigator.clipboard.writeText(url);
    toast.success('Đã sao chép liên kết');
    setOpenMenuId(null);
  };

  const feelings = [
    { emoji: '🤩', text: 'Hào hứng' },
    { emoji: '💪', text: 'Quyết tâm' },
    { emoji: '🎓', text: 'Sẵn sàng học' },
    { emoji: '🔥', text: 'Đầy năng lượng' },
    { emoji: '🤔', text: 'Đang suy nghĩ' },
    { emoji: '😴', text: 'Mệt mỏi' },
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-[#FFF9F5] relative overflow-y-auto custom-scrollbar">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/20 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

        {/* Feed Header */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b-2 border-orange-50/50 px-6 py-4">
           <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="space-y-0.5">
                 <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    <Rocket className="text-orange-500" size={24} />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Bảng tin cộng đồng</span>
                 </h2>
                 <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hidden sm:block">Chia sẻ & Kết nối cùng Nebula</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                 <div className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="text-orange-400" /> Hoạt động sôi nổi
                 </div>
              </div>
           </div>
        </header>

        <div className="max-w-2xl mx-auto w-full py-8 px-6 space-y-8 relative z-10">
          
          {/* Post Composer Card */}
          <div className="bg-white rounded-[2.5rem] border-4 border-orange-50 shadow-xl shadow-orange-500/5 p-6 space-y-4 relative group transition-all hover:border-orange-100">
            <div className="flex gap-3">
               <div className="w-11 h-11 rounded-xl bg-orange-100 shrink-0 overflow-hidden border-2 border-white shadow-md flex items-center justify-center text-orange-600 text-lg font-black">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'N'
                  )}
               </div>
               <div className="flex-1 space-y-3">
                 {feeling && (
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full text-[10px] font-black text-orange-600 animate-in fade-in slide-in-from-left-4 border border-orange-100">
                     {feeling.emoji} Đang cảm thấy {feeling.text}
                     <button onClick={() => setFeeling(null)} className="ml-1 w-4 h-4 bg-orange-200 text-orange-600 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">×</button>
                   </div>
                 )}
                 <textarea 
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   placeholder="Bạn đang học gì thế? Chia sẻ cùng mọi người nhé..."
                   className="w-full h-24 bg-[#FFF9F5] border-none rounded-2xl p-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:ring-4 focus:ring-orange-500/10 resize-none transition-all shadow-inner"
                 />
               </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedImages.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-4 border-white bg-orange-50/20 group/img animate-in zoom-in-95 duration-300 shadow-sm">
                    <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      onClick={() => {
                         setSelectedImages(prev => prev.filter(item => item.id !== img.id));
                         URL.revokeObjectURL(img.preview);
                      }}
                      className="absolute top-2 right-2 w-10 h-10 bg-black/50 hover:bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all z-20 shadow-xl backdrop-blur-md border-2 border-white/20"
                    >
                      <span className="text-xl font-black">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-orange-50/50">
               <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input type="file" multiple ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none h-10 px-4 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black border-2 border-transparent hover:border-orange-100 shadow-sm active:scale-95"
                  >
                     <ImageIcon size={16} /> Ảnh đẹp
                  </button>
                  <div className="relative flex-1 sm:flex-none">
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`w-full h-10 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black border-2 active:scale-95 shadow-sm ${
                        showEmojiPicker ? 'bg-orange-500 text-white border-orange-500' : 'text-orange-400 hover:text-orange-600 hover:bg-orange-50 border-transparent hover:border-orange-100'
                      }`}
                    >
                       <Smile size={16} /> Cảm xúc
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-2xl shadow-2xl border border-orange-50 z-50 grid grid-cols-3 gap-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                         {feelings.map(f => (
                           <button 
                             key={f.text}
                             onClick={() => { setFeeling(f); setShowEmojiPicker(false); }}
                             className="flex flex-col items-center gap-1.5 p-2 hover:bg-orange-50 rounded-xl transition-all group/f"
                           >
                             <span className="text-xl group-hover/f:scale-125 transition-transform">{f.emoji}</span>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{f.text}</span>
                           </button>
                         ))}
                      </div>
                    )}
                  </div>
               </div>
                <Button 
                  onClick={handleCreatePost}
                  disabled={isSubmitting || (!newPostContent.trim() && selectedImages.length === 0)}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-xs"
                >
                   {isSubmitting ? (
                     <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : 'Đăng bài'} <Send size={16} />
                </Button>
            </div>
         </div>

         {/* Post List */}
         <div className="space-y-10">
           {isLoading ? (
              [1, 2, 3].map(i => (
                 <div key={i} className="bg-white rounded-[3rem] p-10 space-y-6 animate-pulse border-4 border-white shadow-xl shadow-orange-500/5">
                    <div className="flex gap-4">
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl" />
                       <div className="space-y-2 py-2">
                          <div className="h-4 w-40 bg-gray-50 rounded-lg" />
                          <div className="h-2 w-24 bg-gray-50 rounded-lg" />
                       </div>
                    </div>
                    <div className="h-32 bg-gray-50 rounded-3xl" />
                 </div>
              ))
           ) : posts.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-[4rem] border-4 border-orange-50 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -mr-16 -mt-16" />
                 <div className="w-24 h-24 bg-[#FFF9F5] rounded-[2.5rem] flex items-center justify-center text-orange-200 mx-auto mb-8 border-4 border-white shadow-inner">
                     <Plus size={48} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900">Trống trơn quá bạn ơi!</h3>
                 <p className="text-gray-400 font-bold max-w-xs mx-auto mt-4">Hãy mở bát bài viết đầu tiên để nhận ngay huy hiệu Nebula nhé! ✨</p>
              </div>
           ) : (
             posts.map(post => (
               <div key={post.id} className="bg-white rounded-[2.5rem] border-4 border-white hover:border-orange-50 shadow-xl shadow-orange-500/5 transition-all group relative overflow-hidden">
                  {/* Card Glow */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-orange-50 shadow-sm shrink-0">
                              {post.author_avatar ? <img src={post.author_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-black text-lg">{post.author_name.charAt(0)}</div>}
                           </div>
                           <div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                 <h4 className="font-black text-gray-900 text-sm leading-none pr-1 tracking-tight">{post.author_name}</h4>
                                 {post.feeling && (
                                   <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[8px] font-black rounded-full border border-orange-100 shadow-sm flex items-center gap-1">
                                     {post.feeling.icon} {post.feeling.label}
                                   </span>
                                 )}
                              </div>
                              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                <Sparkles size={10} className="text-orange-200" /> {formatTimeAgo(post.created_at)}
                              </p>
                           </div>
                        </div>
                        <div className="relative">
                           <button 
                             onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                             className="p-2 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:rotate-90 active:scale-95"
                           >
                              <MoreHorizontal size={18} />
                           </button>
                           
                           {openMenuId === post.id && (
                             <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-orange-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button 
                                  onClick={() => handleCopyLink(post.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 hover:bg-orange-50 transition-colors font-black tracking-tight"
                                >
                                   <Copy size={16} className="text-orange-400" /> Sao chép link
                                </button>
                                {post.author_id === user?.id && (
                                  <button 
                                    onClick={() => handleDeletePost(post.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-black tracking-tight"
                                  >
                                     <Trash2 size={16} /> Xóa bài viết
                                  </button>
                                )}
                             </div>
                           )}
                        </div>
                     </div>

                     {/* Content */}
                     <p className="text-gray-700 font-bold leading-relaxed text-sm tracking-tight px-0.5">
                        {post.content}
                     </p>

                     {/* Media Grid */}
                     {post.media_urls && post.media_urls.length > 0 && (
                       <div className={`mt-2 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg grid gap-2 ${post.media_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                         {post.media_urls.slice(0, 4).map((url, idx) => (
                            <div key={idx} className={`relative group/media overflow-hidden ${post.media_urls.length > 1 ? 'aspect-square' : ''}`}>
                              <img 
                                src={url} 
                                className="w-full h-full object-cover cursor-zoom-in group-hover/media:scale-110 transition-transform duration-700" 
                                alt="Post media" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
                              {idx === 3 && post.media_urls.length > 4 && (
                                <div className="absolute inset-0 bg-orange-600/80 backdrop-blur-sm flex items-center justify-center text-white font-black text-2xl">
                                  +{post.media_urls.length - 4}
                                </div>
                              )}
                            </div>
                         ))}
                       </div>
                     )}

                     {/* Actions */}
                     <div className="pt-4 flex items-center gap-3 border-t-2 border-orange-50/50">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 h-9 px-4 rounded-xl font-black text-xs transition-all active:scale-95 ${post.is_liked ? 'bg-rose-50 text-rose-500 shadow-inner' : 'bg-[#FFF9F5] text-gray-400 hover:bg-rose-50 hover:text-rose-500'}`}
                        >
                           <Heart size={16} fill={post.is_liked ? 'currentColor' : 'none'} className={post.is_liked ? 'scale-110 animate-heart' : ''} />
                           {post.like_count}
                        </button>
                        <button 
                          onClick={() => handleFetchComments(post.id)}
                          className={`flex items-center gap-2 h-9 px-4 rounded-xl font-black text-xs transition-all active:scale-95 ${showCommentsFor === post.id ? 'bg-orange-50 text-orange-600 shadow-inner' : 'bg-[#FFF9F5] text-gray-400 hover:bg-orange-50 hover:text-orange-600'}`}
                        >
                           <MessageCircle size={16} />
                           {post.comment_count}
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#FFF9F5] text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all ml-auto active:scale-95">
                           <Share2 size={16} />
                        </button>
                     </div>

                     {/* Comments Section */}
                     {showCommentsFor === post.id && (
                       <div className="mt-6 pt-6 border-t-2 border-orange-50/50 space-y-6 animate-in slide-in-from-top-4 duration-500">
                         <div className="space-y-4">
                           {comments.map(comment => (
                             <div key={comment.id} className="flex gap-3 group/comment">
                               <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                 {comment.author_avatar ? <img src={comment.author_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-50 flex items-center justify-center text-[10px] font-black text-orange-400">{comment.author_name.charAt(0)}</div>}
                               </div>
                               <div className="flex-1 space-y-1.5">
                                 <div className="bg-[#FFF9F5] rounded-[1.2rem] p-3.5 border-2 border-orange-50 shadow-sm group-hover/comment:border-orange-100 transition-all">
                                    <div className="flex items-center justify-between mb-1">
                                      <h5 className="text-[11px] font-black text-gray-900 pr-2">{comment.author_name}</h5>
                                      <span className="text-[8px] text-gray-400 font-black tracking-widest uppercase">{formatTimeAgo(comment.created_at)}</span>
                                    </div>
                                    <p className="text-gray-600 font-bold text-xs leading-relaxed">{comment.content}</p>
                                 </div>
                               </div>
                             </div>
                           ))}
                           {comments.length === 0 && (
                             <div className="py-4 text-center">
                               <p className="text-[10px] font-black text-gray-300 italic flex items-center justify-center gap-2">
                                 <Sparkles size={12} className="text-orange-200" /> Chưa có bình luận nào ✨
                               </p>
                             </div>
                           )}
                         </div>

                         <div className="flex gap-3 pt-3 border-t border-orange-50/30">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 shrink-0 flex items-center justify-center text-orange-500 font-black text-xs overflow-hidden border-2 border-white shadow-sm">
                               {user?.avatar_url ? (
                                 <img src={user.avatar_url} className="w-full h-full object-cover" />
                               ) : (
                                 user?.full_name?.charAt(0) || 'N'
                               )}
                            </div>
                            <div className="flex-1 relative">
                               <input 
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                 placeholder="Gửi bình luận..."
                                 className="w-full h-10 bg-[#FFF9F5] border-2 border-orange-50 rounded-xl px-4 pr-10 text-[11px] font-bold text-gray-700 focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all"
                               />
                               <button 
                                 onClick={() => handleAddComment(post.id)}
                                 disabled={isCommenting || !newComment.trim()}
                                 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 disabled:text-gray-300 transition-all hover:scale-110"
                               >
                                 <Send size={16} />
                               </button>
                            </div>
                         </div>
                       </div>
                     )}
                  </div>
               </div>
             ))
           )}
         </div>
        </div>
      </div>

      <CuteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePost}
        title="Xác nhận xóa bài"
        description="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        type="confirm"
      />

      <style jsx>{`
        @keyframes heart-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-heart {
          animation: heart-pulse 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </>
  );
}
