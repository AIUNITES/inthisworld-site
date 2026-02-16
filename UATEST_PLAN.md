# InThisWorld - UA Test Plan

## Site Information
| Field | Value |
|-------|-------|
| **Site Name** | InThisWorld |
| **Repository** | inthisworld-site |
| **Live URL** | https://aiunites.github.io/inthisworld-site/ |
| **Local Path** | C:/Users/Tom/Documents/GitHub/inthisworld-site |
| **Last Updated** | February 16, 2026 |
| **Version** | 2.1.0 |
| **Type** | Landing Page |
| **Tagline** | World Content Platform |

---

## Pages Inventory

| Page | File | Description | Status |
|------|------|-------------|--------|
| Landing | index.html | Main landing page | ✅ Active |
| Games Hub | games/index.html | 3D games gallery with cards | ✅ Active |
| Space Trader | games/space-trader.html | 3D space trading game (Three.js) | ✅ Active |
| World Explorer | games/world-explorer.html | 3D procedural terrain exploration (Three.js) | ✅ Active |
| Arena FPS | games/arena-fps.html | 3D wave-survival FPS (Three.js) | ✅ Active |

---

## Features

### 🎨 Landing Page
| Feature | Status | Notes |
|---------|--------|-------|
| Hero Section | ✅ | |
| Features Grid | ✅ | |
| 3D Games Section | ✅ | Cards linking to 3 games |
| CTA Section | ✅ | |
| Footer | ✅ | |
| Dark Theme | ✅ | |
| Responsive Design | ✅ | |
| AIUNITES Webring | ✅ | |
| Nav link to Games | ✅ | Gold 🎮 3D Games link |

### 🎮 3D Games (Three.js)
| Feature | Status | Notes |
|---------|--------|-------|
| Games Hub Page | ✅ | games/index.html with cards for all 3 games, AIUNITES webring |
| Space Trader | ✅ | WASD+mouse flight, 8 planets, 8 commodities, buy/sell modal, minimap, fuel/cargo/credits |
| World Explorer | ✅ | FBM procedural terrain, 6 biomes, 12 artifacts, 300 trees, 80 rocks, compass, inventory |
| Arena FPS | ✅ | Raycast shooting, wave enemies, ammo/reload, hit markers, damage flash, kill feed, neon arena |

### 👤 User System (DemoTemplate Features)
| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ⬜ | NOT IMPLEMENTED |
| User Dropdown Menu | ⬜ | NOT IMPLEMENTED |
| Settings Modal | ⬜ | NOT IMPLEMENTED |
| Admin Panel Modal | ⬜ | NOT IMPLEMENTED |

### ☁️ Cloud Integration
| Feature | Status | Notes |
|---------|--------|-------|
| CloudDB Module | ✅ | js/cloud-database.js |

---

## Priority Actions (TODO)

| Action | Priority | Status |
|--------|----------|--------|
| Add full DemoTemplate features | Medium | 🔲 TODO |
| Add more 3D games | Low | 🔲 TODO |

---

## Legal Compliance (Feb 15, 2026)
| Feature | Status | Notes |
|---------|--------|-------|
| Single footer (no duplicates) | ✅ | |
| Footer disclaimer text | ✅ | |
| Footer copyright + AIUNITES link | ✅ | |
| Privacy Policy → legal.html#privacy | ✅ | Centralized |
| Terms of Service → legal.html#terms | ✅ | Centralized |

---

## Version History

| Version | Date | Changes |
|---------|------|--------|
| 1.0.0 | Jan 24, 2026 | Initial landing page |
| 2.0.0 | Feb 15, 2026 | Added 3D games section to landing page (aborted — files not persisted) |
| 2.1.0 | Feb 16, 2026 | Rebuilt 3 games via MCP: Space Trader, World Explorer, Arena FPS + games hub. Fixed nav/link references |

*Last tested: February 16, 2026*
