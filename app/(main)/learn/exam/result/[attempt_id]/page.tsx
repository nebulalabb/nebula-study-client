'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { ArrowLeft, CheckCircle2, XCircle, Target, Award, Clock, Sparkles, ChevronLeft, Rocket, Brain, BarChart3 } from 'lucide-react';

export default function ExamResultPage() {
  const { attempt_id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/exam/attempt/' + attempt_id + '/result')
      .then(res => setData(res.data.data))
      .catch(err => alert('Không tải được kết quả: ' + err.message))
      .finally(() => setIsLoading(false));
  }, [attempt_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="font-black text-orange-500 uppercase tracking-widest text-[10px]">Đang phân tích kết quả...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-20 text-center text-rose-500 font-bold bg-[#FFF9F5] min-h-screen">Úi, có lỗi dữ liệu rùi!</div>;

  const { attempt, details } = data;
  const analysis = attempt.analysis || {};

  const radarData = Object.keys(analysis).map(topic => {
     const stat = analysis[topic];
     const percent = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
     return {
       topic: topic,
       'Độ chuẩn xác (%)': Math.round(percent),
       fullMark: 100,
     };
  });

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-10">
        
        <div className="flex justify-between items-center px-2">
          <Link href="/learn/exam" className="group inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-orange-500 transition-all uppercase tracking-widest">
            <div className="p-2 bg-white rounded-xl border border-gray-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
              <ChevronLeft size={18} />
            </div>
            Về kho đề
          </Link>
          <div className="px-5 py-2 bg-orange-100/50 border border-orange-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 shadow-sm">
            Phân tích năng lực Nebula
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Điểm số & Tổng quan (Trái) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border-2 border-orange-50 p-10 rounded-[3rem] shadow-2xl shadow-orange-500/5 text-center relative overflow-hidden group">
               
               {/* Background blob */}
               <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150 ${attempt.passed ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />

               <h2 className="text-2xl font-black mb-2 tracking-tight text-gray-800 relative">{attempt.exam_title}</h2>
               <p className="text-gray-400 font-bold text-xs mb-10 relative uppercase tracking-widest">Môn: <span className="text-orange-500">{attempt.subject}</span></p>

               <div className="relative group/score">
                  <svg viewBox="0 0 36 36" className="w-48 h-48 mx-auto transform -rotate-90">
                    <path className="text-gray-50 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`stroke-current shadow-xl transition-all duration-1000 ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={Math.round(attempt.percentage) + ", 100"} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-gray-900 tracking-tighter">{Math.round(attempt.percentage)}<span className="text-2xl opacity-30">%</span></span>
                  </div>
               </div>

               <div className="mt-10 flex justify-center gap-4">
                   <div className="bg-gray-50/50 px-5 py-4 rounded-[1.5rem] text-left border border-gray-100/50 flex flex-col gap-1 shadow-inner">
                      <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest flex items-center gap-1"><Target size={12}/> Điểm số</p>
                      <p className="font-black text-xl text-gray-800 uppercase tracking-tight">{attempt.score} <span className="text-xs font-bold text-gray-300">/ {attempt.max_score}</span></p>
                   </div>
                   <div className="bg-gray-50/50 px-5 py-4 rounded-[1.5rem] text-left border border-gray-100/50 flex flex-col gap-1 shadow-inner">
                      <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Thời gian</p>
                      <p className="font-black text-xl text-gray-800 uppercase tracking-tight">{Math.floor(attempt.time_spent_sec / 60)} <span className="text-xs font-bold text-gray-300">phút</span></p>
                   </div>
               </div>

               {attempt.passed ? (
                 <div className="mt-8 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 border-2 border-emerald-100 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/10 animate-in zoom-in-95 duration-500">
                   <Rocket size={20} className="animate-bounce" /> XUẤT SẮC - ĐẠT TIÊU CHUẨN
                 </div>
               ) : (
                 <div className="mt-8 flex items-center justify-center gap-2 text-rose-500 bg-rose-50 border-2 border-rose-100 py-4 rounded-2xl font-black shadow-lg shadow-rose-500/10 animate-in zoom-in-95 duration-500">
                   <Brain size={20} className="animate-pulse" /> HMM, CẦN CỐ GẮNG HƠN NHA!
                 </div>
               )}
            </div>

            <div className="bg-white border-2 border-orange-50 p-10 rounded-[3rem] shadow-xl shadow-orange-500/5">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
                    <BarChart3 size={20} />
                 </div>
                 <h3 className="font-black text-gray-800 tracking-tight">Biểu đồ thế mạnh</h3>
               </div>
               
               <div className="h-64 -ml-4 relative">
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#fef3c7" strokeWidth={2} />
                        <PolarAngleAxis dataKey="topic" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar 
                          name="Độ chuẩn xác" 
                          dataKey="Độ chuẩn xác (%)" 
                          stroke="#f97316" 
                          strokeWidth={3}
                          fill="#f97316" 
                          fillOpacity={0.4} 
                        />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.2)', padding: '12px 16px', fontWeight: 'bold' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-black text-gray-300 uppercase tracking-widest italic">Không đủ dữ liệu phân tích</div>
                  )}
               </div>
               <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-wider">Dựa trên kết quả thực tế của bạn ✨</p>
            </div>
          </div>

          {/* Giải thích chi tiết (Phải) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border-2 border-orange-50 p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-orange-500/5">
               <h3 className="text-3xl font-black mb-10 tracking-tighter text-gray-900 border-b-4 border-orange-100 w-fit pb-2">Chi tiết từng câu</h3>
               <div className="space-y-10">
                 {details.map((item: any, idx: number) => {
                   const isCorrect = item.is_correct;
                   return (
                     <div key={item.question_id} className={`group p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
                       isCorrect 
                        ? 'border-emerald-50 bg-emerald-50/20 shadow-xl shadow-emerald-500/5' 
                        : 'border-rose-50 bg-rose-50/20 shadow-xl shadow-rose-500/5'
                     }`}>
                       {/* Correct/Wrong indicator side tag */}
                       <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${isCorrect ? 'bg-emerald-400' : 'bg-rose-400 font-black'}`}>
                         {isCorrect ? 'Điểm tuyệt đối 🎯' : 'Sai rồi hic 😭'}
                       </div>

                       <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
                         <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl text-white font-black text-lg shadow-xl ${isCorrect ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                           {idx + 1}
                         </div>
                         <div className="flex-1 min-w-0 pr-4">
                           <div className="mb-3 flex flex-wrap items-center gap-3">
                             <span className="px-3 py-1 bg-white border border-gray-100 text-[10px] font-black uppercase text-gray-400 rounded-lg tracking-widest shadow-sm">
                                {item.topic_tag || 'Kiến thức chung'}
                             </span>
                           </div>
                           <div className="prose prose-lg max-w-none text-gray-800 font-bold leading-relaxed">
                             <MarkdownContent className="text-sm font-medium pr-4">{item.question_text}</MarkdownContent>
                           </div>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:pl-16">
                         {item.options?.map((opt: any) => {
                           const isSelected = (item.selected_answers || []).includes(opt.id);
                           const isActualCorrect = (item.correct_answers || []).includes(opt.id);
                           
                           let statusStyle = 'border-white/50 bg-white/50 text-gray-400 opacity-60';
                           if (isActualCorrect) {
                             statusStyle = 'border-emerald-500 bg-white text-emerald-800 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20';
                           } else if (isSelected && !isActualCorrect) {
                             statusStyle = 'border-rose-400 bg-white text-rose-700 opacity-100 shadow-xl shadow-rose-500/10';
                           }

                           return (
                             <div key={opt.id} className={`p-4 rounded-2xl border-2 text-sm font-black transition-all flex items-center gap-3 tracking-tight ${statusStyle}`}>
                                <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ${isActualCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-200 bg-transparent'}`}>
                                   {isActualCorrect ? <CheckCircle2 size={12} strokeWidth={3} /> : isSelected ? <XCircle size={12} strokeWidth={3} /> : null}
                                </div>
                                <div className="flex-1">
                                  <MarkdownContent className="pr-4">{opt.text}</MarkdownContent>
                                </div>
                             </div>
                           );
                         })}
                       </div>

                       {item.explanation && (
                         <div className="mt-6 p-6 md:p-8 bg-white/80 rounded-[2.5rem] border-2 border-orange-50/50 shadow-inner group/exp relative">
                            <div className="absolute top-4 right-6 text-orange-100 opacity-50 group-hover/exp:opacity-100 transition-opacity">
                               <Sparkles size={28} />
                            </div>
                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                               <Sparkles size={12} /> Nebula Giải thích
                            </p>
                            <div className="prose prose-sm max-w-none text-gray-600 font-bold leading-[1.8]">
                              <MarkdownContent>{item.explanation}</MarkdownContent>
                            </div>
                         </div>
                       )}
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
