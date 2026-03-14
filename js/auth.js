/**
 * InThisWorld — Auth Module
 */
const ITWAuth = {

  signup(displayName, username, email, password) {
    if (!displayName || displayName.length < 2) throw new Error('Display name must be at least 2 characters');
    if (!username || username.length < 3)       throw new Error('Username must be at least 3 characters');
    if (!/^[a-zA-Z0-9_]+$/.test(username))     throw new Error('Username can only contain letters, numbers, and underscores');
    if (!password || password.length < 6)       throw new Error('Password must be at least 6 characters');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');

    const user = ITWStorage.createUser({ displayName, username, email, password });
    ITWStorage.setCurrentUser(user.username);
    return user;
  },

  login(username, password) {
    if (!username || !password) throw new Error('Please enter username and password');
    const user = ITWStorage.getUserByUsername(username);
    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Incorrect password');
    ITWStorage.setCurrentUser(user.username);
    return user;
  },

  loginDemo() {
    const d = ITW_CONFIG.defaultDemo;
    // Ensure demo user has current password (re-seed if needed)
    let user = ITWStorage.getUserByUsername(d.username);
    if (user && user.password !== d.password) {
      ITWStorage.updateUser(d.username, { password: d.password });
    }
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
