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
| **Type** | Landing Page + 3D Games + Chat Rooms |
| **Tagline** | Virtual World Sandbox |

---

## Pages Inventory

| Page | File | Description | Status |
|------|------|-------------|--------|
| Landing | index.html | Main landing page with games + rooms sections | ✅ Active |
| Games Hub | games/index.html | 3D games gallery with cards | ✅ Active |
| Space Trader | games/space-trader.html | 3D space trading game (Three.js) | ✅ Active |
| World Explorer | games/world-explorer.html | 3D procedural terrain exploration (Three.js) | ✅ Active |
| Arena FPS | games/arena-fps.html | 3D wave-survival FPS (Three.js) | ✅ Active |
| Rooms Hub | rooms/index.html | 3D chat rooms gallery with cards | ✅ Active |
| Living Room | rooms/living-room.html | 3D living room with chat + NPCs | ✅ Active |
| Bedroom | rooms/bedroom.html | 3D bedroom with chat + NPCs | ✅ Active |
| Gym | rooms/gym.html | 3D gym with chat + NPCs | ✅ Active |

---

## Features

### 🎨 Landing Page
| Feature | Status | Notes |
|---------|--------|-------|
| Hero Section | ✅ | Orbiting planet animation |
| Features Grid | ✅ | 6 feature cards |
| 3D Games Section | ✅ | Cards linking to 3 games |
| 3D Rooms Section | ✅ | Cards linking to 3 chat rooms |
| CTA Section | ✅ | Join Waitlist |
| Footer | ✅ | Legal links centralized |
| Dark Theme | ✅ | |
| Responsive Design | ✅ | |
| AIUNITES Webring | ✅ | |
| Nav link to Games | ✅ | Gold 🎮 Games link |
| Nav link to Rooms | ✅ | Gold 🏠 Rooms link |

### 🎮 3D Games (Three.js)
| Feature | Status | Notes |
|---------|--------|-------|
| Games Hub Page | ✅ | games/index.html — cards, webring, cross-links to rooms |
| **Space Trader** | ✅ | |
| ↳ WASD+mouse flight | ✅ | First-person space navigation |
| ↳ 8 planets with types | ✅ | Capital, ice, agri, mining, tech, luxury, medical, outpost |
| ↳ 8 commodities | ✅ | Crystals, fuel cells, food, metals, tech parts, medicine, textiles, luxuries |
| ↳ Dynamic pricing | ✅ | Planet type modifiers + volatility |
| ↳ Buy/sell trade modal | ✅ | Profit/loss display, sell all |
| ↳ Minimap | ✅ | Player arrow + planet dots |
| ↳ Fuel/cargo/credits HUD | ✅ | |
| ↳ Fuel regen near planets | ✅ | |
| **World Explorer** | ✅ | |
| ↳ FBM procedural terrain | ✅ | Height-based biomes |
| ↳ 6 biomes | ✅ | Ocean, beach, grass, forest, mountain, snow |
| ↳ 12+ artifacts to find | ✅ | Collectible items scattered |
| ↳ 300+ trees, 80+ rocks | ✅ | Procedural placement |
| ↳ Compass HUD | ✅ | |
| ↳ Inventory system | ✅ | |
| **Arena FPS** | ✅ | |
| ↳ Raycast shooting | ✅ | Click to fire |
| ↳ Wave-based enemies | ✅ | Escalating difficulty |
| ↳ Ammo/reload system | ✅ | R to reload |
| ↳ Hit markers + damage flash | ✅ | |
| ↳ Kill feed | ✅ | |
| ↳ Neon arena environment | ✅ | |

### 🏠 3D Chat Rooms (Three.js)
| Feature | Status | Notes |
|---------|--------|-------|
| Rooms Hub Page | ✅ | rooms/index.html — cards, webring, cross-links to games |
| **Living Room** | ✅ | |
| ↳ First-person WASD+mouse | ✅ | Pointer lock controls |
| ↳ Room bounds collision | ✅ | Can't walk through walls |
| ↳ Sofa, coffee table, armchair | ✅ | Furniture geometry |
| ↳ Fireplace with ember glow | ✅ | Flickering point light |
| ↳ Bookshelf with books | ✅ | 5 shelves × 4 books |
| ↳ TV area + lamp + plant | ✅ | |
| ↳ Warm ambient lighting | ✅ | Orange/purple point lights |
| ↳ Chat panel (right side) | ✅ | Real-time message display |
| ↳ 3 NPCs with name tags | ✅ | Alex, Morgan, Riley |
| ↳ NPC wandering + idle bob | ✅ | Random movement targets |
| ↳ NPC auto-chat | ✅ | Periodic messages |
| ↳ NPC responds to player | ✅ | Context-aware replies |
| ↳ T key to focus chat | ✅ | |
| ↳ System messages on join | ✅ | |
| **Bedroom** | ✅ | |
| ↳ Neon mood lighting | ✅ | Indigo + pink point lights |
| ↳ RGB ceiling light strips | ✅ | Emissive accent bars |
| ↳ Bed with pillows/duvet | ✅ | |
| ↳ Gaming desk + monitor | ✅ | Emissive screen glow |
| ↳ Keyboard, mouse, chair | ✅ | |
| ↳ Nightstand with lamp | ✅ | |
| ↳ Poster, rug, closet | ✅ | |
| ↳ Chat panel + 2 NPCs | ✅ | Jordan, Casey |
| ↳ Neon pulse animation | ✅ | Light intensity oscillation |
| **Gym** | ✅ | |
| ↳ Larger room (16×10) | ✅ | More space for equipment |
| ↳ Bench press station | ✅ | Bench + uprights + bar + plates |
| ↳ Squat rack | ✅ | Uprights + safety bars + loaded bar |
| ↳ Dumbbell rack (12 dumbbells) | ✅ | 3 rows × 4 columns |
| ↳ Treadmill with console | ✅ | Emissive screen |
| ↳ Punching bag | ✅ | Hanging from ceiling |
| ↳ Kettlebells, exercise mats | ✅ | Floor items |
| ↳ Mirror wall | ✅ | High metalness reflective surface |
| ↳ Motivational wall sign | ✅ | Red emissive |
| ↳ Water cooler | ✅ | |
| ↳ Chat panel + 4 NPCs | ✅ | Marcus, Tasha, Dev, Sam |
| ↳ Overhead fluorescent strips | ✅ | 5 point lights |

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
| Add more rooms (kitchen, office, etc.) | Low | 🔲 TODO |
| Add multiplayer via WebRTC/WebSocket | Low | 🔲 TODO |
| Persistent chat via localStorage | Low | 🔲 TODO |

---

## Legal Compliance (Feb 15, 2026)
| Feature | Status | Notes |
|---------|--------|-------|
| Single footer (no duplicates) | ✅ | |
| Footer disclaimer text | ✅ | |
| Footer copyright + AIUNITES link | ✅ | |
| Privacy Policy → legal.html#privacy | ✅ | Centralized |
| Terms of Service → legal.html#terms | ✅ | Centralized |
| Games hub legal links | ✅ | |
| Rooms hub legal links | ✅ | |

---

## Version History

| Version | Date | Changes |
|---------|------|--------|
| 1.0.0 | Jan 24, 2026 | Initial landing page |
| 2.0.0 | Feb 15, 2026 | Added 3D games section to landing page (aborted — files not persisted) |
| 2.1.0 | Feb 16, 2026 | Rebuilt 3 games via MCP: Space Trader, World Explorer, Arena FPS + games hub |
| 3.0.0 | Feb 16, 2026 | Added 3D Chat Rooms: Living Room, Bedroom, Gym + rooms hub. Nav + index updated |

---

## Status Legend
- ✅ Implemented and tested
- ⬜ Not implemented
- 🔲 TODO
- ⚠️ Partial/Issues
- ❌ Deprecated/Removed

---

*Last tested: February 16, 2026*