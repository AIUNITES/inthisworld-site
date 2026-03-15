/**
 * InThisWorld — GitHub Issues Chat Backend
 * ==========================================
 * Replaces localStorage ChatStore with GitHub Issues API.
 * Each chat room = one pinned Issue. Each message = one Comment on that Issue.
 *
 * Message comment body format (JSON):
 *   {"u":"username","d":"DisplayName","t":1234567890123,"text":"hello world"}
 *   {"u":"username","d":"DisplayName","t":1234567890123,"type":"score","game":"Space Trader","score":42500}
 *   {"type":"system","text":"Explorer joined the room"}
 *
 * Reads: unauthenticated (60 req/hr per IP) — cached in localStorage
 * Writes: token in js/github-chat-token.js (gitignored)
 *
 * Setup: copy github-chat-token.template.js → github-chat-token.js
 *        fill in your token, then call GitHubChat.setupRooms() once
 */

const GitHubChat = {
  REPO:       'AIUNITES/inthisworld-site',
  BASE:       'https://api.github.com',
  CACHE_KEY:  'itw_gh_chat_cache',
  ONLINE_KEY: 'itw_chat_online',
  POLL_MS:    15000,   // 15s — respectful to GH rate limits
  PER_PAGE:   50,      // comments per fetch

  // ── Token & room config (from gitignored js/github-chat-token.js) ─────────

  get token() {
    const t = window.ITW_GH_TOKEN || '';
    return (t && t !== 'PASTE_YOUR_TOKEN_HERE') ? t : null;
  },

  get roomIssues() {
    return window.ITW_GH_ROOMS || {};
  },

  isConfigured() {
    const rooms = this.roomIssues;
    return !!(this.token && Object.values(rooms).some(n => n > 0));
  },

  // ── Room definitions (mirrors ChatStore.getRooms) ────────────────────────

  getRooms() {
    return [
      { id: 'general',  icon: '🌍', name: 'General',       desc: 'Open chat for everyone' },
      { id: 'games',    icon: '🎮', name: 'Games',          desc: 'Tips, scores, strategies' },
      { id: 'worlds',   icon: '🏗️', name: 'World Building', desc: 'Share your creations' },
      { id: 'help',     icon: '🆘', name: 'Help & Support', desc: 'Got questions? Ask here' },
      { id: 'offtopic', icon: '☕', name: 'Off Topic',       desc: 'Anything goes' }
    ];
  },

  // ── Cache helpers ─────────────────────────────────────────────────────────

  getCache() {
    try { return JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}'); } catch { return {}; }
  },

  setCache(cache) {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
  },

  getCachedMessages(roomId) {
    return this.getCache()[roomId]?.messages || [];
  },

  setCachedMessages(roomId, messages, lastFetched) {
    const cache = this.getCache();
    cache[roomId] = { messages, lastFetched: lastFetched || Date.now() };
    this.setCache(cache);
  },

  getLastFetched(roomId) {
    return this.getCache()[roomId]?.lastFetched || 0;
  },

  // ── GitHub API ────────────────────────────────────────────────────────────

  headers(write = false) {
    const h = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    if (write && this.token) h['Authorization'] = `Bearer ${this.token}`;
    else if (this.token)     h['Authorization'] = `Bearer ${this.token}`; // helps rate limit even on reads
    return h;
  },

  async fetchComments(issueNumber, since = null) {
    if (!issueNumber || issueNumber === 0) return [];
    let url = `${this.BASE}/repos/${this.REPO}/issues/${issueNumber}/comments?per_page=${this.PER_PAGE}&sort=created&direction=asc`;
    if (since) url += `&since=${new Date(since).toISOString()}`;
    try {
      const r = await fetch(url, { headers: this.headers() });
      if (!r.ok) {
        if (r.status === 403) console.warn('[GitHubChat] Rate limited — using cached messages');
        return null; // null = use cache
      }
      return await r.json();
    } catch (e) {
      console.warn('[GitHubChat] Fetch failed:', e.message);
      return null;
    }
  },

  async postComment(issueNumber, body) {
    if (!issueNumber || issueNumber === 0) return null;
    if (!this.token) {
      console.error('[GitHubChat] No token — cannot post message');
      return null;
    }
    try {
      const r = await fetch(`${this.BASE}/repos/${this.REPO}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: { ...this.headers(true), 'Content-Type': 'application/json' },
        body: JSON.stringify({ body })
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${r.status}`);
      }
      return await r.json();
    } catch (e) {
      console.error('[GitHubChat] Post failed:', e.message);
      return null;
    }
  },

  // ── Message parsing ───────────────────────────────────────────────────────

  parseComment(comment) {
    try {
      const data = JSON.parse(comment.body);
      return {
        id:          comment.id,
        ghUrl:       comment.html_url,
        type:        data.type || 'text',
        username:    data.u || 'unknown',
        displayName: data.d || data.u || 'Unknown',
        text:        data.text || '',
        score:       data.score,
        gameName:    data.game,
        ts:          data.t || new Date(comment.created_at).getTime()
      };
    } catch {
      // Fallback: treat raw comment body as plain text (for manually created comments)
      return {
        id:          comment.id,
        ghUrl:       comment.html_url,
        type:        'text',
        username:    comment.user?.login || 'github',
        displayName: comment.user?.login || 'GitHub User',
        text:        comment.body,
        ts:          new Date(comment.created_at).getTime()
      };
    }
  },

  encodeMessage(data) {
    return JSON.stringify(data);
  },

  // ── Public API (mirrors ChatStore) ───────────────────────────────────────

  async getMessages(roomId) {
    const issueNum = this.roomIssues[roomId];
    if (!issueNum) return this.getCachedMessages(roomId); // fallback to local

    const lastFetched = this.getLastFetched(roomId);
    const stale = Date.now() - lastFetched > this.POLL_MS;

    if (!stale) return this.getCachedMessages(roomId);

    // Incremental fetch: only get new comments since last fetch
    const since = lastFetched > 0 ? lastFetched - 5000 : null; // 5s overlap to avoid gaps
    const comments = await this.fetchComments(issueNum, since);

    if (comments === null) return this.getCachedMessages(roomId); // rate limited, use cache

    const newMessages = comments.map(c => this.parseComment(c));

    if (since) {
      // Merge with existing cache (avoid duplicates by id)
      const existing = this.getCachedMessages(roomId);
      const existingIds = new Set(existing.map(m => m.id));
      const merged = [...existing, ...newMessages.filter(m => !existingIds.has(m.id))];
      merged.sort((a, b) => a.ts - b.ts);
      const trimmed = merged.slice(-200);
      this.setCachedMessages(roomId, trimmed);
      return trimmed;
    } else {
      const trimmed = newMessages.slice(-200);
      this.setCachedMessages(roomId, trimmed);
      return trimmed;
    }
  },

  async addMessage(roomId, msgData) {
    const issueNum = this.roomIssues[roomId];

    // Always add to local cache immediately (optimistic update)
    const localMsg = {
      id:          `local_${Date.now()}`,
      type:        msgData.type || 'text',
      username:    msgData.username,
      displayName: msgData.displayName,
      text:        msgData.text || '',
      score:       msgData.score,
      gameName:    msgData.gameName,
      ts:          msgData.ts || Date.now(),
      pending:     true
    };
    const cached = this.getCachedMessages(roomId);
    cached.push(localMsg);
    this.setCachedMessages(roomId, cached.slice(-200));

    if (!issueNum || !this.token) {
      // No GH config — just localStorage
      if (!this.token) ITWUI?.showToast('Chat not connected to GitHub — message saved locally only.', 4000);
      return localMsg;
    }

    // Build comment body
    const payload = { u: msgData.username, d: msgData.displayName, t: msgData.ts || Date.now() };
    if (msgData.type === 'score') {
      payload.type = 'score'; payload.game = msgData.gameName; payload.score = msgData.score;
    } else {
      payload.text = msgData.text;
    }

    const result = await this.postComment(issueNum, this.encodeMessage(payload));

    if (result) {
      // Replace optimistic message with real one from GH
      const messages = this.getCachedMessages(roomId);
      const idx = messages.findIndex(m => m.id === localMsg.id);
      if (idx >= 0) {
        messages[idx] = this.parseComment(result);
        this.setCachedMessages(roomId, messages);
      }
    } else {
      ITWUI?.showToast('⚠️ Message saved locally — GitHub sync failed.', 4000);
    }

    return result ? this.parseComment(result) : localMsg;
  },

  getMessageCount(roomId) {
    return this.getCachedMessages(roomId).length;
  },

  // ── Online presence (stays localStorage — no GH needed) ──────────────────

  heartbeat(username, displayName) {
    const online = JSON.parse(localStorage.getItem(this.ONLINE_KEY) || '{}');
    online[username] = { displayName, ts: Date.now() };
    localStorage.setItem(this.ONLINE_KEY, JSON.stringify(online));
  },

  getOnlineUsers() {
    const online = JSON.parse(localStorage.getItem(this.ONLINE_KEY) || '{}');
    const cutoff = Date.now() - 90000;
    return Object.entries(online)
      .filter(([, v]) => v.ts > cutoff)
      .map(([username, v]) => ({ username, displayName: v.displayName }));
  },

  clearStale() {
    const online = JSON.parse(localStorage.getItem(this.ONLINE_KEY) || '{}');
    const cutoff = Date.now() - 90000;
    Object.keys(online).forEach(k => { if (online[k].ts < cutoff) delete online[k]; });
    localStorage.setItem(this.ONLINE_KEY, JSON.stringify(online));
  },

  // ── One-time setup: create the 5 room issues ─────────────────────────────

  async setupRooms() {
    if (!this.token) {
      console.error('[GitHubChat] setupRooms: No token. Set window.ITW_GH_TOKEN first.');
      return;
    }
    console.log('[GitHubChat] Creating room issues...');
    const rooms = this.getRooms();
    const results = {};

    for (const room of rooms) {
      try {
        const r = await fetch(`${this.BASE}/repos/${this.REPO}/issues`, {
          method: 'POST',
          headers: { ...this.headers(true), 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `[Chat Room] ${room.name}`,
            body:  `## ${room.icon} ${room.name}\n\n${room.desc}\n\n> This issue is the chat room backend for InThisWorld. Each comment is a chat message. Do not close this issue.\n\n**Room ID:** \`${room.id}\``,
            labels: ['chat-room']
          })
        });
        if (r.ok) {
          const issue = await r.json();
          results[room.id] = issue.number;
          console.log(`[GitHubChat] ✅ ${room.name} → Issue #${issue.number}`);
        } else {
          const err = await r.json().catch(() => ({}));
          console.error(`[GitHubChat] ❌ ${room.name}: ${err.message}`);
        }
        // Small delay between requests
        await new Promise(res => setTimeout(res, 500));
      } catch (e) {
        console.error(`[GitHubChat] ❌ ${room.name}:`, e.message);
      }
    }

    console.log('\n[GitHubChat] ✅ Setup complete. Add these to github-chat-token.js:');
    console.log('window.ITW_GH_ROOMS = ' + JSON.stringify(results, null, 2) + ';');
    return results;
  },

  // ── Status check ─────────────────────────────────────────────────────────

  async checkStatus() {
    const r = await fetch(`${this.BASE}/rate_limit`, { headers: this.headers() }).then(r => r.json()).catch(() => null);
    const rooms = this.roomIssues;
    const configuredRooms = Object.entries(rooms).filter(([, n]) => n > 0);
    console.log('[GitHubChat] Status:');
    console.log('  Token present:', !!this.token);
    console.log('  Rooms configured:', configuredRooms.length + '/5');
    configuredRooms.forEach(([id, num]) => console.log(`    ${id}: #${num}`));
    if (r?.rate) console.log(`  API rate limit: ${r.rate.remaining}/${r.rate.limit} remaining`);
    return { token: !!this.token, rooms: configuredRooms.length, rateLimit: r?.rate };
  }
};

window.GitHubChat = GitHubChat;
