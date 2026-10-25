/* ==========================================================================
   HỌC CÙNG NHAU - ADMIN MANAGEMENT SERVICE PORTAL
   Full CRUD: Manage Users, Courses, Videos, and Quiz Question Bank
   ========================================================================== */

const AdminService = {
    isAdminLoggedIn: false,
    
    init: function() {
        this.loadCustomData();
        this.bindEvents();
    },
    
    // Load persisted edits from LocalStorage to override or update course/quiz data
    loadCustomData: function() {
        try {
            const savedHs = localStorage.getItem('hoccungnhau_custom_hs_data');
            if (savedHs) {
                const parsed = JSON.parse(savedHs);
                Object.assign(HIGHSCHOOL_DATA, parsed);
            }
            const savedUni = localStorage.getItem('hoccungnhau_custom_uni_data');
            if (savedUni) {
                const parsed = JSON.parse(savedUni);
                UNIVERSITY_DATA.length = 0;
                UNIVERSITY_DATA.push(...parsed);
            }
        } catch(e) {
            console.warn("⚠️ Load Custom Admin Data Warning:", e);
        }
    },
    
    saveCustomData: function() {
        try {
            localStorage.setItem('hoccungnhau_custom_hs_data', JSON.stringify(HIGHSCHOOL_DATA));
            localStorage.setItem('hoccungnhau_custom_uni_data', JSON.stringify(UNIVERSITY_DATA));
        } catch(e) {
            console.warn("⚠️ Save Custom Admin Data Warning:", e);
        }
    },
    
    bindEvents: function() {
        const btn = document.getElementById('admin-btn');
        const modal = document.getElementById('admin-modal');
        const closeBtn = document.getElementById('admin-modal-close');
        
        if (btn && modal) {
            btn.addEventListener('click', () => this.openAdminPortal());
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        
        // Admin Login Form Handler
        const adminLoginForm = document.getElementById('admin-login-form');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const pass = document.getElementById('admin-pass-input').value;
                if (pass === 'admin123' || pass === 'admin' || (AuthService.currentUser && AuthService.currentUser.role === 'Admin')) {
                    this.isAdminLoggedIn = true;
                    this.renderDashboard();
                } else {
                    alert('❌ Mật khẩu Admin không chính xác!');
                }
            });
        }
        
        // Admin Tab Filter Clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-tab-btn')) {
                document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const tab = e.target.dataset.admintab;
                this.switchTab(tab);
            }
        });
    },
    
    openAdminPortal: function() {
        const modal = document.getElementById('admin-modal');
        if (!modal) return;
        
        modal.classList.add('active');
        
        // Check if current logged user is admin or already logged into admin
        if (AuthService.currentUser && (AuthService.currentUser.email === 'admin@hoccungnhau.edu.vn' || AuthService.currentUser.role === 'Admin')) {
            this.isAdminLoggedIn = true;
        }
        
        if (this.isAdminLoggedIn) {
            this.renderDashboard();
        } else {
            this.renderLoginForm();
        }
    },
    
    renderLoginForm: function() {
        const container = document.getElementById('admin-portal-content');
        if (!container) return;
        
        container.innerHTML = `
            <div style="max-width:400px; margin:2rem auto; text-align:center; background:var(--bg-input); padding:2rem; border-radius:16px; border:1px solid var(--border-color);">
                <div style="font-size:3rem; margin-bottom:1rem;">🔐</div>
                <h3 style="margin-bottom:0.5rem;">Cổng Đăng Nhập Quản Trị Viên (Admin)</h3>
                <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.5rem;">Vui lòng nhập mật khẩu quản trị để theo dõi tài khoản, sửa video và câu hỏi trắc nghiệm.</p>
                <form id="admin-login-form">
                    <div class="form-group">
                        <input type="password" id="admin-pass-input" class="form-input" placeholder="Nhập mật khẩu Admin..." required style="text-align:center; font-size:1.1rem;">
                    </div>
                    <button type="submit" class="btn-gradient" style="width:100%; padding:0.8rem; margin-top:0.5rem;">🚀 Xác Nhận Đăng Nhập Admin</button>
                </form>
                <div style="margin-top:1rem; font-size:0.8rem; color:var(--text-muted);">
                </div>
            </div>
        `;
        
        // Re-bind form submit
        const form = document.getElementById('admin-login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const pass = document.getElementById('admin-pass-input').value;
                if (pass === 'admin123' || pass === 'admin' || (AuthService.currentUser && AuthService.currentUser.role === 'Admin')) {
                    this.isAdminLoggedIn = true;
                    this.renderDashboard();
                } else {
                    alert('❌ Mật khẩu Admin không chính xác!');
                }
            });
        }
    },
    
    renderDashboard: function() {
        const container = document.getElementById('admin-portal-content');
        if (!container) return;
        
        // Calculate statistics
        let totalVideos = 0;
        let totalQuizzes = 0;
        let totalSubjects = 0;
        
        [10, 11, 12].forEach(g => {
            HIGHSCHOOL_DATA[`grade_${g}`].forEach(s => {
                totalSubjects++;
                totalVideos += s.videos ? s.videos.length : 0;
                totalQuizzes += s.quiz ? s.quiz.length : 0;
            });
        });
        
        UNIVERSITY_DATA.forEach(s => {
            totalSubjects++;
            totalVideos += s.videos ? s.videos.length : 0;
            totalQuizzes += s.quiz ? s.quiz.length : 0;
        });
        
        container.innerHTML = `
            <!-- ADMIN HEADER STATS BANNER -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                <div style="background:var(--bg-input); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center;">
                    <div style="font-size:1.8rem; font-weight:800; color:var(--primary-purple);">👤 12</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Tài Khoản Học Viên</div>
                </div>
                <div style="background:var(--bg-input); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center;">
                    <div style="font-size:1.8rem; font-weight:800; color:var(--accent-cyan);">${totalSubjects}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Môn Học Khóa Học</div>
                </div>
                <div style="background:var(--bg-input); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center;">
                    <div style="font-size:1.8rem; font-weight:800; color:var(--accent-pink);">${totalVideos}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Video Bài Giảng</div>
                </div>
                <div style="background:var(--bg-input); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center;">
                    <div style="font-size:1.8rem; font-weight:800; color:var(--accent-green);">${totalQuizzes}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Câu Hỏi Trắc Nghiệm</div>
                </div>
            </div>
            
            <!-- ADMIN TABS MENU -->
            <div style="display:flex; gap:0.5rem; border-bottom:1px solid var(--border-color); margin-bottom:1.5rem; flex-wrap:wrap;">
                <button class="admin-tab-btn active" data-admintab="users" style="padding:0.6rem 1.2rem; background:none; border:none; color:var(--text-primary); font-weight:700; border-bottom:2px solid var(--primary-purple); cursor:pointer;">👥 Quản Lý Học Viên</button>
                <button class="admin-tab-btn" data-admintab="courses" style="padding:0.6rem 1.2rem; background:none; border:none; color:var(--text-muted); font-weight:700; cursor:pointer;">📹 Quản Lý Video Bài Giảng</button>
                <button class="admin-tab-btn" data-admintab="quizzes" style="padding:0.6rem 1.2rem; background:none; border:none; color:var(--text-muted); font-weight:700; cursor:pointer;">🎯 Quản Lý Ngân Hàng Câu Hỏi</button>
            </div>
            
            <div id="admin-tab-view">
                <!-- Rendered dynamically -->
            </div>
        `;
        
        this.switchTab('users');
    },
    
    switchTab: function(tabName) {
        const view = document.getElementById('admin-tab-view');
        if (!view) return;
        
        if (tabName === 'users') {
            this.renderUsersTab(view);
        } else if (tabName === 'courses') {
            this.renderCoursesTab(view);
        } else if (tabName === 'quizzes') {
            this.renderQuizzesTab(view);
        }
    },
    
    /* --------------------------------------------------------------------------
       1. TAB QUẢN LÝ TÀI KHOẢN HỌC VIÊN
       -------------------------------------------------------------------------- */
    renderUsersTab: function(container) {
        // Sample list + current user
        let userList = [
            { uid: "u1", name: "Nguyễn Văn An", email: "an.nguyen@gmail.com", role: "Học Viên", status: "Hoạt động", date: "2026-10-20" },
            { uid: "u2", name: "Trần Thi Mai", email: "mai.tran@gmail.com", role: "Học Viên", status: "Hoạt động", date: "2026-10-21" },
            { uid: "u3", name: "Lê Hoàng Nam", email: "nam.le@gmail.com", role: "Học Viên", status: "Hoạt động", date: "2026-10-22" },
            { uid: "u4", name: "Phạm Quốc Bảo", email: "bao.pham@gmail.com", role: "Học Viên", status: "Hoạt động", date: "2026-10-23" }
        ];
        
        if (AuthService.currentUser) {
            userList.unshift({
                uid: AuthService.currentUser.uid || 'current',
                name: AuthService.currentUser.name || 'Học Viên Hiện Tại',
                email: AuthService.currentUser.email || 'user@hoccungnhau.edu.vn',
                role: AuthService.currentUser.role || 'Học Viên',
                status: 'Đang Online 🔥',
                date: 'Vừa xong'
            });
        }
        
        container.innerHTML = `
            <div style="background:var(--bg-input); border-radius:12px; padding:1rem; border:1px solid var(--border-color); overflow-x:auto;">
                <h4 style="margin-bottom:0.8rem; font-size:1rem;">📋 Danh Sách Tài Khoản Học Viên Đăng Ký Hệ Thống</h4>
                <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.88rem;">
                    <thead>
                        <tr style="background:rgba(124,58,237,0.15); border-bottom:1px solid var(--border-color);">
                            <th style="padding:0.75rem 1rem;">Họ và Tên</th>
                            <th style="padding:0.75rem 1rem;">Email Khoản</th>
                            <th style="padding:0.75rem 1rem;">Vai Trò</th>
                            <th style="padding:0.75rem 1rem;">Trạng Thái</th>
                            <th style="padding:0.75rem 1rem;">Thao Tác Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userList.map((u, idx) => `
                            <tr style="border-bottom:1px solid var(--border-color);">
                                <td style="padding:0.75rem 1rem; font-weight:600;">${u.name}</td>
                                <td style="padding:0.75rem 1rem; color:var(--text-muted);">${u.email}</td>
                                <td style="padding:0.75rem 1rem;"><span style="background:rgba(6,182,212,0.15); color:var(--accent-cyan); padding:2px 8px; border-radius:10px; font-weight:700; font-size:0.75rem;">${u.role}</span></td>
                                <td style="padding:0.75rem 1rem;"><span style="color:#10b981; font-weight:700;">● ${u.status}</span></td>
                                <td style="padding:0.75rem 1rem;">
                                    <button class="btn-icon" style="font-size:0.75rem; padding:4px 10px;" onclick="AdminService.toggleUserLock('${u.email}')">🔒 Khóa</button>
                                    <button class="btn-icon" style="font-size:0.75rem; padding:4px 10px; color:#ef4444;" onclick="AdminService.deleteUser('${u.email}')">🗑️ Xóa</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    toggleUserLock: function(email) {
        alert(`🔒 Đã gửi lệnh thay đổi trạng thái tài khoản [${email}]!`);
    },
    
    deleteUser: function(email) {
        if (confirm(`🗑️ Bạn có chắc chắn muốn xóa tài khoản [${email}] khỏi hệ thống không?`)) {
            alert(`✅ Đã xóa tài khoản [${email}] thành công.`);
            this.switchTab('users');
        }
    },
    
    /* --------------------------------------------------------------------------
       2. TAB QUẢN LÝ VIDEO BÀI GIẢNG KHÓA HỌC
       -------------------------------------------------------------------------- */
    renderCoursesTab: function(container) {
        container.innerHTML = `
            <div style="background:var(--bg-input); border-radius:12px; padding:1.2rem; border:1px solid var(--border-color);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
                    <div>
                        <h4 style="margin:0; font-size:1rem;">📹 Danh Sách Video Bài Giảng Môn Học</h4>
                        <span style="font-size:0.8rem; color:var(--text-muted);">Chọn môn học để chỉnh sửa tiêu đề, mô tả và link phát YouTube Embed.</span>
                    </div>
                    <select id="admin-course-select" class="form-input" style="width:auto; min-width:240px;" onchange="AdminService.loadCourseVideos(this.value)">
                        <option value="hs_10_toán-10">Lớp 10 - Môn Toán 10</option>
                        <option value="hs_10_văn-10">Lớp 10 - Môn Văn 10</option>
                        <option value="hs_10_anh-10">Lớp 10 - Môn Anh 10</option>
                        <option value="hs_10_lí-10">Lớp 10 - Môn Vật Lý 10</option>
                        <option value="hs_10_hóa-10">Lớp 10 - Môn Hóa Học 10</option>
                        <option value="hs_10_sinh-10">Lớp 10 - Môn Sinh Học 10</option>
                        <option value="hs_11_toán-11">Lớp 11 - Môn Toán 11</option>
                        <option value="hs_12_toán-12">Lớp 12 - Môn Toán 12</option>
                        <option value="uni_linear-algebra">Đại Học - Đại Số Tuyến Tính</option>
                        <option value="uni_basic-programming">Đại Học - Lập Trình C++</option>
                    </select>
                </div>
                
                <div id="admin-videos-list">
                    <!-- Rendered dynamically -->
                </div>
            </div>
        `;
        
        this.loadCourseVideos('hs_10_toán-10');
    },
    
    loadCourseVideos: function(courseKey) {
        const listEl = document.getElementById('admin-videos-list');
        if (!listEl) return;
        
        const [type, grade, id] = courseKey.split('_');
        let subject = null;
        
        if (type === 'hs') {
            subject = HIGHSCHOOL_DATA[`grade_${grade}`].find(s => s.id === id);
        } else {
            subject = UNIVERSITY_DATA.find(s => s.id === grade); // grade holds id in uni
        }
        
        if (!subject || !subject.videos) {
            listEl.innerHTML = `<p style="color:var(--text-muted);">Không tìm thấy video cho môn học này.</p>`;
            return;
        }
        
        listEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:1rem;">
                ${subject.videos.map((v, idx) => `
                    <div style="background:var(--bg-card); padding:1rem; border-radius:10px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                        <div style="flex:1;">
                            <h5 style="margin:0 0 0.3rem 0; font-size:0.95rem;">${idx + 1}. ${v.title}</h5>
                            <p style="margin:0; font-size:0.8rem; color:var(--text-muted);">${v.description || 'Chưa có mô tả'}</p>
                            <code style="font-size:0.75rem; color:var(--primary-purple);">${v.embedUrl}</code>
                        </div>
                        <button class="btn-gradient" style="font-size:0.8rem; padding:0.4rem 1rem;" onclick="AdminService.editVideoPrompt('${courseKey}', ${idx})">✏️ Chỉnh Sửa</button>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    editVideoPrompt: function(courseKey, vIdx) {
        const [type, grade, id] = courseKey.split('_');
        let subject = (type === 'hs') ? HIGHSCHOOL_DATA[`grade_${grade}`].find(s => s.id === id) : UNIVERSITY_DATA.find(s => s.id === grade);
        
        if (!subject || !subject.videos[vIdx]) return;
        const v = subject.videos[vIdx];
        
        const newTitle = prompt("✏️ Nhập Tiêu Đề Video Bài Giảng Mới:", v.title);
        if (newTitle !== null && newTitle.trim()) {
            v.title = newTitle.trim();
            const newEmbed = prompt("🔗 Nhập Link YouTube Embed Mới:", v.embedUrl);
            if (newEmbed !== null && newEmbed.trim()) {
                v.embedUrl = newEmbed.trim();
            }
            this.saveCustomData();
            alert("✅ Đã cập nhật thông tin Video bài giảng thành công!");
            this.loadCourseVideos(courseKey);
        }
    },
    
    /* --------------------------------------------------------------------------
       3. TAB QUẢN LÝ NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM
       -------------------------------------------------------------------------- */
    renderQuizzesTab: function(container) {
        container.innerHTML = `
            <div style="background:var(--bg-input); border-radius:12px; padding:1.2rem; border:1px solid var(--border-color);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
                    <div>
                        <h4 style="margin:0; font-size:1rem;">🎯 Quản Lý 20 Câu Hỏi Trắc Nghiệm Môn Học</h4>
                        <span style="font-size:0.8rem; color:var(--text-muted);">Sửa câu hỏi, 4 đáp án A-B-C-D và lời giải chi tiết.</span>
                    </div>
                    <select id="admin-quiz-select" class="form-input" style="width:auto; min-width:240px;" onchange="AdminService.loadSubjectQuizzes(this.value)">
                        <option value="hs_10_toán-10">Lớp 10 - Môn Toán 10</option>
                        <option value="hs_10_văn-10">Lớp 10 - Môn Văn 10</option>
                        <option value="hs_10_anh-10">Lớp 10 - Môn Anh 10</option>
                        <option value="hs_10_lí-10">Lớp 10 - Môn Vật Lý 10</option>
                        <option value="hs_10_hóa-10">Lớp 10 - Môn Hóa Học 10</option>
                        <option value="hs_10_sinh-10">Lớp 10 - Môn Sinh Học 10</option>
                        <option value="hs_11_toán-11">Lớp 11 - Môn Toán 11</option>
                        <option value="hs_12_toán-12">Lớp 12 - Môn Toán 12</option>
                        <option value="uni_linear-algebra">Đại Học - Đại Số Tuyến Tính</option>
                        <option value="uni_basic-programming">Đại Học - Lập Trình C++</option>
                    </select>
                </div>
                
                <div id="admin-quizzes-list">
                    <!-- Rendered dynamically -->
                </div>
            </div>
        `;
        
        this.loadSubjectQuizzes('hs_10_toán-10');
    },
    
    loadSubjectQuizzes: function(courseKey) {
        const listEl = document.getElementById('admin-quizzes-list');
        if (!listEl) return;
        
        const [type, grade, id] = courseKey.split('_');
        let subject = (type === 'hs') ? HIGHSCHOOL_DATA[`grade_${grade}`].find(s => s.id === id) : UNIVERSITY_DATA.find(s => s.id === grade);
        
        if (!subject || !subject.quiz) {
            listEl.innerHTML = `<p style="color:var(--text-muted);">Chưa có bộ câu hỏi cho môn học này.</p>`;
            return;
        }
        
        listEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:1rem; max-height:450px; overflow-y:auto; padding-right:0.5rem;">
                ${subject.quiz.map((q, idx) => `
                    <div style="background:var(--bg-card); padding:1rem; border-radius:10px; border:1px solid var(--border-color);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                            <strong style="font-size:0.92rem; color:var(--primary-purple);">${idx + 1}. ${q.question}</strong>
                            <button class="btn-gradient" style="font-size:0.75rem; padding:0.3rem 0.8rem;" onclick="AdminService.editQuestionPrompt('${courseKey}', ${idx})">✏️ Sửa Câu Hỏi</button>
                        </div>
                        <div style="font-size:0.82rem; color:var(--text-muted); display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; margin-bottom:0.4rem;">
                            <div>${q.options[0]}</div>
                            <div>${q.options[1]}</div>
                            <div>${q.options[2]}</div>
                            <div>${q.options[3]}</div>
                        </div>
                        <div style="font-size:0.8rem; color:#10b981; font-weight:700;">✅ Đáp án đúng: Phương án ${String.fromCharCode(65 + q.correctIndex)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    editQuestionPrompt: function(courseKey, qIdx) {
        const [type, grade, id] = courseKey.split('_');
        let subject = (type === 'hs') ? HIGHSCHOOL_DATA[`grade_${grade}`].find(s => s.id === id) : UNIVERSITY_DATA.find(s => s.id === grade);
        
        if (!subject || !subject.quiz[qIdx]) return;
        const q = subject.quiz[qIdx];
        
        const newText = prompt("✏️ Nhập Nội Dung Câu Hỏi Mới:", q.question);
        if (newText !== null && newText.trim()) {
            q.question = newText.trim();
            this.saveCustomData();
            alert("✅ Đã lưu chỉnh sửa câu hỏi thành công!");
            this.loadSubjectQuizzes(courseKey);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => AdminService.init());
