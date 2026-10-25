/* ==========================================================================
   HỌC CÙNG NHAU - AI TUTOR CHATBOT WIDGET
   ========================================================================== */

const AITutor = {
    isOpen: false,
    
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        const toggleBtn = document.getElementById('ai-widget-toggle-btn') || document.getElementById('ai-tutor-toggle');
        const closeBtn = document.getElementById('ai-chat-close-btn') || document.getElementById('ai-chat-close');
        const windowEl = document.getElementById('ai-chat-window') || document.getElementById('ai-tutor-window');
        const formEl = document.getElementById('ai-chat-form');
        const sendBtn = document.getElementById('ai-chat-send');
        const inputEl = document.getElementById('ai-input-field') || document.getElementById('ai-chat-input');
        
        if (toggleBtn && windowEl) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isOpen = !this.isOpen;
                windowEl.classList.toggle('active', this.isOpen);
            });
        }
        
        if (closeBtn && windowEl) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isOpen = false;
                windowEl.classList.remove('active');
            });
        }
        
        if (formEl) {
            formEl.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = inputEl ? inputEl.value.trim() : '';
                if (text) {
                    if (inputEl) inputEl.value = '';
                    this.sendQuery(text);
                }
            });
        } else if (sendBtn && inputEl) {
            sendBtn.addEventListener('click', () => {
                const text = inputEl.value.trim();
                if (text) {
                    inputEl.value = '';
                    this.sendQuery(text);
                }
            });
            inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = inputEl.value.trim();
                    if (text) {
                        inputEl.value = '';
                        this.sendQuery(text);
                    }
                }
            });
        }
    },
    
    sendQuickQuery: function(text) {
        const windowEl = document.getElementById('ai-chat-window') || document.getElementById('ai-tutor-window');
        if (windowEl && !this.isOpen) {
            this.isOpen = true;
            windowEl.classList.add('active');
        }
        this.sendQuery(text);
    },
    
    sendQuery: function(text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;
        
        // Append User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-msg ai-user';
        userMsg.style.alignSelf = 'flex-end';
        userMsg.textContent = text;
        container.appendChild(userMsg);
        
        // Append Typing Indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'ai-msg ai-bot typing';
        typingMsg.innerHTML = '🤖 AI đang suy nghĩ...';
        container.appendChild(typingMsg);
        container.scrollTop = container.scrollHeight;
        
        // Generate AI Bot Response with educational contents
        setTimeout(() => {
            typingMsg.remove();
            const botMsg = document.createElement('div');
            botMsg.className = 'ai-msg ai-bot';
            botMsg.innerHTML = this.generateResponse(text);
            container.appendChild(botMsg);
            container.scrollTop = container.scrollHeight;
        }, 650);
    },
    
    generateResponse: function(q) {
        const query = q.toLowerCase();
        if (query.includes('ma trận') || query.includes('định thức') || query.includes('khả nghịch')) {
            return "📐 <b>Giải đáp Ma Trận & Định Thức (Đại Số Tuyến Tính):</b><br>• Định thức det(A) 3x3 tính bằng quy tắc Sarrus hoặc khai triển theo dòng/cột.<br>• Ma trận vuông A khả nghịch khi và chỉ khi <b>det(A) ≠ 0</b>. Khi đó A⁻¹ = (1/det(A)) × adj(A).";
        } else if (query.includes('c++') || query.includes('con trỏ') || query.includes('pointer') || query.includes('lập trình')) {
            return "💻 <b>Giải đáp Con Trỏ Pointer C++ (Lập Trình Cơ Bản):</b><br>• Biến con trỏ lưu trữ địa chỉ ô nhớ: <code>int *p = &x;</code><br>• Toán tử <code>*p</code> dùng để lấy/gán giá trị tại địa chỉ ô nhớ.<br>• Nhớ kiểm tra <code>if (p != nullptr)</code> trước khi dùng để tránh lỗi Segmentation Fault.";
        } else if (query.includes('đạo hàm') || query.includes('toán') || query.includes('mũ') || query.includes('tích phân')) {
            return "📊 <b>Công Thức Đạo Hàm & Giải Tích (Toán 11 - 12):</b><br>• (x^n)' = n·x^(n-1)<br>• (e^x)' = e^x, (a^x)' = a^x · ln(a)<br>• (ln x)' = 1/x<br>• (sin x)' = cos x, (cos x)' = -sin x";
        } else if (query.includes('anh') || query.includes('tiếng anh') || query.includes('ngữ pháp') || query.includes('thì')) {
            return "🇬🇧 <b>Trọng Tâm Ngữ Pháp Tiếng Anh THPTQG:</b><br>• Quá khứ đơn + Quá khứ tiếp diễn: Hành động đang xảy ra (Past Continuous) thì hành động khác chen vào (Past Simple).<br>• Câu điều kiện loại 2: If + S + V2/ed, S + would/could + V-bare.";
        } else if (query.includes('văn') || query.includes('ngữ văn') || query.includes('thơ')) {
            return "📖 <b>Bí Quyết Ôn Thi Ngữ Văn 10 - 12 & THPTQG:</b><br>• Nắm chắc sơ đồ tư duy tác giả - tác phẩm, hoàn cảnh sáng tác và luận điểm chính.<br>• Bài văn nghị luận xã hội nên có cấu trúc 4 phần: Giải thích ➔ Bàn luận ➔ Chứng minh (dẫn chứng thực tế) ➔ Bài học nhận thức & hành động.";
        } else if (query.includes('lý') || query.includes('vật lý') || query.includes('dao động') || query.includes('sóng')) {
            return "⚡ <b>Vật Lý 10 - 12 & Thi THPTQG:</b><br>• Phương trình dao động điều hòa: x = A·cos(ωt + φ).<br>• Vận tốc v = x' = -ωA·sin(ωt + φ), Gia tốc a = v' = -ω²x.<br>• Tần số góc ω = √(k/m) (con lắc lò xo), ω = √(g/l) (con lắc đơn).";
        } else if (query.includes('hóa') || query.includes('hóa học') || query.includes('ester') || query.includes('phản ứng')) {
            return "🧪 <b>Hóa Học 10 - 12:</b><br>• Ester RCOOR' tạo từ Acid RCOOH + Alcohol R'OH (H₂SO₄ đặc, t°).<br>• Phản ứng xà phòng hóa: RCOOR' + NaOH ➔ RCOONa + R'OH.";
        } else {
            return `💡 <b>Giải đáp cho câu hỏi "${q}":</b><br>Đây là chủ đề kiến thức quan trọng! Bạn có thể chọn mục <b>📚 Lớp Học</b> ở thanh Menu để xem video bài giảng đầy đủ và luyện tập ngay với bộ <b>🎯 Quiz 20 Câu Trắc Nghiệm</b> có đếm giờ và lời giải chi tiết nhé!`;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AITutor.init();
});
