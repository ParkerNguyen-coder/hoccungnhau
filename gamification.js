/* ==========================================================================
   HỌC CÙNG NHAU - GAMIFICATION & LEADERBOARD SYSTEM
   ========================================================================== */

const GamificationSystem = {
    exp: 0,
    level: 1,
    badges: [],
    
    init: function() {
        this.loadData();
    },
    
    loadData: function() {
        const saved = localStorage.getItem('hoccungnhau_gamification');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.exp = parsed.exp || 0;
                this.level = Math.floor(this.exp / 100) + 1;
                this.badges = parsed.badges || ['Thành Viên Mới'];
            } catch(e){}
        } else {
            this.badges = ['Thành Viên Mới'];
        }
    },
    
    addEXP: function(amount, reason) {
        this.exp += amount;
        const newLevel = Math.floor(this.exp / 100) + 1;
        
        let msg = `🎉 +${amount} EXP: ${reason}!`;
        if (newLevel > this.level) {
            this.level = newLevel;
            msg += `\n🌟 Chúc mừng! Bạn đã thăng cấp lên LEVEL ${this.level}!`;
            this.checkBadges();
        }
        
        this.saveData();
        this.showNotification(msg);
    },
    
    checkBadges: function() {
        if (this.exp >= 100 && !this.badges.includes('Học Viên Chăm Chỉ')) {
            this.badges.push('Học Viên Chăm Chỉ');
        }
        if (this.exp >= 300 && !this.badges.includes('Cao Thủ Trắc Nghiệm')) {
            this.badges.push('Cao Thủ Trắc Nghiệm');
        }
        if (this.exp >= 500 && !this.badges.includes('Chiến Thần hoccungnhau')) {
            this.badges.push('Chiến Thần hoccungnhau');
        }
        this.saveData();
    },
    
    saveData: function() {
        localStorage.setItem('hoccungnhau_gamification', JSON.stringify({
            exp: this.exp,
            level: this.level,
            badges: this.badges
        }));
    },
    
    showNotification: function(text) {
        const noti = document.createElement('div');
        noti.className = 'gamification-toast';
        noti.innerHTML = text.replace(/\n/g, '<br>');
        document.body.appendChild(noti);
        setTimeout(() => noti.classList.add('show'), 100);
        setTimeout(() => {
            noti.classList.remove('show');
            setTimeout(() => noti.remove(), 400);
        }, 3500);
    },
    
    getLeaderboardHTML: function() {
        const topUsers = [
            { name: "Nguyễn Văn Anh (Lớp 12)", exp: 850, level: 9, badge: "🥇 Chiến Thần THPTQG" },
            { name: "Trần Thị Bình (Đại Học Bách Khoa)", exp: 720, level: 8, badge: "🥈 Thần Đồng C++" },
            { name: "Lê Hoàng Cường (Lớp 11)", exp: 610, level: 7, badge: "🥉 Cao Thủ Toán" },
            { name: "Phạm Minh Đức (Lớp 10)", exp: 490, level: 5, badge: "🎗️ Học Viên Ưu Tú" },
            { name: `Bạn (${AuthService.currentUser ? AuthService.currentUser.name : 'Chưa Đăng Nhập'})`, exp: this.exp, level: this.level, badge: this.badges[this.badges.length - 1] || 'Tân Binh' }
        ];
        
        return `
            <div class="leaderboard-card">
                <h3 style="margin-bottom:1rem; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
                    🏆 Bảng Xếp Hạng TOP Học Viên Xuất Sắc Tuần
                </h3>
                <div class="leaderboard-list">
                    ${topUsers.map((u, i) => `
                        <div class="leaderboard-item ${i === 4 ? 'current-user' : ''}">
                            <div class="rank-num">${i + 1}</div>
                            <div style="flex:1;">
                                <div style="font-weight:700; font-size:0.95rem;">${u.name}</div>
                                <div style="font-size:0.8rem; color:var(--text-muted);">${u.badge}</div>
                            </div>
                            <div style="text-align:right;">
                                <span class="badge-exp">Level ${u.level}</span>
                                <div style="font-size:0.8rem; font-weight:700; color:var(--accent-pink);">${u.exp} EXP</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

document.addEventListener("DOMContentLoaded", () => GamificationSystem.init());
