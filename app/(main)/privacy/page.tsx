import React from 'react';
import { Sparkles, Star, ShieldCheck, Heart } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col selection:bg-orange-200 overflow-hidden relative pb-20">
      {/* CUTE DECORATIONS */}
      <div className="absolute top-20 right-10 text-rose-300 opacity-50 animate-bounce">
        <Heart size={48} />
      </div>
      <div className="absolute top-60 left-20 text-yellow-300 opacity-60 animate-pulse">
        <Star size={56} fill="currentColor" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 w-full relative z-10">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-orange-200 text-orange-600 font-bold shadow-[0_4px_0_0_rgba(254,215,170,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-default">
            <span className="text-xl">🔐</span>
            An toàn tuyệt đối
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-800 drop-shadow-sm">
            Chính Sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Bảo Mật</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Dữ liệu của bạn được bảo vệ như kho báu! NebulaStudy cam kết luôn tôn trọng quyền riêng tư của mọi học viên. 🛡️
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-orange-500/5 border-2 border-orange-100 max-w-none text-gray-600 font-medium leading-loose space-y-8">
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-100 text-orange-500"><ShieldCheck size={20} /></span> 
              1. Thông tin chúng mình thu thập
            </h2>
            <p className="text-lg">
              Khi bạn đăng ký, chúng mình chỉ lưu lại các thông tin cơ bản: Tên, Email, và lịch sử học tập. Đừng lo, các thông tin này giúp AI phân tích điểm yếu để gợi ý bài học phù hợp nhất cho bạn.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-500"><ShieldCheck size={20} /></span> 
              2. Không bán dữ liệu
            </h2>
            <p className="text-lg">
              NebulaStudy thề có bóng đèn là sẽ không bao giờ bán thông tin cá nhân của bạn cho bên thứ ba. Dữ liệu của bạn chỉ nằm gọn trong túi ảo thuật của NebulaStudy để phục vụ riêng cho hành trình học tập của bạn.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-100 text-sky-500"><ShieldCheck size={20} /></span> 
              3. Quyền lợi của bạn
            </h2>
            <p className="text-lg">
              Bạn luôn có toàn quyền kiểm soát tài khoản của mình. Bạn có thể thay đổi thông tin, tải xuống dữ liệu học tập cá nhân, hoặc xóa tài khoản vĩnh viễn hệ thống bất cứ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
