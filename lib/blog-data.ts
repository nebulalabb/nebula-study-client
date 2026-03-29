export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: '5-meo-hoc-tap-cung-ai-hieu-qua',
    title: '5 Mẹo Học Tập Cùng AI Siêu Hiệu Quả Cho Học Sinh Việt',
    excerpt: 'Khám phá cách tận dụng sức mạnh của trí tuệ nhân tạo để bứt phá điểm số trong kỳ thi sắp tới.',
    content: `
# 5 Mẹo Học Tập Cùng AI Siêu Hiệu Quả

Trí tuệ nhân tạo (AI) đang thay đổi hoàn toàn cách chúng ta tiếp cận kiến thức. Thay vì mất hàng giờ để loay hoay với một bài toán khó, bạn có thể biến AI thành người bạn đồng hành đắc lực. Dưới đây là 5 mẹo giúp bạn học tập tốt hơn cùng NebulaStudy AI:

## 1. Sử dụng AI để giải thích các khái niệm phức tạp
Đôi khi sách giáo khoa viết quá hàn lâm. Hãy thử yêu cầu AI: "Giải thích định luật bảo toàn năng lượng cho học sinh lớp 8". Bạn sẽ nhận được câu trả lời cực kỳ dễ hiểu với nhiều ví dụ thực tế.

## 2. Tạo Flashcard tự động
Đừng tốn thời gian ngồi viết từng tấm thẻ. Hãy dán nội dung bài học vào công cụ Flashcard của NebulaStudy, AI sẽ tự động trích xuất các ý quan trọng nhất để bạn ôn tập.

## 3. Luyện đề và phân tích lỗi sai
Hãy thử làm các bài test trên hệ thống. AI không chỉ chấm điểm mà còn chỉ ra vì sao bạn sai và gợi ý tài liệu để bạn bù đắp lỗ hổng kiến thức đó.

## 4. Tóm tắt tài liệu dài
Nếu bạn có một bài văn hay một chương lịch sử quá dài, hãy dùng tính năng tóm tắt của AI. Bạn sẽ nắm được "xương sống" của bài học chỉ trong vài giây.

## 5. Lên lộ trình học tập cá nhân hóa
Yêu cầu AI lập kế hoạch ôn thi trong 2 tuần dựa trên những môn bạn còn yếu. Một kế hoạch cụ thể sẽ giúp bạn bớt áp lực hơn rất nhiều.

Chúc các bạn có những trải nghiệm học tập thật thú vị cùng NebulaStudy!
    `,
    author: 'Admin Nebula',
    date: '2026-03-28',
    category: 'Mẹo học tập',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000'
  },
  {
    slug: 'cach-hoc-thuoc-nhanh-voi-flashcards',
    title: 'Cách Học Thuộc Nhanh Vĩnh Viễn Với Phương Pháp Flashcard',
    excerpt: 'Bạn thường xuyên quên kiến thức sau 1 ngày? Phương pháp Spaced Repetition kết hợp Flashcard sẽ giúp bạn ghi nhớ suốt đời.',
    content: `
# Cách Học Thuộc Nhanh Vĩnh Viễn

Nhiều học sinh thường gặp tình trạng "học trước quên sau". Làm thế nào để kiến thức in sâu vào trí não? Câu trả lời chính là **Phương pháp Spaced Repetition (Lặp lại ngắt quãng)**.

## Tại sao Flashcard lại hiệu quả?
Flashcard ép não bộ phải thực hiện quá trình "Active Recall" - chủ động truy xuất thông tin thay vì chỉ đọc đi đọc lại một cách thụ động.

## Các bước học với Flashcard trên NebulaStudy:
1. **Chia nhỏ kiến thức**: Mỗi thẻ chỉ nên chứa một khái niệm hoặc một câu hỏi duy nhất.
2. **Sử dụng hình ảnh**: Não bộ xử lý hình ảnh nhanh hơn chữ viết 60.000 lần.
3. **Ôn tập theo định kỳ**: Hệ thống của chúng tôi sẽ tự động nhắc nhở bạn ôn tập vào "thời điểm vàng" - ngay trước khi bạn sắp quên.

Hãy thử áp dụng ngay hôm nay để thấy sự khác biệt trong kết quả học tập của mình nhé!
    `,
    author: 'Đội ngũ Nebula',
    date: '2026-03-25',
    category: 'Phương pháp',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000'
  }
];
