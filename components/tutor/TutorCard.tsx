'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, GraduationCap, Video, CheckCircle2, DollarSign, ArrowRight } from 'lucide-react';

interface TutorCardProps {
  tutor: any;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Link 
      href={`/learn/tutor/${tutor.id}`}
      className="group relative flex flex-col bg-white border-2 border-orange-50 rounded-[2.5rem] p-8 transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-orange-100 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Avatar & Verification */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="w-20 h-20 rounded-[1.75rem] bg-orange-100 p-1 border-4 border-white shadow-lg overflow-hidden shrink-0 group-hover:rotate-3 transition-transform">
          {tutor.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tutor.avatar_url} alt={tutor.full_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-orange-400">
               {tutor.full_name?.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-black shadow-sm">
             <Star size={14} className="fill-current" />
             {Number(tutor.rating_avg || 5).toFixed(1)}
           </div>
           {tutor.is_verified && (
             <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
               <CheckCircle2 size={12} strokeWidth={3} /> Verified
             </div>
           )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="relative z-10 flex-1">
        <h3 className="text-xl font-black text-gray-950 mb-2 group-hover:text-orange-600 transition-colors leading-tight tracking-tight">
          {tutor.full_name}
        </h3>
        <p className="text-sm text-gray-400 font-bold mb-6 line-clamp-1">{tutor.education}</p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {tutor.subjects?.slice(0, 3).map((s: string, i: number) => (
             <span key={i} className="px-3 py-1 bg-white border border-orange-100 text-[10px] font-black text-orange-500 uppercase tracking-widest rounded-lg">
                {s}
             </span>
          ))}
          {tutor.subjects?.length > 3 && (
            <span className="text-[10px] text-gray-300 font-bold self-center">+{tutor.subjects.length - 3}</span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-auto pt-6 border-t border-orange-50/50 flex items-center justify-between group-hover:border-orange-200 transition-colors">
        <div>
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Học phí / giờ</p>
           <p className="text-lg font-black text-gray-900 flex items-baseline gap-1">
             {new Intl.NumberFormat('vi-VN').format(tutor.hourly_rate_vnd || 0)}
             <span className="text-[10px] font-black text-gray-400 font-serif">đ</span>
           </p>
        </div>
        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
           <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
