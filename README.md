# 🎓 HỌC CÙNG NHAU (hoccungnhau) - TÀI LIỆU HƯỚNG DẪN PROJECT

## 📁 1. CẤU TRÚC MÃ NGUỒN

- `index.html`: Khung giao diện chính (Header, Main, Footer, Modals)
- `css/variables.css`: Biến màu sắc Gradient tím & Dark/Light mode
- `css/main.css`: Header navbar, Dropdown đa cấp, Footer
- `css/components.css`: Hero section, Quiz UI, Modals, Cards
- `css/responsive.css`: Media Queries Responsive
- `js/config-service.js`: Vị trí dán mã Firebase Console Config
- `js/theme.js`: Chuyển đổi Dark/Light mode
- `js/auth.js`: Đăng ký, Đăng nhập, Google & Facebook Auth
- `js/notes.js`: Sổ ghi chú cá nhân trên Header (Tự động lưu LocalStorage)
- `js/quiz.js`: Engine làm bài tập 20 câu trắc nghiệm (Chấm điểm & Giải thích)
- `js/data-highschool.js`: Dữ liệu Lớp 10, 11, 12 & Ôn thi THPTQG (Đầy đủ 20 câu Quiz/môn)
- `js/data-university.js`: Dữ liệu Đại học Kỹ thuật (Đại số tuyến tính, Toán rời rạc, Lập trình...)
- `js/news-data.js`: Dữ liệu bài báo giáo dục & Tin tức chạy nổi bật
- `js/app.js`: Điều hướng chính & Render giao diện

---

## 🔥 2. HƯỚNG DẪN CHÈN FIREBASE CONFIG

Mở file `js/config-service.js`, tìm đối tượng `FIREBASE_CONFIG` và dán cấu hình từ Google Firebase Console vào:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "INSERT_YOUR_FIREBASE_API_KEY_HERE",
    authDomain: "INSERT_YOUR_FIREBASE_AUTH_DOMAIN_HERE",
    projectId: "INSERT_YOUR_FIREBASE_PROJECT_ID_HERE",
    storageBucket: "INSERT_YOUR_FIREBASE_STORAGE_BUCKET_HERE",
    messagingSenderId: "INSERT_YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE",
    appId: "INSERT_YOUR_FIREBASE_APP_ID_HERE"
};
```

---

## 📹 3. HƯỚNG DẪN CHÈN LINK VIDEO & ĐỀ THI PDF

Trong file `js/data-highschool.js` và `js/data-university.js`:
- Video: Thay `"INSERT_YOUTUBE_EMBED_LINK_HERE"` bằng link embed YouTube.
- Tài liệu / Đề thi PDF: Thay `"INSERT_DOCUMENT_URL_HERE"` hoặc `"INSERT_EXAM_PDF_LINK_HERE"` bằng link file PDF Drive.
