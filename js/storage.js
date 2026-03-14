/**
 * InThisWorld — Storage Module
 * Handles users, sessions, and game scores in localStorage
 */
const ITWStorage = {

  get KEYS() {
    const p = ITW_CONFIG.storagePrefix;
    return {
      USERS:        `${p}_users`,
      CURRENT_USER: `${p}_current_user`,
      SCORES:       `${p}_scores`
    };
  },

  // ── Init ─────────────────────────────────────────────────────────────────

  init() {
    if (!localStorage.getItem(this.KEYS.USERS)) {
      const users = {};

      // Admin from local-users.js if present (gitignored)
      if (typeof ITW_LOCAL_USERS !== 'undefined' && ITW_LOCAL_USERS.admin) {
        const a = ITW_LOCAL_USERS.admin;
        users[a.username.toLowerCase()] = {
          id: 'admin_001', username: a.username.toLowerCase(),
          displayName: a.displayName, email: a.email,
          password: a.password, isAdmin: true,
          createdAt: new Date().toISOString(), gamesPlayed: 0, totalScore: 0
        };
      }

      // Demo user from config
      const d = ITW_CONFIG.defaultDemo;
      users[d.username.toLowerCase()] = {
        id: 'demo_001', username: d.username.toLowerCase(),
        displayName: d.displayName, email: d.email,
        password: d.password, isAdmin: false,
        createdAt: new Date().toISOString(), gamesPlayed: 0, totalScore: 0
      };

      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }

    if (!localStorage.getItem(this.KEYS.SCORES)) {
      localStorage.setItem(this.KEYS.SCORES, JSON.stringify([]));
    }
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // ── Users ─────────────────────────────────────────────────────────────────

  getUsers() {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '{}');
  },

  saveUsers(users) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  },

  getUserByUsername(username) {
    return this.getUsers()[username.toLowerCase()] || null;
  },

  createUser(data) {
    const users = this.getUsers();
    const username = data.username.toLowerCase();
    if (users[username]) throw new Error('Username already taken');

    // First non-demo user becomes admin
    const realUsers = Object.values(users).filter(u => u.username !== ITW_CONFIG.defaultDemo.username);
    const isFirst = realUsers.length === 0;

    const user = {
      id: this.generateId(),
      username,
      displayName: data.displayName,
      email: data.email || '',
      password: data.password,
      isAdmin: data.isAdmin || isFirst,
      createdAt: new Date().toISOString(),
      gamesPlayed: 0,
      totalScore: 0
    };
    users[username] = user;
    this.saveUsers(users);
    return user;
  },

  updateUser(username, updates) {
    const users = this.getUsers();
    if (!users[username.toLowerCase()]) throw new Error('User not found');
    users[username.toLowerCase()] = { ...users[username.toLowerCase()], ...updates };
    this.saveUsers(users);
    return users[username.toLowerCase()];
  },

  getCurrentUser() {
    const u = localStorage.getItem(this.KEYS.CURRENT_USER);
    return u ? this.getUserByUsername(u) : null;
  },

  setCurrentUser(username) {
    localStorage.setItem(this.KEYS.CURRENT_USER, username.toLowerCase());
  },

  clearCurrentUser() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  },

  // ── Scores ────────────────────────────────────────────────────────────────

  getScores() {
    return JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '[]');
  },

  saveScores(scores) {
    localStorage.setItem(this.KEYS.SCORES, JSON.stringify(scores));
  },

  /**
   * Submit a score for the current logged-in user.
   * @param {string} gameId   - e.g. 'space-trader'
   * @param {string} gameName - display name
   * @param {number} score    - numeric score
   * @param {object} extra    - optional extra data (level, time, etc.)
   */
  submitScore(gameId, gameName, score, extra = {}) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const entry = {
      id: this.generateId(),
      username: user.username,
      displayName: user.displayName,
      gameId,
      gameName,
      score,
      extra,
      timestamp: new Date().toISOString()
    };

    const scores = this.getScores();
    scores.push(entry);
    this.saveScores(scores);

    // Update user stats
    this.updateUser(user.username, {
      gamesPlayed: (user.gamesPlayed || 0) + 1,
      totalScore:  (user.totalScore  || 0) + score
    });

    return entry;
  },

  /**
   * Get top N scores for a game.
   */
  getTopScores(gameId, limit = 10) {
    return this.getScores()
      .filter(s => s.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  /**
   * Get personal best for a user+game combo.
   */
  getPersonalBest(username, gameId) {
    const scores = this.getScores()
      .filter(s => s.username === username && s.gameId === gameId)
      .sort((a, b) => b.score - a.score);
    return scores[0] || null;
  },

  /**
   * Get all scores for a user, sorted newest first.
   */
  getUserScores(username) {
    return this.getScores()
      .filter(s => s.username === username)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  /**
   * Get global leaderboard across all games (best score per user per game).
   */
  getGlobalLeaderboard() {
    const scores = this.getScores();
    const best = {};
    scores.forEach(s => {
      const key = `${s.username}::${s.gameId}`;
      if (!best[key] || s.score > best[key].score) best[key] = s;
    });
    return Object.values(best).sort((a, b) => b.score - a.score);
  },

  // ── Export/Import ─────────────────────────────────────────────────────────

  exportData() {
    return {
      app: 'InThisWorld',
      version: ITW_CONFIG.version,
      users:  this.getUsers(),
      scores: this.getScores(),
      exportedAt: new Date().toISOString()
    };
  },

  importData(data) {
    if (data.users)  this.saveUsers(data.users);
    if (data.scores) this.saveScores(data.scores);
  }
};

ITWStorage.init();
window.ITWStorage = ITWStorage;
