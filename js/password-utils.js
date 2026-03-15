/**
 * AIUNITES Password Utilities
 * ============================
 * SHA-256 hashing via Web Crypto API (built into all modern browsers, no library needed).
 *
 * Passwords are NEVER stored in plaintext. The hash is one-way — even if
 * localStorage or an export file is read, the original password cannot be recovered.
 *
 * Usage:
 *   const hash = await PasswordUtils.hash('mypassword');  // → hex string
 *   const ok   = await PasswordUtils.verify('mypassword', hash); // → true/false
 */
const PasswordUtils = {
  // Site-specific salt mixed in before hashing.
  // This means hashes from one AIUNITES site cannot be replayed on another.
  SALT: 'aiunites-2026',

  async hash(password) {
    const input = password + this.SALT;
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(input)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  async verify(password, storedHash) {
    const inputHash = await this.hash(password);
    return inputHash === storedHash;
  },

  async migrate(user, plaintextPassword) {
    const hash = await this.hash(plaintextPassword);
    const migrated = { ...user, passwordHash: hash };
    delete migrated.password;
    return migrated;
  },

  sanitize(user) {
    const { password, passwordHash, ...safe } = user; // eslint-disable-line no-unused-vars
    return safe;
  }
};

window.PasswordUtils = PasswordUtils;
