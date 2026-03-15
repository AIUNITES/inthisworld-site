/**
 * InThisWorld — Auth Module
 */
const ITWAuth = {

  async signup(displayName, username, email, password) {
    if (!displayName || displayName.length < 2) throw new Error('Display name must be at least 2 characters');
    if (!username || username.length < 3)       throw new Error('Username must be at least 3 characters');
    if (!/^[a-zA-Z0-9_]+$/.test(username))     throw new Error('Username can only contain letters, numbers, and underscores');
    if (!password || password.length < 6)       throw new Error('Password must be at least 6 characters');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');

    const passwordHash = await PasswordUtils.hash(password);
    const user = ITWStorage.createUser({ displayName, username, email, passwordHash });
    ITWStorage.setCurrentUser(user.username);
    return user;
  },

  async login(username, password) {
    if (!username || !password) throw new Error('Please enter username and password');
    const user = ITWStorage.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    let valid = false;
    if (user.passwordHash) {
      valid = await PasswordUtils.verify(password, user.passwordHash);
    } else if (user.password) {
      // Legacy migration
      valid = (user.password === password);
      if (valid) {
        const migrated = await PasswordUtils.migrate(user, password);
        ITWStorage.updateUser(user.username, migrated);
      }
    }
    if (!valid) throw new Error('Incorrect password');
    ITWStorage.setCurrentUser(user.username);
    return ITWStorage.getUserByUsername(user.username);
  },

  async loginDemo() {
    const d = ITW_CONFIG.defaultDemo;
    // Ensure demo user has current password (re-seed if needed)
    // loginDemo is now async — just call login which handles migration
    return this.login(d.username, d.password);
  },

  logout() {
    ITWStorage.clearCurrentUser();
  },

  isLoggedIn() {
    return ITWStorage.getCurrentUser() !== null;
  },

  getCurrentUser() {
    return ITWStorage.getCurrentUser();
  },

  isAdmin() {
    return this.getCurrentUser()?.isAdmin === true;
  },

  // Convenience wrapper — games call this
  submitScore(gameId, gameName, score, extra = {}) {
    return ITWStorage.submitScore(gameId, gameName, score, extra);
  }
};

window.ITWAuth = ITWAuth;
