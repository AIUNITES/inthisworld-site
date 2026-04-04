# ENS — Environment State Notation
## Specification v1.0.0

**Protocol family:** VWN (Virtual World Notation)
**Umbrella:** VWN, peer to VMN and BEN
**Maintained by:** AIUNITES LLC
**Published:** 2026-04-03
**Status:** ACTIVE
**Primary platform:** InThisWorld (inthisworld.com) / Second Life / OpenSim

© 2026 AIUNITES LLC. All Rights Reserved. DMCA Protected.
ENS, the ENS Symbol Set, the ENS-LSL bridge mapping tables, and all original
frameworks in this document are original works of AIUNITES LLC.
Published freely for educational and professional use.

---

## 1. Overview

ENS (Environment State Notation) is the AIUNITES open protocol for encoding
the state of the world-level environment as plain text. It is one of three
sub-protocols under VWN (Virtual World Notation), alongside VMN (vehicles) and
BEN (buildings).

ENS captures: sky and sun position, weather conditions, time of day, season,
global physics parameters, and atmospheric properties — all as a single
composable string.

### 1.1 The distinction from OpenUSD

OpenUSD Core Specification 1.0 (Alliance for OpenUSD, December 2025) defines
what a sky box LOOKS LIKE — its geometry, its material, its HDRI texture.
ENS defines what the environment IS — raining at 60% intensity, 15:30 PST in
autumn, 12m/s wind from the northwest, visibility 400m.

A skybox rendered in OpenUSD does not know it is raining. ENS does.

### 1.2 Relation to VMN and BEN

ENS operates at world scope. VMN operates at vehicle scope. BEN operates at
structure scope. They compose freely:

```
// Complete VWN scene: stormy night, aircraft in turbulence, cabin sealed

@ENS(Time:23:10,Sky:Storm,Weather:Rain=0.9,Wind=<18,4,0>,Vis=200m)
@VMN(Air) @ATT(Pit=2,Rol=-15,Yaw=090) @VEL(Fwd=95) @MODE(Cruise)
@BEN(Struct:Cabin) @OBJ(Door.Hatch:Locked=true) @OBJ(Light.Nav:On=true)
```

ENS provides the world conditions; VMN describes the aircraft fighting those
conditions; BEN describes the sealed cabin inside the aircraft.

### 1.3 Use cases

- Virtual world time-of-day and weather scripting
- Film/game scene state notation: "exterior, dusk, light rain"
- VR environment logging: reproducible conditions for testing
- Second Life / OpenSim windlight and region parameter control
- Weather simulation state capture
- Photography or rendering: lighting conditions at a specific moment
- Virtual event management: weather schedule for outdoor venues

---

## 2. Design Principles

**2.1 World-scope** — ENS describes conditions that apply to the entire scene
or region, not to a specific object. Object-level environmental effects use
BEN (@OBJ wind-affected flags) or VMN (@ENV local forces on a vehicle).

**2.2 Composable** — ENS strings compose freely with VMN and BEN. The @ENV()
tag in VMN mirrors relevant ENS values for local vehicle physics. ENS is the
authoritative source; @ENV is the local application.

**2.3 Moment snapshot** — Like all VWN and HMN protocols, ENS is a phase
snapshot — the state of the environment at moment T, not a command to change
the environment.

**2.4 LSL bridge** — Every ENS tag has a defined LSL mapping targeting the
Second Life / OpenSim region environment API.

---

## 3. ENS Tag Reference

### 3.1 @ENS() — Environment declaration

The primary ENS tag. Can be composed inline or used as a standalone prefix.

```
@ENS(Time:15:30,Sky:PartCloud,Season:Autumn)
```

### 3.2 @TIME() — Time of day and calendar

```
@TIME(15:30)                        // 24h time
@TIME(15:30,TZ=PST)                 // with timezone
@TIME(15:30,TZ=PST,Date=2026-10-15) // full datetime
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| HH:MM | 00:00–23:59 | Time of day |
| TZ | Timezone code | Optional timezone |
| Date | YYYY-MM-DD | Optional date |

LSL: `llSetRegionParam()` for time override,
or estate WindLight time-of-day setting

### 3.3 @SKY() — Sky and sun state

```
@SKY(Clear)
@SKY(PartCloud,Sun:Elev=35,Azm=220)
@SKY(Overcast)
@SKY(Storm)
@SKY(Night,Moon=Full)
@SKY(Dawn)
@SKY(Dusk,Sun:Elev=5,Azm=270)
```

| Sky value | Description |
|-----------|-------------|
| Clear | No clouds, full sun |
| PartCloud | Partial cloud cover |
| Overcast | Heavy cloud cover, diffuse light |
| Storm | Storm clouds, dramatic light |
| Night | No sun, star field |
| Dawn | Sun rising, warm horizontal light |
| Dusk | Sun setting, warm horizontal light |
| Fog | Fog dominant, no direct sun |
| Haze | Light atmospheric haze |

Sun parameters:
- Elev: sun elevation angle in degrees above horizon
- Azm: sun azimuth in degrees (0=North, 90=East, 180=South, 270=West)

LSL: `llSetEnvironment()` with EEP (Environmental Enhancement Project) params,
`PRIM_SUN_MOON_GLOW`, `PRIM_REFLECTION_PROBE` in modern SL/OpenSim.

### 3.4 @WEATHER() — Precipitation and atmospheric conditions

```
@WEATHER(Clear)
@WEATHER(Rain=0.4)                  // light rain, 40% intensity
@WEATHER(Rain=0.9,Wind=<18,4,0>)   // heavy rain with wind
@WEATHER(Snow=0.6,Wind=<8,0,0>)    // moderate snow
@WEATHER(Fog=0.8)                  // thick fog
@WEATHER(Mist=0.3)                 // light mist
@WEATHER(Hail=0.5)                 // hail
@WEATHER(Dust=0.7,Wind=<20,0,0>)   // dust storm
```

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| Rain | float | 0.0–1.0 | Rain intensity |
| Snow | float | 0.0–1.0 | Snow intensity |
| Fog | float | 0.0–1.0 | Fog density |
| Mist | float | 0.0–1.0 | Mist density |
| Hail | float | 0.0–1.0 | Hail intensity |
| Dust | float | 0.0–1.0 | Dust density |
| Wind | vector | m/s | Wind vector <x,y,z> |
| Vis | distance | meters | Visibility distance |
| Temp | degrees | °C or °F | Air temperature |
| Humid | percent | 0–100 | Relative humidity |
| Pressure | hPa | 800–1100 | Atmospheric pressure |

LSL: `llSetEnvironment()` density, `PRIM_PARTICLE_SYSTEM` for particle effects
(rain, snow, fog), `llSetWindlightScene_Extended()` for WindLight density.

### 3.5 @WIND() — Wind state

When wind is complex (gusting, directional shifts), use @WIND() separately:

```
@WIND(<8,2,0>)                          // steady 8m/s from west
@WIND(<12,0,0>,Gust=18)                // gusting to 18 from west
@WIND(<5,5,0>,Turb=0.4)               // turbulent
@WIND(<0,0,0>)                          // calm
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| vector | <x,y,z> m/s | Wind direction and speed |
| Gust | m/s | Gust peak speed |
| Turb | 0.0–1.0 | Turbulence intensity |

LSL: `llSetEnvironment()` wind density and direction, or custom wind script
via `llGetWind(offset)` and `llApplyImpulse()` on affected objects.

### 3.6 @SEASON() — Season state

```
@SEASON(Spring)
@SEASON(Summer)
@SEASON(Autumn)
@SEASON(Winter)
```

Season affects: foliage state, particle effects, ground texture triggers,
ambient sound triggers. Not directly a single LSL call — implemented via
season-aware region script that responds to @SEASON() state.

### 3.7 @PHYS() — Global physics overrides

```
@PHYS(Grav=9.8)                    // Earth gravity (default)
@PHYS(Grav=1.6)                    // Moon gravity
@PHYS(Grav=0.0)                    // Zero gravity / orbital
@PHYS(Grav=24.8)                   // Jupiter gravity
@PHYS(AirDens=1.225)               // Standard air density at sea level
@PHYS(AirDens=0.0)                 // Vacuum
@PHYS(PhysRate=60)                 // Physics tick rate
@PHYS(Grav=9.8,AirDens=0.8,Damp=0.1)  // full override
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| Grav | 9.8 | Gravitational acceleration m/s² |
| AirDens | 1.225 | Air density kg/m³ |
| Damp | 0.0 | Linear damping factor |
| PhysRate | 45 | Physics simulation rate (SL default 45Hz) |
| WaterH | 20.0 | Water surface height (SL default 20m) |

LSL: `llSetRegionParam(REGION_FLAG_FIXED_SUN)`, estate physics override,
`llSetVehicleFloatParam(VEHICLE_BUOYANCY, ...)` for water interaction.

---

## 4. Shorthand Inline Form

For compact scene strings, ENS parameters can be inlined in the @ENS() tag:

```
// Verbose form
@TIME(15:30) @SKY(PartCloud) @WEATHER(Rain=0.3,Wind=<8,2,0>) @PHYS(Grav=9.8)

// Inline shorthand (equivalent)
@ENS(Time:15:30,Sky:PartCloud,Weather:Rain=0.3,Wind=<8,2,0>)
```

Both forms are valid. Verbose form is preferred for complex states.
Inline shorthand is preferred for compact compound scene strings.

---

## 5. Complete ENS-to-LSL Bridge Table

### 5.1 Time and sun

| ENS | LSL |
|-----|-----|
| `@TIME(15:30)` | `llSetEnvironment(...)` time param, or WL preset at 15:30 |
| `@SKY(Clear)` | WindLight preset: "Midday" or "Default" |
| `@SKY(Night)` | WindLight preset: "Midnight" |
| `@SKY(Dusk)` | WindLight preset: "Sunset" or custom EEP |
| `@SKY(Dawn)` | WindLight preset: "Sunrise" or custom EEP |
| `@SKY(Storm)` | WindLight preset: "Purplesurreality" or similar high contrast |
| `@SKY(Overcast)` | WindLight preset: low sun, high cloud density |
| `@SKY(Sun:Elev=35,Azm=220)` | `llSetEnvironment(PRIM_SUN_MOON_POSITIONS, [35.0, 220.0])` |

### 5.2 Weather and atmosphere

| ENS | LSL |
|-----|-----|
| `@WEATHER(Rain=0.6)` | `PRIM_PARTICLE_SYSTEM` rain particle emitter + `llSetWind()` |
| `@WEATHER(Snow=0.5)` | `PRIM_PARTICLE_SYSTEM` snow particle emitter |
| `@WEATHER(Fog=0.8)` | `llSetEnvironment(PRIM_FOG_MOD, ...)` or WL preset |
| `@WEATHER(Vis=400m)` | WindLight fog density parameter inverse calculation |
| `@WEATHER(Temp=15C)` | Region script only — no native LSL equivalent |
| `@WIND(<12,0,0>)` | `llSetEnvironment(...)` wind params, or estate wind tool |

### 5.3 Physics

| ENS | LSL |
|-----|-----|
| `@PHYS(Grav=1.6)` | `llSetRegionParam()` gravity (estate tools) |
| `@PHYS(WaterH=0)` | Water level override via estate terrain tools |
| `@PHYS(Damp=0.1)` | Per-vehicle: `llSetVehicleFloatParam(VEHICLE_LINEAR_FRICTION_TIMESCALE, ...)` |

---

## 6. Predefined Scene Presets

Common environment states as named presets for rapid reuse.

| Preset | Expanded string |
|--------|----------------|
| `@ENS(Preset:MidSummerNoon)` | `@TIME(12:00) @SKY(Clear,Sun:Elev=78,Azm=180) @WEATHER(Clear) @SEASON(Summer)` |
| `@ENS(Preset:AutumnAfternoon)` | `@TIME(15:30) @SKY(PartCloud) @WEATHER(Mist=0.2,Wind=<5,0,0>) @SEASON(Autumn)` |
| `@ENS(Preset:WinterNight)` | `@TIME(22:00) @SKY(Night,Moon=Full) @WEATHER(Snow=0.3,Wind=<4,0,0>) @SEASON(Winter)` |
| `@ENS(Preset:TropicalStorm)` | `@TIME(14:00) @SKY(Storm) @WEATHER(Rain=0.9,Wind=<22,8,0>,Vis=150m)` |
| `@ENS(Preset:SeaFog)` | `@TIME(09:00) @SKY(Overcast) @WEATHER(Fog=0.7,Mist=0.4,Vis=80m)` |
| `@ENS(Preset:DesertSunrise)` | `@TIME(06:15) @SKY(Dawn,Sun:Elev=8,Azm=090) @WEATHER(Clear,Temp=28C) @SEASON(Summer)` |
| `@ENS(Preset:ArcticBlizzard)` | `@TIME(11:00) @SKY(Overcast) @WEATHER(Snow=0.9,Wind=<35,0,0>,Vis=50m) @SEASON(Winter)` |
| `@ENS(Preset:MoonlessNight)` | `@TIME(02:30) @SKY(Night,Moon=None) @WEATHER(Clear)` |
| `@ENS(Preset:ZeroG)` | `@PHYS(Grav=0.0,AirDens=0.0) @SKY(Night) @TIME(00:00)` |

---

## 7. Usage Patterns

### 7.1 Standalone environment scene

```
// English countryside on an October afternoon
@TIME(14:45,Date=2026-10-12) @SKY(PartCloud,Sun:Elev=28,Azm=210)
@WEATHER(Mist=0.2,Wind=<6,2,0>,Temp=12C,Humid=78) @SEASON(Autumn)
```

### 7.2 Combined VWN scene — full weather context

```
// Typhoon: ship fighting heavy seas at night
@ENS(Time:03:20,Sky:Storm) @WEATHER(Rain=0.95,Wind=<30,12,0>,Vis=80m)
@VMN(Sea) @ATT(Rol=-20,Yaw=045) @VEL(Fwd=5) @MODE(Cruise)
@BEN(Struct:Bridge,Name=WheelHouse)
@OBJ(Win.Forward:Alpha=0.6)      // spray on windows
@OBJ(Light.Red:On=true,Dim=0.4) // red night lighting
@OBJ(Door.Wing:Locked=true)     // side doors sealed
```

### 7.3 Physics override scene — lunar surface

```
// Apollo landing site
@ENS(Preset:MoonlessNight) @PHYS(Grav=1.6,AirDens=0.0)
@VMN(Space) @ATT(Pit=0,Rol=0,Yaw=000) @VEL(Fwd=0) @MODE(Land)
@BEN(Struct:Platform,Name=LandingPad)
@OBJ(Light.Beacon:On=true,Dim=1.0,Color=1,0.8,0)
```

### 7.4 Game checkpoint state

```
// RPG outdoor scene: approaching storm at sunset
@TIME(18:10) @SKY(Dusk,Sun:Elev=6,Azm=272)
@WEATHER(Wind=<12,0,0>,Vis=600m)  // storm approaching from west
@SEASON(Autumn)
// Five minutes later (game time):
~5min.ease-in
>> @TIME(18:15) @SKY(Storm) @WEATHER(Rain=0.6,Wind=<18,3,0>,Vis=300m)
```

### 7.5 OpenUSD metadata integration

ENS strings can be embedded as metadata inside USD files, extending the
geometry layer with behavioral environment state:

```
# USD file fragment (USDA format)
def Scope "EnvironmentState" {
    string ens:state = "@TIME(15:30) @SKY(PartCloud) @WEATHER(Rain=0.3)"
    string ens:version = "1.0"
    string ens:protocol = "ENS"
}
```

This positions VWN/ENS as the behavioral complement to OpenUSD geometry.

---

## 8. Relation to VRN

VRN (Voice Resonance Notation) encodes the resonant state of the human vocal
tract — a biological environment. ENS encodes the resonant state of the
physical world environment — atmosphere, light, precipitation. Both are phase
snapshots of oscillating physical systems at moment T.

This is not coincidence. The same mathematical framework that describes a
singer's resonance chambers (closed spaces shaping acoustic oscillation)
also describes the atmosphere (open space shaping radiant and kinetic
oscillation). UMN is a consistent framework across scales.

---

## 9. Temporal Notation

ENS inherits transition notation from MNN v2.0 and VMN v1.0.

```
// Sunrise sequence — 30 minute transition
@TIME(05:45) @SKY(Night) @WEATHER(Clear)
~30min.ease-bio
>> @TIME(06:15) @SKY(Dawn,Sun:Elev=8) @WEATHER(Mist=0.2)
~15min.ease-in
>> @TIME(06:30) @SKY(Clear,Sun:Elev=15) @WEATHER(Clear)

// Approaching storm — fast
@ENS(Preset:MidSummerNoon) ~20min.ease-in >> @ENS(Preset:TropicalStorm)
```

---

## 10. Versioning

ENS_SPEC_v1.md — version 1.0.0

Version format: MAJOR.MINOR.PATCH

---

## 11. Intellectual Property

ENS (Environment State Notation), the ENS tag set (@ENS, @TIME, @SKY,
@WEATHER, @WIND, @SEASON, @PHYS), the named preset table (Section 6), the
ENS-to-LSL bridge mapping tables (Sections 5.1–5.3), the compound VWN scene
string convention, the OpenUSD metadata integration pattern (Section 7.5),
and all original frameworks in this document are © 2026 AIUNITES LLC.
All Rights Reserved. DMCA Protected.

Published freely for educational and professional use.
Sister protocols under VWN: VMN (vehicles), BEN (buildings).
Sister protocols under HMN: MNN (body), FNN (face), VRN (voice).

---

*ENS_SPEC_v1.md*
*Version 1.0.0 — 2026-04-03*
*AIUNITES LLC*
