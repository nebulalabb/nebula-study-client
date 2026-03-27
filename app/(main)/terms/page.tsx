import React from 'react';
import { Sparkles, Star, Rocket, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col selection:bg-orange-200 overflow-hidden relative pb-20">
      {/* CUTE DECORATIONS */}
      <div className="absolute top-20 left-10 text-orange-300 opacity-50 animate-bounce">
        <Sparkles size={48} />
      </div>
      <div className="absolute top-40 right-20 text-yellow-300 opacity-60 animate-pulse">
        <Star size={56} fill="currentColor" />
      </div>
      <div className="absolute bottom-40 left-20 text-rose-300 opacity-40">
        <Rocket size={40} className="rotate-45" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 w-full relative z-10">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-orange-200 text-orange-600 font-bold shadow-[0_4px_0_0_rgba(254,215,170,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-default">
            <span className="text-xl">📜</span>
            Cập nhật lần cuối: 27/03/2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-800 drop-shadow-sm">
            Điều Khoản <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Sử Dụng</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Quy định khi tham gia thế giới học tập NebulaStudy. Đọc kỹ để chúng mình cùng học vui nhé! ✨
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-orange-500/5 border-2 border-orange-100 max-w-none text-gray-600 font-medium leading-loose space-y-8">
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-100 text-orange-500"><FileText size={20} /></span> 
              1. Chào mừng bạn đến với NebulaStudy
            </h2>
            <p className="text-lg">
              Bằng việc đăng ký tài khoản và sử dụng nền tảng học tập NebulaStudy, bạn đồng ý tuân thủ các quy định và điều khoản dưới đây. Hãy xem đây là một bản giao kèo giúp môi trường học tập luôn an toàn và hiệu quả nhé!
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-rose-100 text-rose-500"><FileText size={20} /></span> 
              2. Tài khoản của bạn
            </h2>
            <p className="text-lg">
              Thông tin đăng nhập là chìa khóa bí mật của riêng bạn. Hãy giữ gìn cẩn thận, đừng chia sẻ cho người lạ. Mọi hoạt động học tập, làm bài, tích điểm trên tài khoản này đều thuộc quyền sở hữu của bạn.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-100 text-amber-500"><FileText size={20} /></span> 
              3. Bản quyền nội dung
            </h2>
            <p className="text-lg">
              Các tài liệu, đề thi, flashcard do AI sinh ra hoặc do thầy cô biên soạn trên hệ thống đều thuộc tài sản trí tuệ. Bạn có thể sử dụng thoải mái để học tập cá nhân, nhưng tuyệt đối đừng sao chép đi nơi khác để kinh doanh nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
