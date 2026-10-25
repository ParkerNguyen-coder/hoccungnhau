/* ==========================================================================
   HỌC CÙNG NHAU - MAIN APP CONTROLLER
   ========================================================================== */

const AppController = {
    init: function() {
        this.renderTicker();
        this.renderHome();
        this.bindNavigation();
        this.bindFeedbackModal();
        this.bindQuestionBankModal();
        this.bindQAModal();
        this.bindGlobalSearchModal();
    },
    
    renderTicker: function() {
        const tickerEl = document.getElementById('news-ticker-content');
        if (tickerEl && typeof TICKER_HEADLINES !== 'undefined') {
            tickerEl.textContent = TICKER_HEADLINES.join("  ---  ");
        }
    },
    
    bindNavigation: function() {
        const logo = document.getElementById('logo-home');
        if (logo) {
            logo.addEventListener('click', () => this.renderHome());
        }
        
        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetEl = e.target.closest('[data-route]');
                if (!targetEl) return;
                
                const route = targetEl.dataset.route;
                const param = targetEl.dataset.param;
                
                if (route === 'home') {
                    this.renderHome();
                } else if (route === 'highschool') {
                    AuthService.requireAuth(() => this.renderHighSchoolGrade(parseInt(param)));
                } else if (route === 'thptqg') {
                    AuthService.requireAuth(() => this.renderTHPTQG());
                } else if (route === 'university') {
                    AuthService.requireAuth(() => this.renderUniversity());
                } else if (route === 'news') {
                    this.renderNewsPage();
                }
            });
        });
    },
    
    bindFeedbackModal: function() {
        const btn = document.getElementById('feedback-btn');
        const modal = document.getElementById('feedback-modal');
        const closeBtn = document.getElementById('feedback-modal-close');
        const form = document.getElementById('feedback-form');
        
        if (btn && modal) {
            btn.addEventListener('click', () => modal.classList.add('active'));
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('❤️ Cảm ơn đóng góp ý kiến của bạn! Chúng tôi sẽ xem xét cải thiện trang web.');
                document.getElementById('feedback-content').value = '';
                modal.classList.remove('active');
            });
        }
    },
    
    bindQuestionBankModal: function() {
        const btn = document.getElementById('question-bank-btn');
        const modal = document.getElementById('question-bank-modal');
        const closeBtn = document.getElementById('question-bank-modal-close');
        
        if (btn && modal) {
            btn.addEventListener('click', () => {
                this.renderQuestionBank('all');
                modal.classList.add('active');
            });
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        
        document.querySelectorAll('.btn-filter').forEach(filterBtn => {
            filterBtn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.bank;
                this.renderQuestionBank(category);
            });
        });
    },
    
    renderQuestionBank: function(category) {
        const container = document.getElementById('question-bank-container');
        if (!container) return;
        
        let list = [];
        
        [10, 11, 12].forEach(g => {
            if (category === 'all' || category === `g${g}`) {
                if (HIGHSCHOOL_DATA[`grade_${g}`]) {
                    HIGHSCHOOL_DATA[`grade_${g}`].forEach(subj => {
                        list.push({
                            title: `${subj.title} (Lớp ${g})`,
                            category: `Phổ Thông - Lớp ${g}`,
                            count: subj.quiz ? subj.quiz.length : 20,
                            quizData: subj.quiz
                        });
                    });
                }
            }
        });
        
        if ((category === 'all' || category === 'thptqg') && HIGHSCHOOL_DATA.thptqg) {
            list.push({
                title: HIGHSCHOOL_DATA.thptqg.title,
                category: "Ôn Thi THPTQG 2026",
                count: HIGHSCHOOL_DATA.thptqg.quiz ? HIGHSCHOOL_DATA.thptqg.quiz.length : 20,
                quizData: HIGHSCHOOL_DATA.thptqg.quiz
            });
        }
        
        if ((category === 'all' || category === 'uni') && typeof UNIVERSITY_DATA !== 'undefined') {
            UNIVERSITY_DATA.forEach(subj => {
                list.push({
                    title: `${subj.title} (Đại Học Kỹ Thuật)`,
                    category: subj.category,
                    count: subj.quiz ? subj.quiz.length : 20,
                    quizData: subj.quiz
                });
            });
        }
        
        container.innerHTML = list.map((item, idx) => `
            <div class="question-bank-card" style="background:var(--bg-input); padding:1.2rem; border-radius:12px; border:1px solid var(--border-color); margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <span style="font-size:0.75rem; color:var(--primary-purple); font-weight:700; text-transform:uppercase;">${item.category}</span>
                    <h4 style="margin:0.2rem 0;">${item.title}</h4>
                    <span style="font-size:0.85rem; color:var(--text-muted);">📋 Bộ đề <strong>${item.count} câu trắc nghiệm</strong> đếm giờ 15:00</span>
                </div>
                <button class="btn-gradient" style="font-size:0.85rem; padding:0.5rem 1.2rem;" onclick="AppController.startBankQuiz(${idx})">
                    Luyện Thi Ngay 🚀
                </button>
            </div>
        `).join('');
        
        this.currentBankList = list;
    },
    
    startBankQuiz: function(idx) {
        if (this.currentBankList && this.currentBankList[idx]) {
            const item = this.currentBankList[idx];
            document.getElementById('question-bank-modal').classList.remove('active');
            AuthService.requireAuth(() => QuizEngine.startQuiz(item.quizData, item.title));
        }
    },
    
    bindQAModal: function() {
        const btn = document.getElementById('qa-btn');
        const modal = document.getElementById('qa-modal');
        const closeBtn = document.getElementById('qa-modal-close');
        const form = document.getElementById('qa-post-form');
        
        if (btn && modal) {
            btn.addEventListener('click', () => {
                this.renderQAThreads();
                modal.classList.add('active');
            });
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const subj = document.getElementById('qa-subject-select').value;
                const title = document.getElementById('qa-title-input').value;
                const content = document.getElementById('qa-content-input').value;
                const author = AuthService.currentUser ? AuthService.currentUser.name : 'Học Viên ẩn danh';
                
                const newThread = {
                    author: author,
                    subject: subj,
                    title: title,
                    content: content,
                    date: "Vừa xong",
                    answers: []
                };
                
                if (!this.qaThreads) this.qaThreads = [];
                this.qaThreads.unshift(newThread);
                this.renderQAThreads();
                
                alert('🚀 Đã đăng câu hỏi của bạn lên diễn đàn!');
                form.reset();
            });
        }
    },
    
    renderQAThreads: function() {
        const container = document.getElementById('qa-threads-list');
        if (!container) return;
        
        if (!this.qaThreads) {
            this.qaThreads = [
                {
                    author: "Trần Minh Hoàng (Lớp 12)",
                    subject: "Toán Lớp 12 & THPTQG",
                    title: "Thắc mắc về cách bấm máy tính giải nhanh Ma trận & Hệ phương trình?",
                    content: "Thầy cô và các bạn cho em hỏi làm sao để tính định thức det(A) nhanh trên máy tính Casio fx-580VN?",
                    date: "10 phút trước",
                    answers: [
                        {
                            responder: "ThS. Nguyễn Văn Đức (Giảng Viên)",
                            text: "Em vào chế độ MODE 4 (Matrix) -> Khởi tạo MatA cấp 3x3 -> Bấm OPTN -> Chọn Determinant (Det) -> Optn MatA -> Equal (=) để xem kết quả ngay nhé!"
                        }
                    ]
                },
                {
                    author: "Lê Thu Hà (Sinh Viên Kỹ Thuật)",
                    subject: "Lập Trình Cơ Bản C++",
                    title: "Lỗi 'Segmentation Fault' khi thao tác với Con Trỏ (Pointer) trong C++",
                    content: "Khi em truyền con trỏ vào hàm mà chưa cấp phát bộ nhớ động bằng `new` thì bị văng chương trình. Cách xử lý chuẩn là gì ạ?",
                    date: "1 giờ trước",
                    answers: [
                        {
                            responder: "Senior Developer (Cố Vấn)",
                            text: "Luôn kiểm tra `if (ptr != nullptr)` trước khi truy xuất giá trị `*ptr`, và nhớ gọi `ptr = new Type()` hoặc dùng Smart Pointer `std::unique_ptr` trong C++11 trở lên em nhé!"
                        }
                    ]
                }
            ];
        }
        
        container.innerHTML = this.qaThreads.map(q => `
            <div class="qa-card" style="background:var(--bg-input); padding:1rem 1.2rem; border-radius:12px; border:1px solid var(--border-color);">
                <div class="qa-header" style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.85rem;">
                    <span>👤 <strong>${q.author}</strong> • <span style="color:var(--primary-purple); font-weight:700;">${q.subject}</span></span>
                    <span style="color:var(--text-muted);">${q.date}</span>
                </div>
                <div class="qa-title" style="font-weight:700; font-size:1rem; margin-bottom:0.3rem;">${q.title}</div>
                <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.8rem;">${q.content}</p>
                
                ${q.answers.map(ans => `
                    <div class="qa-solution-box" style="background:var(--bg-card); padding:0.8rem; border-radius:8px; border-left:3px solid var(--primary-purple); margin-top:0.5rem; font-size:0.88rem;">
                        <div style="font-weight:700; color:var(--primary-purple); margin-bottom:0.2rem;">✅ Lời Giải Từ: ${ans.responder}</div>
                        <div>${ans.text}</div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    },
    
    bindGlobalSearchModal: function() {
        const btn = document.getElementById('global-search-btn');
        const modal = document.getElementById('search-modal');
        const closeBtn = document.getElementById('search-modal-close');
        const input = document.getElementById('global-search-input');
        const container = document.getElementById('search-results-container');
        
        if (btn && modal) {
            btn.addEventListener('click', () => {
                modal.classList.add('active');
                if (input) input.focus();
            });
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        
        if (input) {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                if (!query) {
                    container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.9rem;">💡 Hãy gõ từ khóa bất kỳ để tìm nhanh bài giảng Video, Link tài liệu API hoặc Bộ bài tập trắc nghiệm 20 câu.</div>`;
                    return;
                }
                
                let matches = [];
                
                [10, 11, 12].forEach(g => {
                    if (HIGHSCHOOL_DATA[`grade_${g}`]) {
                        HIGHSCHOOL_DATA[`grade_${g}`].forEach(subj => {
                            if (subj.title.toLowerCase().includes(query) || subj.subject.toLowerCase().includes(query)) {
                                matches.push({
                                    title: `${subj.title} (Lớp ${g})`,
                                    type: "Bài Giảng & 20 Câu Quiz",
                                    action: () => {
                                        modal.classList.remove('active');
                                        AuthService.requireAuth(() => AppController.renderSubjectDetail('highschool', g, subj.id));
                                    }
                                });
                            }
                        });
                    }
                });
                
                if (typeof UNIVERSITY_DATA !== 'undefined') {
                    UNIVERSITY_DATA.forEach(subj => {
                        if (subj.title.toLowerCase().includes(query) || subj.category.toLowerCase().includes(query)) {
                            matches.push({
                                title: `${subj.title} (Đại Học)`,
                                type: "Chuyên Đề Kỹ Thuật & 20 Câu Quiz",
                                action: () => {
                                    modal.classList.remove('active');
                                    AuthService.requireAuth(() => AppController.renderSubjectDetail('university', 0, subj.id));
                                }
                            });
                        }
                    });
                }
                
                if (matches.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-muted);">❌ Không tìm thấy kết quả phù hợp với từ khóa "${query}".</div>`;
                } else {
                    container.innerHTML = matches.map((m, idx) => `
                        <div class="search-card" style="background:var(--bg-input); padding:0.8rem 1.2rem; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <h4 style="margin-bottom:0.2rem;">${m.title}</h4>
                                <span style="font-size:0.8rem; color:var(--primary-purple); font-weight:700;">${m.type}</span>
                            </div>
                            <button class="btn-gradient" style="font-size:0.8rem; padding:0.4rem 1rem;" onclick="AppController.executeSearchClick(${idx})">Xem Ngay →</button>
                        </div>
                    `).join('');
                    
                    this.currentMatches = matches;
                }
            });
        }
    },
    
    executeSearchClick: function(idx) {
        if (this.currentMatches && this.currentMatches[idx]) {
            this.currentMatches[idx].action();
        }
    },
    
    renderHome: function() {
        const main = document.getElementById('main-app-content');
        if (!main) return;
        
        main.innerHTML = `
            <!-- HERO BANNER -->
            <section class="hero-section">
                <h1 class="hero-title">Học Cùng Nhau - Nền Tảng Học Tập Thông Minh</h1>
                <p class="hero-desc">Hệ thống bài giảng video chất lượng cao, tài liệu tham khảo phong phú và bộ bài tập củng cố trắc nghiệm 20 câu dành cho khối Phổ Thông (Lớp 10, 11, 12) và Đại Học Kỹ Thuật.</p>
                <div class="news-roll-ticker">
                    <span class="ticker-badge">🔥 TIN NỔI BẬT</span>
                    <div class="ticker-text" id="news-ticker-content">
                        ${typeof TICKER_HEADLINES !== 'undefined' ? TICKER_HEADLINES.join("  ---  ") : ''}
                    </div>
                </div>
            </section>
            
            <!-- TIN TỨC & BÀI BÁO GIÁO DỤC -->
            <h2 class="section-title">📰 Bài Báo & Thông Tin Giáo Dục Mới Nhất</h2>
            <div class="card-grid">
                ${NEWS_DATA.map(n => `
                    <div class="course-card">
                        <div>
                            <span class="card-tag">${n.category}</span>
                            <h3 class="card-title">${n.title}</h3>
                            <p class="card-info">${n.summary}</p>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                            <small style="color:var(--text-muted);">${n.date}</small>
                            <a href="${n.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="font-size:0.8rem;">Xem Báo 🔗</a>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${typeof GamificationSystem !== "undefined" ? GamificationSystem.getLeaderboardHTML() : ""}
            
            <!-- ĐỘI NGŨ PHÁT TRIỂN -->
            <h2 class="section-title">👨‍💻 Đội Ngũ Phát Triển Dự Án</h2>
            <div class="team-grid">
                <div class="team-card">
                    <div class="developer-avatar-box">
                        <div class="avatar-placeholder">🎓</div>
                    </div>
                    <h3>Tác Giả & Lập Trình Viên Chính</h3>
                    <p style="color:var(--accent-cyan); font-size:0.9rem; margin-bottom:0.5rem;">Chuyên Gia Web Fullstack</p>
                    <p style="color:var(--text-muted); font-size:0.85rem;">Phụ trách thiết kế giao diện Gradient tím, cấu trúc mã nguồn mô-đun Clean Code và tích hợp Firebase Console (hoccungnhau-cd2c6).</p>
                </div>
            </div>
        `;
    },
    
    renderHighSchoolGrade: function(grade) {
        const main = document.getElementById('main-app-content');
        const data = HIGHSCHOOL_DATA[`grade_${grade}`];
        if (!main || !data) return;
        
        main.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button class="btn-icon" onclick="AppController.renderHome()">← Trở Về Trang Chủ</button>
            </div>
            <h1 class="section-title">📚 Chương Trình Học Lớp ${grade}</h1>
            <p style="color:var(--text-muted); margin-bottom:2rem;">Gồm 6 môn cốt lõi: Văn, Toán, Anh, Lý, Hóa, Sinh. Mỗi môn có 5 video bài giảng YouTube trực quan, 10 tài liệu tham khảo và bài tập Quiz 20 câu củng cố.</p>
            
            <div class="card-grid">
                ${data.map(subj => `
                    <div class="course-card">
                        <div>
                            <span class="card-tag">Lớp ${grade}</span>
                            <h3 class="card-title">${subj.title}</h3>
                            <p class="card-info">📹 5 Video bài giảng | 📄 10 Link Tài liệu | 🎯 20 Câu Quiz</p>
                        </div>
                        <button class="btn-gradient" style="width:100%; margin-top:1rem;" onclick="AppController.renderSubjectDetail('highschool', ${grade}, '${subj.id}')">
                            Vào Học Môn ${subj.subject} →
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderTHPTQG: function() {
        const main = document.getElementById('main-app-content');
        const data = HIGHSCHOOL_DATA.thptqg;
        if (!main || !data) return;
        
        main.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button class="btn-icon" onclick="AppController.renderHome()">← Trở Về Trang Chủ</button>
            </div>
            <h1 class="section-title">🎓 ${data.title}</h1>
            <p style="color:var(--text-muted); margin-bottom:2rem;">${data.description}</p>
            
            <div class="quiz-container" style="background:var(--bg-card); padding:2rem; border-radius:16px; border:1px solid var(--border-color);">
                <h3>📄 Bộ Đề Thi Thử & Link Tải File PDF</h3>
                <div style="margin:1rem 0; display:flex; flex-direction:column; gap:0.75rem;">
                    ${data.examSets.map(ex => `
                        <div style="background:var(--bg-input); padding:0.8rem 1.2rem; border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                            <span style="font-weight:600;">${ex.title}</span>
                            <a href="${ex.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="font-size:0.85rem;">Tải Đề PDF 📥</a>
                        </div>
                    `).join('')}
                </div>
                
                <h3 style="margin-top:2rem; margin-bottom:1rem;">📹 Video Luyện Đề Thần Tốc</h3>
                <div style="margin:1rem 0; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.2rem;">
                    ${data.videos.map(v => `
                        <div style="background:var(--bg-input); padding:1rem; border-radius:12px; border:1px solid var(--border-color);">
                            <h4 style="font-size:0.95rem; margin-bottom:0.4rem;">${v.title}</h4>
                            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:10px; margin-top:0.5rem; background:#000;">
                                <iframe src="${v.embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0; border-radius:10px;" allowfullscreen></iframe>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn-gradient" style="margin-top:2rem; width:100%; padding:1rem; font-size:1.05rem;" onclick="QuizEngine.startQuiz(HIGHSCHOOL_DATA.thptqg.quiz, 'Luyện Thi THPTQG 2026')">
                    📝 Làm Bài Tập Củng Cố 20 Câu THPTQG Ngay
                </button>
            </div>
        `;
    },
    
    renderUniversity: function() {
        const main = document.getElementById('main-app-content');
        if (!main || !UNIVERSITY_DATA) return;
        
        main.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button class="btn-icon" onclick="AppController.renderHome()">← Trở Về Trang Chủ</button>
            </div>
            <h1 class="section-title">🏛️ Chương Trình Đại Học (Khối Ngành Kỹ Thuật)</h1>
            <p style="color:var(--text-muted); margin-bottom:2rem;">Chuyên đề tập trung kỹ thuật: Đại số tuyến tính, Toán rời rạc, Lập trình cơ bản C++, Pháp luật đại cương & Kỹ thuật Web Fullstack.</p>
            
            <div class="card-grid">
                ${UNIVERSITY_DATA.map(subj => `
                    <div class="course-card">
                        <div>
                            <span class="card-tag">${subj.category}</span>
                            <h3 class="card-title">${subj.title}</h3>
                            <p class="card-info">📹 5 Video Chuyên Sâu | 🔗 5 Tài Liệu Tham Khảo | 🎯 20 Câu Quiz</p>
                        </div>
                        <button class="btn-gradient" style="width:100%; margin-top:1rem;" onclick="AppController.renderSubjectDetail('university', 0, '${subj.id}')">
                            Xem Chi Tiết & Làm Quiz →
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderSubjectDetail: function(type, grade, id) {
        const main = document.getElementById('main-app-content');
        let subject = null;
        
        if (type === 'highschool') {
            subject = HIGHSCHOOL_DATA[`grade_${grade}`].find(s => s.id === id);
        } else {
            subject = UNIVERSITY_DATA.find(s => s.id === id);
        }
        
        if (!main || !subject) return;

        // Store active subject quiz & title for button click
        this.activeSubjectQuiz = subject.quiz;
        this.activeSubjectTitle = subject.title;
        
        main.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button class="btn-icon" onclick="${type === 'highschool' ? `AppController.renderHighSchoolGrade(${grade})` : `AppController.renderUniversity()`}">← Trở Về Danh Sách Môn</button>
            </div>
            
            <h1 class="section-title">📖 ${subject.title}</h1>
            
            <!-- VIDEO LESSONS GRID -->
            <h3 style="margin-top:1.5rem; margin-bottom:1rem;">📹 5 Video Bài Giảng Trọng Tâm</h3>
            <div class="card-grid">
                ${subject.videos.map(v => `
                    <div class="course-card">
                        <h4 style="font-size:1.02rem; margin-bottom:0.4rem;">${v.title}</h4>
                        <p class="card-info" style="font-size:0.85rem; margin-bottom:0.6rem;">${v.description || 'Bài giảng video trực quan từ giảng viên xuất sắc.'}</p>
                        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; background:#000;">
                            <iframe src="${v.embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0; border-radius:12px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- DOCUMENTS LIST -->
            <h3 style="margin-top:2rem; margin-bottom:1rem;">🔗 Tài Liệu Tham Khảo Thực Tế</h3>
            <div style="background:var(--bg-card); border-radius:16px; padding:1.2rem; border:1px solid var(--border-color); margin-bottom:2rem;">
                ${subject.documents.map(d => `
                    <div style="padding:0.8rem 0; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                        <span style="font-weight:600; font-size:0.92rem;">📄 ${d.title}</span>
                        <a href="${d.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="font-size:0.82rem;">Mở Tài Liệu Tham Khảo 🔗</a>
                    </div>
                `).join('')}
            </div>
            
            <!-- QUIZ BUTTON -->
            <div style="background:linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.1)); border-radius:20px; padding:2rem; text-align:center; border:1px solid var(--primary-purple);">
                <h3>🎯 Đánh Giá Năng Lực - Bài Tập Củng Cố 20 Câu</h3>
                <p style="color:var(--text-muted); margin:0.75rem 0 1.5rem 0;">Làm trắc nghiệm 20 câu hỏi có tính điểm, đếm giờ 15:00 và hiển thị giải thích đáp án ngay lập tức.</p>
                <button class="btn-gradient" style="padding:0.9rem 2.5rem; font-size:1.1rem;" onclick="QuizEngine.startQuiz(AppController.activeSubjectQuiz, AppController.activeSubjectTitle)">
                    🚀 Bắt Đầu Làm Bài Tập 20 Câu Quiz
                </button>
            </div>
        `;
    },
    
    renderNewsPage: function() {
        this.renderHome();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
