/**
 * InThisWorld — App UI
 * Auth modal, user menu, leaderboard panel
 */

const ITWUI = {

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  init() {
    this.injectStyles();
    this.injectAuthModal();
    this.injectLeaderboardModal();
    this.injectUserMenu();
    this.updateNav();
  },

  // ── Styles ────────────────────────────────────────────────────────────────

  injectStyles() {
    const css = `
      /* ── Auth + Leaderboard modals ── */
      .itw-overlay {
        position: fixed; inset: 0; z-index: 50000;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
        display: none; align-items: center; justify-content: center;
      }
      .itw-overlay.open { display: flex; }
      .itw-modal {
        background: #111120; border: 1px solid rgba(139,92,246,0.3);
        border-radius: 16px; padding: 2rem; width: 90%; max-width: 420px;
        max-height: 90vh; overflow-y: auto;
        box-shadow: 0 0 60px rgba(139,92,246,0.2);
      }
      .itw-modal.wide { max-width: 680px; }
      .itw-modal-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 1.5rem;
      }
      .itw-modal-header h2 { font-size: 1.25rem; font-weight: 700; color: #e2e8f0; }
      .itw-modal-close {
        background: none; border: none; color: rgba(255,255,255,0.4);
        font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 0;
        transition: color 0.2s;
      }
      .itw-modal-close:hover { color: #fff; }

      /* Tabs */
      .itw-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
      .itw-tab {
        flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.05);
        border: 1px solid transparent; border-radius: 8px;
        color: rgba(255,255,255,0.5); font-size: 0.875rem; font-weight: 600;
        cursor: pointer; transition: all 0.2s; font-family: inherit;
      }
      .itw-tab.active {
        background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.5);
        color: #c4b5fd;
      }

      /* Form */
      .itw-form-group { margin-bottom: 1rem; }
      .itw-form-group label {
        display: block; margin-bottom: 0.4rem; font-size: 0.85rem;
        color: rgba(255,255,255,0.6);
      }
      .itw-form-group input {
        width: 100%; padding: 0.75rem 1rem;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px; color: #e2e8f0; font-size: 0.95rem; font-family: inherit;
      }
      .itw-form-group input:focus { outline: none; border-color: rgba(139,92,246,0.5); }
      .itw-btn {
        width: 100%; padding: 0.875rem; border: none; border-radius: 10px;
        font-size: 1rem; font-weight: 700; cursor: pointer; font-family: inherit;
        transition: opacity 0.2s;
      }
      .itw-btn:hover { opacity: 0.9; }
      .itw-btn-primary { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }
      .itw-btn-secondary {
        background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.8); margin-top: 0.75rem;
      }
      .itw-error { color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; min-height: 1.25em; }
      .itw-divider {
        display: flex; align-items: center; gap: 1rem;
        margin: 1rem 0; color: rgba(255,255,255,0.2); font-size: 0.8rem;
      }
      .itw-divider::before, .itw-divider::after {
        content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1);
      }

      /* User menu */
      .itw-user-menu { position: relative; }
      .itw-user-btn {
        display: flex; align-items: center; gap: 0.5rem;
        background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3);
        border-radius: 20px; padding: 5px 12px 5px 5px; cursor: pointer;
        font-family: inherit; font-size: 0.85rem; color: #c4b5fd;
        transition: all 0.2s;
      }
      .itw-user-btn:hover { background: rgba(139,92,246,0.3); }
      .itw-avatar {
        width: 28px; height: 28px; border-radius: 50%;
        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 0.75rem; color: #fff; text-transform: uppercase;
        flex-shrink: 0;
      }
      .itw-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0;
        background: #111120; border: 1px solid rgba(139,92,246,0.3);
        border-radius: 12px; padding: 0.5rem; min-width: 180px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        display: none; z-index: 10001;
      }
      .itw-dropdown.open { display: block; }
      .itw-dropdown a, .itw-dropdown button {
        display: block; width: 100%; padding: 0.6rem 0.875rem;
        color: rgba(255,255,255,0.7); font-size: 0.875rem; text-decoration: none;
        border-radius: 8px; background: none; border: none; text-align: left;
        cursor: pointer; font-family: inherit; transition: background 0.15s;
      }
      .itw-dropdown a:hover, .itw-dropdown button:hover {
        background: rgba(139,92,246,0.15); color: #fff;
      }
      .itw-dropdown .sep {
        height: 1px; background: rgba(255,255,255,0.08); margin: 0.4rem 0;
      }
      #itw-login-btn {
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        border: none; border-radius: 8px; padding: 6px 16px;
        color: #fff; font-size: 0.85rem; font-weight: 700;
        cursor: pointer; font-family: inherit; transition: opacity 0.2s;
      }
      #itw-login-btn:hover { opacity: 0.9; }

      /* Leaderboard */
      .lb-game-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
      .lb-game-tab {
        padding: 0.4rem 0.875rem; border-radius: 20px;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 600;
        cursor: pointer; font-family: inherit; transition: all 0.2s;
      }
      .lb-game-tab.active {
        background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4);
        color: #c4b5fd;
      }
      .lb-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
      .lb-table th {
        text-align: left; padding: 0.5rem 0.75rem; color: rgba(139,92,246,0.8);
        font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .lb-table td {
        padding: 0.65rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);
        color: #e2e8f0;
      }
      .lb-table tr.me td { background: rgba(139,92,246,0.08); color: #c4b5fd; }
      .lb-rank { font-weight: 800; color: rgba(255,255,255,0.3); width: 36px; }
      .lb-rank.top1 { color: #ffd700; }
      .lb-rank.top2 { color: #94a3b8; }
      .lb-rank.top3 { color: #cd7f32; }
      .lb-score { font-family: 'Courier New', monospace; font-weight: 700; color: #4ade80; }
      .lb-empty { text-align: center; color: rgba(255,255,255,0.3); padding: 2rem; font-size: 0.875rem; }
      .lb-user-stats {
        display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      .lb-stat-card {
        background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2);
        border-radius: 10px; padding: 0.875rem; text-align: center;
      }
      .lb-stat-val { font-size: 1.5rem; font-weight: 800; color: #8b5cf6; }
      .lb-stat-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 0.2rem; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },

  // ── Auth Modal ─────────────────────────────────────────────────────────────

  injectAuthModal() {
    const html = `
      <div class="itw-overlay" id="itw-auth-overlay">
        <div class="itw-modal">
          <div class="itw-modal-header">
            <h2>🌍 InThisWorld</h2>
            <button class="itw-modal-close" onclick="ITWUI.closeAuth()">×</button>
          </div>
          <div class="itw-tabs">
            <button class="itw-tab active" data-tab="login" onclick="ITWUI.switchTab('login')">Log In</button>
            <button class="itw-tab" data-tab="signup" onclick="ITWUI.switchTab('signup')">Sign Up</button>
          </div>

          <!-- Login form -->
          <div id="itw-login-form">
            <div class="itw-form-group">
              <label>Username</label>
              <input type="text" id="itw-login-user" placeholder="username" autocomplete="username">
            </div>
            <div class="itw-form-group">
              <label>Password</label>
              <input type="password" id="itw-login-pass" placeholder="password" autocomplete="current-password">
            </div>
            <div class="itw-error" id="itw-login-err"></div>
            <button class="itw-btn itw-btn-primary" onclick="ITWUI.doLogin()">Log In</button>
            <div class="itw-divider">or</div>
            <button class="itw-btn itw-btn-secondary" onclick="ITWUI.doDemo()">👁️ Try Demo Account</button>
            <p style="text-align:center;margin-top:0.75rem;font-size:0.75rem;color:rgba(255,255,255,0.3);">Demo: explorer / demo123</p>
          </div>

          <!-- Signup form -->
          <div id="itw-signup-form" style="display:none;">
            <div class="itw-form-group">
              <label>Display Name</label>
              <input type="text" id="itw-su-name" placeholder="Your name">
            </div>
            <div class="itw-form-group">
              <label>Username</label>
              <input type="text" id="itw-su-user" placeholder="username (letters, numbers, _)">
            </div>
            <div class="itw-form-group">
              <label>Email <span style="color:rgba(255,255,255,0.3);font-size:0.8rem;">(optional)</span></label>
              <input type="email" id="itw-su-email" placeholder="you@example.com">
            </div>
            <div class="itw-form-group">
              <label>Password</label>
              <input type="password" id="itw-su-pass" placeholder="at least 6 characters">
            </div>
            <div class="itw-error" id="itw-signup-err"></div>
            <button class="itw-btn itw-btn-primary" onclick="ITWUI.doSignup()">Create Account</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // Enter key support
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.getElementById('itw-auth-overlay').classList.contains('open')) {
        const activeTab = document.querySelector('.itw-tab.active')?.dataset.tab;
        if (activeTab === 'login') this.doLogin();
        else this.doSignup();
      }
    });
  },

  openAuth() {
    document.getElementById('itw-auth-overlay').classList.add('open');
    setTimeout(() => document.getElementById('itw-login-user')?.focus(), 50);
  },

  closeAuth() {
    document.getElementById('itw-auth-overlay').classList.remove('open');
  },

  switchTab(tab) {
    document.querySelectorAll('.itw-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('itw-login-form').style.display  = tab === 'login'  ? '' : 'none';
    document.getElementById('itw-signup-form').style.display = tab === 'signup' ? '' : 'none';
    document.getElementById('itw-login-err').textContent  = '';
    document.getElementById('itw-signup-err').textContent = '';
    if (tab === 'signup') this.injectGeneratedPassword();
  },

  injectGeneratedPassword() {
    if (typeof PasswordUtils === 'undefined') return;
    const pw = document.getElementById('itw-su-pass');
    if (!pw || pw.value) return;
    const v = PasswordUtils.generate();
    pw.value = v;
    pw.type = 'text';
    document.getElementById('pw-suggest-bar')?.remove();
    const bar = document.createElement('div'); bar.id = 'pw-suggest-bar';
    bar.style.cssText = 'margin-top:8px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:8px;padding:8px 12px;font-size:0.8rem;color:#c4b5fd;display:flex;align-items:center;gap:8px;flex-wrap:wrap';
    bar.innerHTML = '<span>🔐 Secure password generated.</span><span style="flex:1"></span><button type="button" id="pw-copy-btn" style="background:rgba(139,92,246,0.25);border:1px solid rgba(139,92,246,0.4);color:#e9d5ff;border-radius:6px;padding:3px 10px;font-size:0.78rem;cursor:pointer;font-family:inherit;">📋 Copy</button><button type="button" id="pw-regen-btn" style="background:rgba(139,92,246,0.25);border:1px solid rgba(139,92,246,0.4);color:#e9d5ff;border-radius:6px;padding:3px 10px;font-size:0.78rem;cursor:pointer;font-family:inherit;">🔄 New</button>';
    pw.parentElement.appendChild(bar);
    document.getElementById('pw-copy-btn').addEventListener('click', () => { navigator.clipboard.writeText(pw.value).then(() => { const b = document.getElementById('pw-copy-btn'); if(b){b.textContent='✅ Copied!';setTimeout(()=>{b.textContent='📋 Copy';},2000);} }); });
    document.getElementById('pw-regen-btn').addEventListener('click', () => { const n = PasswordUtils.generate(); pw.value = n; });
  },

  async doLogin() {
    const u = document.getElementById('itw-login-user').value.trim();
    const p = document.getElementById('itw-login-pass').value;
    const err = document.getElementById('itw-login-err');
    try {
      await ITWAuth.login(u, p);
      this.closeAuth();
      this.updateNav();
      this.showToast('Welcome back, ' + ITWAuth.getCurrentUser().displayName + '! 🌍');
    } catch(e) { err.textContent = e.message; }
  },

  async doDemo() {
    try {
      await ITWAuth.loginDemo();
      this.closeAuth();
      this.updateNav();
      this.showToast('Logged in as Demo Explorer 👁️');
    } catch(e) {
      document.getElementById('itw-login-err').textContent = e.message;
    }
  },

  async doSignup() {
    const name  = document.getElementById('itw-su-name').value.trim();
    const user  = document.getElementById('itw-su-user').value.trim();
    const email = document.getElementById('itw-su-email').value.trim();
    const pass  = document.getElementById('itw-su-pass').value;
    const err   = document.getElementById('itw-signup-err');
    try {
      await ITWAuth.signup(name, user, email, pass);
      this.closeAuth();
      this.updateNav();
      this.showToast('Welcome to InThisWorld, ' + name + '! 🎉');
    } catch(e) { err.textContent = e.message; }
  },

  // ── Leaderboard Modal ─────────────────────────────────────────────────────

  injectLeaderboardModal() {
    const html = `
      <div class="itw-overlay" id="itw-lb-overlay">
        <div class="itw-modal wide">
          <div class="itw-modal-header">
            <h2>🏆 Leaderboards</h2>
            <button class="itw-modal-close" onclick="ITWUI.closeLB()">×</button>
          </div>
          <div class="itw-tabs">
            <button class="itw-tab active" data-lb="global" onclick="ITWUI.switchLB('global')">🌐 Global</button>
            <button class="itw-tab" data-lb="myscores" onclick="ITWUI.switchLB('myscores')">👤 My Scores</button>
          </div>
          <div id="itw-lb-content"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  openLB() {
    document.getElementById('itw-lb-overlay').classList.add('open');
    this.renderLB('global');
  },

  closeLB() {
    document.getElementById('itw-lb-overlay').classList.remove('open');
  },

  switchLB(tab) {
    document.querySelectorAll('[data-lb]').forEach(t => t.classList.toggle('active', t.dataset.lb === tab));
    this.renderLB(tab);
  },

  renderLB(tab) {
    const el = document.getElementById('itw-lb-content');
    const me = ITWAuth.getCurrentUser();

    if (tab === 'global') {
      const games = ITW_CONFIG.games;
      const gameTabs = games.map((g, i) =>
        `<button class="lb-game-tab${i===0?' active':''}" onclick="ITWUI.renderGameLB('${g.id}',this)">${g.icon} ${g.name}</button>`
      ).join('');
      el.innerHTML = `<div class="lb-game-tabs">${gameTabs}</div><div id="itw-lb-game-rows"></div>`;
      if (games.length) this.renderGameLB(games[0].id);

    } else {
      // My Scores
      if (!me) {
        el.innerHTML = '<div class="lb-empty">Log in to see your scores.</div>';
        return;
      }
      const scores = ITWStorage.getUserScores(me.username);
      const userObj = ITWStorage.getUserByUsername(me.username);
      el.innerHTML = `
        <div class="lb-user-stats">
          <div class="lb-stat-card"><div class="lb-stat-val">${userObj.gamesPlayed||0}</div><div class="lb-stat-lbl">Games Played</div></div>
          <div class="lb-stat-card"><div class="lb-stat-val">${(userObj.totalScore||0).toLocaleString()}</div><div class="lb-stat-lbl">Total Score</div></div>
          <div class="lb-stat-card"><div class="lb-stat-val">${scores.length}</div><div class="lb-stat-lbl">Score Entries</div></div>
        </div>
        ${scores.length === 0 ? '<div class="lb-empty">No scores yet. Play some games!</div>' :
          `<table class="lb-table">
            <thead><tr><th>Game</th><th>Score</th><th>Date</th></tr></thead>
            <tbody>${scores.map(s => `
              <tr>
                <td>${s.gameName}</td>
                <td class="lb-score">${s.score.toLocaleString()}</td>
                <td style="color:rgba(255,255,255,0.4);font-size:0.8rem;">${new Date(s.timestamp).toLocaleDateString()}</td>
              </tr>`).join('')}
            </tbody>
          </table>`
        }
      `;
    }
  },

  renderGameLB(gameId, btn) {
    if (btn) {
      document.querySelectorAll('.lb-game-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
    }
    const me = ITWAuth.getCurrentUser();
    const rows = ITWStorage.getTopScores(gameId, 10);
    const el = document.getElementById('itw-lb-game-rows');
    if (!el) return;
    if (rows.length === 0) {
      el.innerHTML = '<div class="lb-empty">No scores yet — be the first!</div>';
      return;
    }
    const rankClass = i => i===0?'top1':i===1?'top2':i===2?'top3':'';
    const rankIcon  = i => i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}`;
    el.innerHTML = `<table class="lb-table">
      <thead><tr><th>#</th><th>Player</th><th>Score</th><th>Date</th></tr></thead>
      <tbody>${rows.map((s,i) => `
        <tr class="${me && s.username===me.username?'me':''}">
          <td class="lb-rank ${rankClass(i)}">${rankIcon(i)}</td>
          <td>${s.displayName}</td>
          <td class="lb-score">${s.score.toLocaleString()}</td>
          <td style="color:rgba(255,255,255,0.4);font-size:0.8rem;">${new Date(s.timestamp).toLocaleDateString()}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  },

  // ── Nav user menu ──────────────────────────────────────────────────────────

  injectUserMenu() {
    // Injected into nav by updateNav() — just prep the container
  },

  updateNav() {
    const user = ITWAuth.getCurrentUser();
    let container = document.getElementById('itw-nav-auth');
    if (!container) return;

    if (!user) {
      container.innerHTML = `<button id="itw-login-btn" onclick="ITWUI.openAuth()">Log In</button>`;
      return;
    }

    const initial = user.displayName.charAt(0).toUpperCase();
    container.innerHTML = `
      <div class="itw-user-menu">
        <button class="itw-user-btn" onclick="ITWUI.toggleDropdown()" id="itw-user-toggle">
          <div class="itw-avatar">${initial}</div>
          <span>${user.displayName}</span>
          <span style="opacity:0.4;font-size:0.7rem;">▾</span>
        </button>
        <div class="itw-dropdown" id="itw-dropdown">
          <a onclick="ITWUI.openLB();ITWUI.closeDropdown()">🏆 Leaderboards</a>
          <div class="sep"></div>
          ${user.isAdmin ? '<a onclick="ITWUI.openAdmin()">🛡️ Admin</a><div class="sep"></div>' : ''}
          <button onclick="ITWUI.doLogout()">🚪 Log Out</button>
        </div>
      </div>
    `;

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
      const menu = document.getElementById('itw-dropdown');
      const toggle = document.getElementById('itw-user-toggle');
      if (menu && !menu.contains(e.target) && !toggle?.contains(e.target)) {
        menu.classList.remove('open');
      }
    }, { once: false });
  },

  toggleDropdown() {
    document.getElementById('itw-dropdown')?.classList.toggle('open');
  },

  closeDropdown() {
    document.getElementById('itw-dropdown')?.classList.remove('open');
  },

  doLogout() {
    ITWAuth.logout();
    this.updateNav();
    this.closeDropdown();
    this.showToast('Logged out. See you next time! 👋');
  },

  // ── Admin (basic) ─────────────────────────────────────────────────────────

  openAdmin() {
    this.closeDropdown();
    const users = Object.values(ITWStorage.getUsers());
    const scores = ITWStorage.getScores();
    const html = `
      <div class="itw-overlay open" id="itw-admin-overlay">
        <div class="itw-modal wide">
          <div class="itw-modal-header">
            <h2>🛡️ Admin Panel</h2>
            <button class="itw-modal-close" onclick="document.getElementById('itw-admin-overlay').remove()">×</button>
          </div>
          <div class="lb-user-stats" style="margin-bottom:1.5rem;">
            <div class="lb-stat-card"><div class="lb-stat-val">${users.length}</div><div class="lb-stat-lbl">Users</div></div>
            <div class="lb-stat-card"><div class="lb-stat-val">${scores.length}</div><div class="lb-stat-lbl">Score Entries</div></div>
            <div class="lb-stat-card"><div class="lb-stat-val">${ITW_CONFIG.games.length}</div><div class="lb-stat-lbl">Games</div></div>
          </div>
          <table class="lb-table">
            <thead><tr><th>Username</th><th>Display Name</th><th>Joined</th><th>Games</th><th>Total Score</th><th>Role</th></tr></thead>
            <tbody>${users.map(u => `
              <tr>
                <td style="font-family:monospace;font-size:0.8rem;">${u.username}</td>
                <td>${u.displayName}</td>
                <td style="color:rgba(255,255,255,0.4);font-size:0.8rem;">${new Date(u.createdAt).toLocaleDateString()}</td>
                <td>${u.gamesPlayed||0}</td>
                <td class="lb-score">${(u.totalScore||0).toLocaleString()}</td>
                <td style="color:${u.isAdmin?'#f59e0b':'rgba(255,255,255,0.4)'};">${u.isAdmin?'Admin':'User'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
          <button class="itw-btn itw-btn-secondary" style="margin-top:1rem;" onclick="ITWUI.exportData()">💾 Export Data JSON</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  exportData() {
    const data = ITWStorage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `inthisworld-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(message, duration = 3000) {
    let container = document.getElementById('itw-toasts');
    if (!container) {
      container = document.createElement('div');
      container.id = 'itw-toasts';
      container.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:60000;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = 'background:#111120;border:1px solid rgba(139,92,246,0.4);border-radius:10px;padding:12px 16px;color:#e2e8f0;font-size:0.875rem;box-shadow:0 4px 20px rgba(0,0,0,0.4);transform:translateX(120%);transition:transform 0.3s ease;max-width:280px;';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Global shortcut for games to submit scores
window.ITW = {
  submitScore(gameId, gameName, score, extra = {}) {
    const entry = ITWAuth.submitScore(gameId, gameName, score, extra);
    if (entry) {
      ITWUI.showToast(`Score saved: ${score.toLocaleString()} 🏆`);
    }
    return entry;
  },
  isLoggedIn: () => ITWAuth.isLoggedIn(),
  getUser:    () => ITWAuth.getCurrentUser(),
  openLogin:  () => ITWUI.openAuth(),
  openLB:     () => ITWUI.openLB()
};

document.addEventListener('DOMContentLoaded', () => ITWUI.init());
