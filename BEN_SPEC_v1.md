# BEN — Building/Environment Notation
## Specification v1.0.0

**Protocol family:** VWN (Virtual World Notation)
**Umbrella:** VWN, peer to VMN and ENS
**Maintained by:** AIUNITES LLC
**Published:** 2026-04-03
**Status:** ACTIVE
**Primary platform:** InThisWorld (inthisworld.com) / Second Life / OpenSim

© 2026 AIUNITES LLC. All Rights Reserved. DMCA Protected.
BEN, the BEN Symbol Set, the BEN-LSL bridge mapping tables, and all original
frameworks in this document are original works of AIUNITES LLC.
Published freely for educational and professional use.

---

## 1. Overview

BEN (Building/Environment Notation) is the AIUNITES open protocol for encoding
the behavioral state of built structures and interactive spaces as plain text.
It is one of three sub-protocols under VWN (Virtual World Notation), alongside
VMN (vehicles) and ENS (environment).

BEN does NOT describe geometry. OpenUSD Core Specification 1.0 (Alliance for
OpenUSD, December 2025) owns the geometry layer — mesh, materials, scene
composition. BEN describes what structures DO: lock states, light states,
trigger zones, physics properties, sound triggers, access controls, and
interactive object behaviors. These are entirely different layers.

A room rendered in OpenUSD has walls, a floor, a ceiling, a door mesh.
BEN answers: is the door locked? Are the lights on and at what brightness?
Is there a proximity sensor at the entrance? What happens when someone sits
in the chair? OpenUSD cannot answer any of these questions.

### 1.1 Relation to other VWN protocols

```
VWN scene string example — a locked room on a boat at dusk:

@VMN(Sea) @ATT(Rol=-5,Yaw=180) @VEL(Fwd=8)          (VMN: the boat moving)
@BEN(Struct:Cabin) @OBJ(Door.Main:Locked=true)        (BEN: cabin door locked)
@OBJ(Light.Ceil:On=true,Dim=0.6,Temp=2700K)          (BEN: warm ceiling light)
@ENS(Time:18:45,Sky:Sunset,Wind=<4,0,0>)              (ENS: dusk, light breeze)
```

Three protocols, one string, one moment. No other notation system captures
building behavior, vehicle motion, and environment state simultaneously.

### 1.2 Use cases

- VR architecture walkthroughs with scripted interactive elements
- Escape room design: puzzle state notation
- Virtual open houses: room configuration logging
- SL/OpenSim scripted environments: formal state documentation
- Smart home simulation: device state capture
- Game level design: object state at a given game checkpoint
- Accessibility documentation: what is accessible, locked, or triggered

---

## 2. Design Principles

**2.1 State not commands** — BEN describes the CURRENT STATE of objects,
not commands to achieve that state. `@OBJ(Door:Locked=true)` says the door
IS locked, not "lock the door."

**2.2 Object-first** — Every BEN string begins with a structure context
(@BEN) and then addresses objects (@OBJ) within it.

**2.3 LSL bridge** — Every BEN tag has a defined LSL mapping. The bridge
is complete for the tags defined in this specification.

**2.4 Composable** — BEN strings compose freely with VMN and ENS in a
single VWN scene string.

---

## 3. Structure Classes

The @BEN() tag declares the structural context. Everything that follows
describes objects within that structure.

| Class | @BEN() | Description |
|-------|--------|-------------|
| Generic structure | @BEN(Struct) | Any built structure |
| House | @BEN(Struct:House) | Residential building |
| Apartment | @BEN(Struct:Apt) | Apartment unit |
| Office | @BEN(Struct:Office) | Office or commercial space |
| Shop | @BEN(Struct:Shop) | Retail or market space |
| Cabin | @BEN(Struct:Cabin) | Small enclosed space (boat, mountain) |
| Bridge | @BEN(Struct:Bridge) | Span structure |
| Tunnel | @BEN(Struct:Tunnel) | Underground passage |
| Room | @BEN(Struct:Room) | Single room context |
| Corridor | @BEN(Struct:Corridor) | Passageway or hallway |
| Outdoor | @BEN(Struct:Outdoor) | Open-air structured space (plaza, park) |
| Platform | @BEN(Struct:Platform) | Elevated platform or deck |

Optional parameters on @BEN():
- Floors: number of floors (e.g., Floors=3)
- Area: floor area in square meters (e.g., Area=120)
- Name: identifier string (e.g., Name=EastWing)

```
@BEN(Struct:House,Floors=2,Area=180,Name=MainResidence)
```

---

## 4. Core Tag Reference

### 4.1 @OBJ() — Object state

The primary BEN tag. Describes the behavioral state of a named interactive object.

```
@OBJ(ObjectName:Key=value,Key=value,...)
```

Object names use dot notation for hierarchy:
- `Door.Front` — front door
- `Door.Back` — back door
- `Door.Room.1` — room door number 1
- `Light.Ceil` — ceiling light
- `Light.Lamp.N` — lamp, north side
- `Win.E` — window, east side
- `Lift` — elevator/lift
- `Switch.Main` — main switch

### 4.2 Object property keys

#### Access and lock state
| Key | Values | Meaning |
|-----|--------|---------|
| Locked | true/false | Lock state |
| Access | Open/Closed/Restricted | Access level |
| Owner | string | Owner UUID or name |
| Group | string | Group access name |
| Public | true/false | Public access enabled |

LSL: `llSetStatus(STATUS_BLOCK_GRAB, true)`, `llAllowInventoryDrop(false)`,
custom access check via `llRequestAgentData()`

#### Light state
| Key | Values | Meaning |
|-----|--------|---------|
| On | true/false | Light on or off |
| Dim | 0.0–1.0 | Brightness |
| Temp | 1800K–6500K | Color temperature |
| Color | R,G,B (0.0–1.0) | RGB color override |
| Radius | meters | Light radius |
| Falloff | 0.0–1.0 | Light falloff |

LSL: `llSetPrimitiveParams([PRIM_POINT_LIGHT, On, Color, intensity, radius, falloff])`

#### Physics state
| Key | Values | Meaning |
|-----|--------|---------|
| Phys | true/false | Physics enabled |
| Grav | 0.0–1.0 | Gravity multiplier |
| Col | true/false | Collision enabled |
| Buoy | 0.0–2.0 | Buoyancy override |
| Phantom | true/false | Phantom (no collision) |

LSL: `llSetStatus(STATUS_PHYSICS, true)`, `llSetBuoyancy(x)`,
`llSetStatus(STATUS_PHANTOM, true)`

#### Visibility and alpha
| Key | Values | Meaning |
|-----|--------|---------|
| Alpha | 0.0–1.0 | Transparency (1.0=opaque) |
| Visible | true/false | Rendered or hidden |
| Glow | 0.0–1.0 | Glow intensity |
| Shiny | None/Low/Med/High | Shininess level |

LSL: `llSetAlpha(alpha, ALL_SIDES)`, `llSetPrimitiveParams([PRIM_GLOW, ...])`

#### Position and rotation (relative to structure)
| Key | Values | Meaning |
|-----|--------|---------|
| Pos | <x,y,z> | Local position offset |
| Rot | degrees | Rotation angle |
| Open | 0.0–1.0 | Open fraction (doors, drawers) |

LSL: `llSetLocalRot()`, `llSetPos()`, interpolated via `llMoveToTarget()`

#### Sound state
| Key | Values | Meaning |
|-----|--------|---------|
| Sound | clip_name | Currently playing sound |
| Vol | 0.0–1.0 | Sound volume |
| Loop | true/false | Looping playback |

LSL: `llPlaySound(sound, volume)`, `llLoopSound(sound, volume)`

#### Trigger zones and sensors
| Key | Values | Meaning |
|-----|--------|---------|
| Sensor | true/false | Sensor active |
| SensType | Agent/NPC/Object | What it detects |
| SensRange | meters | Detection range |
| Action | string | Action on trigger |

LSL: `llSensorRepeat(name, key, AGENT, range, arc, rate)`,
`llSetTimerEvent(rate)`, `listen()` channels

#### Animation and sequence
| Key | Values | Meaning |
|-----|--------|---------|
| Anim | anim_name | Current animation playing |
| AnimFrame | integer | Current frame number |
| Moving | true/false | Object currently in motion |
| Path | string | Named movement path |

#### Furniture / sit targets
| Key | Values | Meaning |
|-----|--------|---------|
| Sits | integer | Number of sit targets |
| Occupied | integer | Currently occupied sits |
| SitAnim | anim_name | Sit animation name |
| SitPos | <x,y,z> | Sit target offset |

LSL: `llSitTarget(offset, rotation)`, `llAvatarOnSitTarget()`

---

## 5. Complete BEN Tag Set

| Tag | Purpose | Example |
|-----|---------|---------|
| @BEN() | Structure context | `@BEN(Struct:House,Floors=2)` |
| @OBJ() | Object state | `@OBJ(Door.Front:Locked=false,Open=0.8)` |
| @ZONE() | Trigger zone | `@ZONE(Entry:Sensor=true,SensRange=3m,Action=Greet)` |
| @ROOM() | Room-level state | `@ROOM(Living:Temp=21C,Occupied=3)` |
| @SYS() | Building system | `@SYS(HVAC:On=true,Fan=0.6)` |
| @ACCESS() | Access control | `@ACCESS(MainGate:Public=false,Group=Residents)` |
| @SPAWN() | Spawn/rez point | `@SPAWN(Entry:Active=true,Cap=10)` |

---

## 6. Complete BEN-to-LSL Bridge Table

### 6.1 Lock and access

| BEN | LSL |
|-----|-----|
| `@OBJ(Door:Locked=true)` | `llSetStatus(STATUS_BLOCK_GRAB, TRUE)` + custom lock script |
| `@OBJ(Door:Access=Restricted)` | `llRequestAgentData(id, DATA_NAME)` + group check |
| `@OBJ(Door:Phantom=true)` | `llSetStatus(STATUS_PHANTOM, TRUE)` |
| `@OBJ(Door:Open=0.8)` | `llSetLocalRot(llEuler2Rot(<0,0,0.8*PI> * DEG_TO_RAD))` |
| `@ACCESS(Gate:Public=false)` | `llSay(0, "Access denied")` + `llPushObject()` |

### 6.2 Lighting

| BEN | LSL |
|-----|-----|
| `@OBJ(Light.Ceil:On=true,Dim=0.8)` | `llSetPrimitiveParams([PRIM_POINT_LIGHT, TRUE, <1,1,1>, 0.8, 10.0, 0.75])` |
| `@OBJ(Light.Lamp:Temp=2700K)` | Convert K to RGB: `<1.0, 0.75, 0.45>` approx, set via PRIM_POINT_LIGHT |
| `@OBJ(Light.Floor:On=false)` | `llSetPrimitiveParams([PRIM_POINT_LIGHT, FALSE, <1,1,1>, 0, 0, 0])` |
| `@OBJ(Light:Color=1,0.5,0)` | `llSetPrimitiveParams([PRIM_POINT_LIGHT, TRUE, <1.0,0.5,0.0>, 0.8, 8.0, 0.75])` |
| `@OBJ(Light:Glow=0.3)` | `llSetPrimitiveParams([PRIM_GLOW, ALL_SIDES, 0.3])` |

### 6.3 Physics

| BEN | LSL |
|-----|-----|
| `@OBJ(Platform:Phys=true)` | `llSetStatus(STATUS_PHYSICS, TRUE)` |
| `@OBJ(Balloon:Buoy=1.5)` | `llSetBuoyancy(1.5)` |
| `@OBJ(Wall:Col=false)` | `llSetStatus(STATUS_PHANTOM, TRUE)` |
| `@OBJ(Crate:Grav=0.3)` | Custom gravity via `llApplyImpulse()` per tick |

### 6.4 Sensors and triggers

| BEN | LSL |
|-----|-----|
| `@ZONE(Entry:Sensor=true,SensRange=3)` | `llSensorRepeat("", NULL_KEY, AGENT, 3.0, PI, 1.0)` |
| `@OBJ(Door:Action=Open)` | `sensor()` event → `llSetLocalRot()` open animation |
| `@OBJ(Chime:Sound=bell,Vol=0.8,Loop=false)` | `llPlaySound("bell", 0.8)` |
| `@OBJ(Speaker:Sound=ambient,Loop=true)` | `llLoopSound("ambient", 0.8)` |

### 6.5 Sit targets

| BEN | LSL |
|-----|-----|
| `@OBJ(Chair:Sits=1,SitAnim=sit_casual)` | `llSitTarget(<0,0,0.5>, ZERO_ROTATION)` + `llRequestSit()` |
| `@OBJ(Couch:Sits=3,Occupied=2)` | Multiple `llSitTarget()` calls with offsets |

---

## 7. Usage Patterns

### 7.1 Room configuration snapshot

```
// Living room, evening configuration
@BEN(Struct:House,Name=LivingRoom)
@OBJ(Light.Ceil:On=true,Dim=0.4,Temp=2700K)
@OBJ(Light.Lamp.N:On=true,Dim=0.8,Temp=3000K)
@OBJ(Door.Front:Locked=true,Open=0.0)
@OBJ(Win.S:Open=0.2)
@OBJ(TV:On=true,Sound=ambient,Vol=0.3)
@OBJ(Couch:Sits=3,Occupied=1,SitAnim=sit_lounge)
@ROOM(Living:Temp=20C,Occupied=1)
```

### 7.2 Escape room puzzle state

```
// Escape room at checkpoint 3 — puzzle partially solved
@BEN(Struct:Room,Name=EscapeRoom1)
@OBJ(Door.Exit:Locked=true)
@OBJ(Safe:Locked=true,Open=0.0)
@OBJ(Bookshelf:Anim=tilt,Open=0.0)
@OBJ(Lock.Code:AnimFrame=3)     // 3 of 5 digits entered
@OBJ(Light.Red:On=true)         // puzzle not solved yet
@OBJ(Light.Green:On=false)
@ZONE(Safe.Prox:Sensor=true,SensRange=1.5m)
```

### 7.3 Smart home scene

```
// Morning routine, 07:30
@BEN(Struct:Apt,Name=Apt12B)
@OBJ(Light.Bedroom:On=true,Dim=0.3,Temp=4000K)
@OBJ(Light.Kitchen:On=true,Dim=0.9,Temp=5000K)
@OBJ(Door.Front:Locked=true)
@OBJ(Win.Living:Open=0.5)
@SYS(HVAC:On=true,Temp=19C)
@SYS(Coffee:On=true,Timer=07:30)
```

### 7.4 Combined VWN scene — boat cabin at night

```
// Sailboat cruising, cabin locked, night lighting
@VMN(Sea) @ATT(Rol=-8,Yaw=135) @VEL(Fwd=6) @MODE(Cruise)
@BEN(Struct:Cabin,Name=MainCabin)
@OBJ(Door.Hatch:Locked=true,Alpha=0.95)
@OBJ(Light.Nav:On=true,Dim=0.6,Color=0,0,1)
@OBJ(Light.Ceil:On=true,Dim=0.3,Temp=2200K)
@ENS(Time:22:15,Sky:Night,Wind=<6,0,0>)
```

---

## 8. Temporal Notation

BEN inherits transition notation from MNN v2.0 and VMN v1.0.

```
// Door opening sequence
@OBJ(Door.Front:Locked=true,Open=0.0)
~800ms.ease-out
>> @OBJ(Door.Front:Locked=false,Open=1.0)

// Lights dimming at sunset
@OBJ(Light.Ceil:On=true,Dim=1.0,Temp=5500K)
~30min.ease-linear
>> @OBJ(Light.Ceil:On=true,Dim=0.4,Temp=2700K)
```

---

## 9. Versioning

BEN_SPEC_v1.md — version 1.0.0

Version format: MAJOR.MINOR.PATCH
- MAJOR: breaking syntax changes
- MINOR: new object types or keys (backward compatible)
- PATCH: clarifications, corrections, examples

---

## 10. Intellectual Property

BEN (Building/Environment Notation), the BEN tag set (@BEN, @OBJ, @ZONE,
@ROOM, @SYS, @ACCESS, @SPAWN), the BEN-to-LSL bridge mapping tables (Sections
6.1–6.5), the compound VWN scene string convention (Section 7.4), and all
original frameworks in this document are © 2026 AIUNITES LLC. All Rights
Reserved. DMCA Protected.

Published freely for educational and professional use.
Sister protocols under VWN: VMN (vehicles), ENS (environment).
Sister protocols under HMN: MNN (body), FNN (face), VRN (voice).

---

*BEN_SPEC_v1.md*
*Version 1.0.0 — 2026-04-03*
*AIUNITES LLC*
