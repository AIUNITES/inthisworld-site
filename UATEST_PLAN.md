# InThisWorld - UA Test Plan

## Site Information
| Field | Value |
|-------|-------|
| **Site Name** | InThisWorld |
| **Repository** | inthisworld-site |
| **Live URL** | https://aiunites.github.io/inthisworld-site/ |
| **Local Path** | C:/Users/Tom/Documents/GitHub/inthisworld-site |
| **Last Updated** | February 16, 2026 |
| **Version** | 3.0.0 |
| **Type** | Interactive 3D Platform |
| **Tagline** | Virtual World Sandbox — Games & Social Rooms |

---

## Pages Inventory

| Page | File | Description | Status |
|------|------|-------------|--------|
| Landing | index.html | Main landing page with games + rooms sections | ✅ Active |
| Games Hub | games/index.html | 3D games gallery + rooms cross-link | ✅ Active |
| Space Trader | games/space-trader.html | 3D space trading game (Three.js) | ✅ Active |
| World Explorer | games/world-explorer.html | 3D procedural terrain exploration (Three.js) | ✅ Active |
| Arena FPS | games/arena-fps.html | 3D wave-survival FPS (Three.js) | ✅ Active |
| Rooms Hub | rooms/index.html | 3D chat rooms gallery | ✅ Active |
| Living Room | rooms/living-room.html | 3D social room — cozy home (Three.js) | ✅ Active |
| Bedroom | rooms/bedroom.html | 3D social room — neon chill zone (Three.js) | ✅ Active |
| Gym | rooms/gym.html | 3D social room — fitness equipment (Three.js) | ✅ Active |
| Space Station | rooms/space-station.html | 3D social room — orbital lounge (Three.js) | ✅ Active |

---

## Features

### 🎨 Landing Page
| Feature | Status | Notes |
|---------|--------|-------|
| Hero Section | ✅ | Orbiting planet animation |
| Features Grid | ✅ | 6 feature cards |
| 3D Games Section | ✅ | Cards linking to 3 games |
| 3D Rooms Section | ✅ | Cards linking to 4 rooms |
| CTA Section | ✅ | |
| Footer | ✅ | |
| Dark Theme | ✅ | |
| Responsive Design | ✅ | |
| AIUNITES Webring | ✅ | |
| Nav link to Games | ✅ | Gold 🎮 Games link |
| Nav link to Rooms | ✅ | Gold 🏠 Rooms link |

### 🎮 3D Games (Three.js)
| Feature | Status | Notes |
|---------|--------|-------|
| Games Hub Page | ✅ | games/index.html — cards for all 3 games + rooms cross-link |
| Space Trader | ✅ | WASD+mouse flight, 8 planets, 8 commodities, buy/sell modal, minimap, fuel/cargo/credits |
| World Explorer | ✅ | FBM procedural terrain, 6 biomes, 12 artifacts, 300 trees, 80 rocks, compass, inventory |
| Arena FPS | ✅ | Raycast shooting, wave enemies, ammo/reload, hit markers, damage flash, kill feed, neon arena |

### 🏠 3D Chat Rooms (Three.js)
| Feature | Status | Notes |
|---------|--------|-------|
| Rooms Hub Page | ✅ | rooms/index.html — cards for all 4 rooms |
| Living Room | ✅ | Fireplace, sofa, bookshelf, coffee table, TV, armchair, plant, lamp, 3 NPCs, chat panel |
| Bedroom | ✅ | Bed, gaming desk, monitor, neon RGB strips, poster, closet, 2 NPCs, chat panel |
| Gym | ✅ | Bench press, squat rack, dumbbell rack, treadmill, punching bag, mats, kettlebells, mirror wall, 4 NPCs, chat panel |
| Space Station Lounge | ✅ | Circular room, panoramic space windows, starfield, nebulae, passing ships, planet below, hologram table, bar, curved seating, 5 NPCs, chat panel |

### 🏠 Room System — Shared Features
| Feature | Status | Notes |
|---------|--------|-------|
| First-person WASD+mouse | ✅ | Pointer lock, room-bounded movement |
| Chat panel (right sidebar) | ✅ | 320px panel with messages, input, send |
| NPC characters | ✅ | Wander, idle bob, name tags, periodic messages |
| NPC chat responses | ✅ | NPCs respond to player messages |
| System messages | ✅ | Join notifications, welcome messages |
| T key to focus chat | ✅ | Exits pointer lock, focuses input |
| Splash screen | ✅ | Room preview, controls, enter button |
| Back navigation | ✅ | Links to hub pages |
| Mobile responsive | ✅ | Chat panel moves to bottom 40% on mobile |
| Room-specific theming | ✅ | Warm amber/Indigo neon/Red energy/Cyan space |

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
| Add more 3D rooms | Low | 🔲 TODO |
| Add more 3D games | Low | 🔲 TODO |
| Multiplayer chat (real-time) | Low | 🔲 TODO |

---

## Legal Compliance (Feb 15, 2026)
| Feature | Status | Notes |
|---------|--------|-------|
| Single footer (no duplicates) | ✅ | All pages |
| Footer disclaimer text | ✅ | |
| Footer copyright + AIUNITES link | ✅ | |
| Privacy Policy → legal.html#privacy | ✅ | Centralized — all hub pages |
| Terms of Service → legal.html#terms | ✅ | Centralized — all hub pages |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 24, 2026 | Initial landing page |
| 2.0.0 | Feb 15, 2026 | Attempted 3D games (files not persisted) |
| 2.1.0 | Feb 16, 2026 | Rebuilt 3 games via MCP: Space Trader, World Explorer, Arena FPS + games hub |
| 3.0.0 | Feb 16, 2026 | Added 4 3D chat rooms: Living Room, Bedroom, Gym, Space Station Lounge. Rooms hub, index integration, games↔rooms cross-linking |
| 3.0.1 | Feb 22, 2026 | Webring highlight fix: standardized to .aiunites-bar-active class with white (#fff) + underline styling |

---

*Last tested: February 22, 2026*