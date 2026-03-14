/**
 * InThisWorld — Auth Configuration
 * Storage prefix: itw
 */
const ITW_CONFIG = {
  name: 'InThisWorld',
  version: '1.0.0',
  storagePrefix: 'itw',

  defaultDemo: {
    username: 'explorer',
    password: 'demo123',
    displayName: 'Explorer',
    email: 'demo@inthisworld.com',
    isAdmin: false
  },

  // Games registry — used for leaderboard display
  games: [
    { id: 'space-trader',    name: 'Space Trader',   icon: '🚀', url: 'games/space-trader.html' },
    { id: 'world-explorer',  name: 'World Explorer', icon: '🌍', url: 'games/world-explorer.html' },
    { id: 'arena-fps',       name: 'Arena FPS',      icon: '💀', url: 'games/arena-fps.html' },
    { id: 'pirate-battle',   name: 'Pirate Battle',  icon: '⚓', url: 'games/pirate-battle.html' }
  ],

  theme: {
    primary:  '#8b5cf6',
    accent:   '#6366f1',
    cyan:     '#06b6d4',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  }
};

window.ITW_CONFIG = ITW_CONFIG;
