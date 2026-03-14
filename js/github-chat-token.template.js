/**
 * InThisWorld — GitHub Chat Token
 * ================================
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
 * 2. Click "Generate new token"
 * 3. Settings:
 *    - Token name: InThisWorld Chat Bot
 *    - Expiration: No expiration (or 1 year)
 *    - Repository access: Only select repositories → AIUNITES/inthisworld-site
 *    - Permissions: Issues → Read and write  (everything else: No access)
 * 4. Copy the generated token (starts with github_pat_...)
 * 5. Copy THIS file to:  js/github-chat-token.js
 * 6. Replace PASTE_YOUR_TOKEN_HERE below with your actual token
 * 7. js/github-chat-token.js is gitignored — it will NOT be committed
 *
 * IMPORTANT: The token will be visible in the deployed GitHub Pages site JS.
 * This is acceptable because it can ONLY create comments on issues in one
 * public repo. Worst case = spam comments you can delete. Rotate if abused.
 *
 * ROOM ISSUE NUMBERS:
 * After running the setup, replace the issue numbers below with the actual
 * issue numbers created in the inthisworld-site repo.
 * Run this in browser console to create them:
 *   GitHubChat.setupRooms()
 */

window.ITW_GH_TOKEN = 'PASTE_YOUR_TOKEN_HERE';

// Issue numbers for each chat room — filled in after setupRooms() runs
window.ITW_GH_ROOMS = {
  general:    0,   // replace with actual issue number
  games:      0,
  worlds:     0,
  help:       0,
  offtopic:   0
};
