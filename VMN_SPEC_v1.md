# VMN — Vehicle Motion Notation
## Specification v1.1.0

**Protocol family:** VWN (Virtual World Notation) → UMN (Universal Movement Notation)
**Maintained by:** AIUNITES LLC
**Published:** 2026-04-03
**Updated:** 2026-04-03 — v1.1 adds @MULTI() morphing vehicle notation
**Status:** ACTIVE
**Relation to HMN:** Peer protocol. VMN and HMN strings compose freely in one scene string.
**Primary platform:** InThisWorld (inthisworld.com) / Second Life / OpenSim

© 2026 AIUNITES LLC. All Rights Reserved. DMCA Protected.
VMN, the VMN Symbol Set, the VMN-LSL bridge mapping tables, and all original
frameworks in this document are original works of AIUNITES LLC.
Published freely for educational and professional use.

---

## 1. Overview

VMN (Vehicle Motion Notation) is the AIUNITES open protocol for encoding vehicle
physics state, control inputs, and motion parameters as plain text. It is the
vehicle sub-protocol of VWN (Virtual World Notation), which is itself a peer
to HMN (Human Movement Notation) in the AIUNITES notation family.

VMN gives every vehicle type a class symbol, maps every state parameter to a
short @TAG(), and provides a formal translation layer to the Second Life /
OpenSim LSL vehicle physics API. It uses the same @TAG(key=value) syntax as
MNN v2.0 and FNN v1.0 for consistency across the entire AIUNITES notation family.

### 1.1 The problem VMN solves

Second Life and OpenSim expose a rich vehicle physics API through LSL
(llSetVehicleType, llSetVehicleFloatParam, llSetVehicleRotationParam,
llSetVehicleVectorParam, llSetVehicleFlags). This API is capable but operates
entirely in raw numeric parameters with no human-readable notation layer.

A plane banking left in SL currently looks like this in LSL:

    llSetVehicleType(VEHICLE_TYPE_AIRPLANE);
    llSetVehicleFloatParam(VEHICLE_ANGULAR_MOTOR_DIRECTION, -0.35);
    llSetVehicleRotationParam(VEHICLE_REFERENCE_FRAME,
        llEuler2Rot(<5.0, 0.0, 270.0> * DEG_TO_RAD));

In VMN, the same state is:

    @VMN(Air) @ATT(Pit=5,Rol=-20,Yaw=270) @VEL(Fwd=95)

VMN is the readable, portable, loggable notation layer that LSL lacks.

### 1.2 Relation to OpenUSD

OpenUSD Core Specification 1.0 (Alliance for OpenUSD, December 2025) describes
what vehicles LOOK LIKE -- their 3D geometry, materials, and scene composition.
VMN describes what vehicles ARE DOING -- their physics state, control inputs,
and motion parameters. These are different layers and VMN strings could be
embedded as metadata inside OpenUSD prims for richer scene description.

### 1.3 Composition with HMN

VMN strings compose freely with MNN (body) and FNN (face) strings in a single
portable scene description. No other system encodes both the pilot's body state
and the aircraft's physics state in one string:

    // InThisWorld scene: pilot banking left in a small plane
    @VMN(Air) @ATT(Pit=5,Rol=-20,Yaw=270) @VEL(Fwd=95) @ALT(m=800)
    @MOV(Sit) @JNT(Sp.C:Rot=-15) @JNT(R.Sh:Flex=35) @ACT(Trap:1)
    @FNN(Corr:1,Orb.Oc.O:2)

    // Avatar body, expression, and aircraft state -- all in one string.

---

## 2. Design Principles

**2.1 @TAG() syntax** — All tags use @TAGNAME(key=value) format. Positional values
are used where order is unambiguous. This is identical to MNN v2.0, FNN v1.0,
and all other AIUNITES notation protocols.

**2.2 Vehicle-class-first** — Every VMN string begins with @VMN(class) which
declares the vehicle type. This determines which other tags are applicable and
which LSL vehicle type constant is used.

**2.3 State, not commands** — VMN describes the CURRENT STATE of a vehicle, not
a command to achieve a state. A VMN string is a snapshot, like a frame from a
flight data recorder. Transition notation (>> with timing) describes change.

**2.4 LSL bridge** — Every VMN tag has a defined LSL mapping. The bridge is
complete -- no VMN tag is undefined in terms of its LSL translation.

**2.5 Graceful degradation** — A parser that receives a VMN string it does not
fully understand should process the tags it recognizes and skip the rest. An
LOD 0 renderer that only understands vehicle class still renders the correct
vehicle type.

---

## 3. Vehicle Classes

| Class | @VMN() | LSL constant | Description |
|-------|--------|-------------|-------------|
| Aircraft (fixed-wing) | @VMN(Air) | VEHICLE_TYPE_AIRPLANE | Planes, gliders, winged craft |
| Helicopter | @VMN(Heli) | VEHICLE_TYPE_AIRPLANE + rotor config | Rotorcraft, tiltrotors |
| Boat / surface vessel | @VMN(Sea) | VEHICLE_TYPE_BOAT | Boats, yachts, ferries, hovercraft |
| Submarine | @VMN(Sub) | VEHICLE_TYPE_BOAT + buoyancy<0 | Underwater vessels |
| Ground vehicle | @VMN(Car) | VEHICLE_TYPE_CAR | Cars, trucks, ATVs, motorcycles |
| Spacecraft | @VMN(Space) | VEHICLE_TYPE_SLED + no gravity | Zero-gravity craft |
| Balloon / airship | @VMN(Balloon) | VEHICLE_TYPE_AIRPLANE + low speed | Lighter-than-air |
| Drone / UAV | @VMN(Drone) | VEHICLE_TYPE_AIRPLANE + small scale | Quadcopters, UAVs |
| Sled / rail | @VMN(Sled) | VEHICLE_TYPE_SLED | Rail vehicles, sleds, constrained |
| Motorcycle | @VMN(Moto) | VEHICLE_TYPE_MOTORCYCLE | Two-wheeled ground vehicles |

---

## 4. Core Tag Reference

### 4.1 @VMN() — Vehicle class declaration (required, always first)

    @VMN(Air)       // fixed-wing aircraft
    @VMN(Heli)      // helicopter
    @VMN(Sea)       // surface vessel
    @VMN(Sub)       // submarine
    @VMN(Car)       // ground vehicle
    @VMN(Space)     // spacecraft
    @VMN(Balloon)   // lighter-than-air
    @VMN(Drone)     // UAV / quadcopter
    @VMN(Moto)      // motorcycle

### 4.2 @ATT() — Attitude (orientation in degrees)

Three-axis orientation relative to local reference frame.

    @ATT(Pit=5,Rol=0,Yaw=270)

| Parameter | Meaning | Range | Default |
|-----------|---------|-------|---------|
| Pit | Pitch (nose up/down) | -90 to +90 | 0 |
| Rol | Roll (bank left/right) | -180 to +180 | 0 |
| Yaw | Yaw (heading, 0=North) | 0 to 359 | 0 |

LSL: llSetVehicleRotationParam(VEHICLE_REFERENCE_FRAME, llEuler2Rot(<Pit,Rol,Yaw> * DEG_TO_RAD))

### 4.3 @VEL() — Velocity

Speed in meters per second (or knots for naval, specified with suffix).

    @VEL(Fwd=95)               // forward speed only
    @VEL(Fwd=120,Vert=2.5)    // forward + climb rate
    @VEL(Fwd=8.5kts)          // naval, knots
    @VEL(Fwd=0,Lat=1.5,Vert=-0.5)  // full 3-axis

| Parameter | Meaning | Units |
|-----------|---------|-------|
| Fwd | Forward speed | m/s (append kts for knots) |
| Lat | Lateral drift | m/s |
| Vert | Vertical speed (+ = climbing) | m/s |

LSL: llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <Fwd,Lat,Vert>)

### 4.4 @CTRL() — Control inputs (0.0 to 1.0 unless noted)

Current control surface / input state. Range 0.0–1.0 for throttle/brake.
Steering and rudder in degrees or normalized -1.0 to +1.0.

    @CTRL(Throt=0.85,Steer=-0.3)     // car: throttle 85%, steering left
    @CTRL(Throt=0.6,Rudd=15)         // boat: throttle 60%, rudder 15° right
    @CTRL(Elev=0.2,Ail=-0.15,Rudd=0) // aircraft: elevator, aileron, rudder

| Parameter | Meaning | Applies to |
|-----------|---------|-----------|
| Throt | Throttle 0.0–1.0 | All |
| Brake | Brake 0.0–1.0 | Car, Moto |
| Steer | Steering -1.0 to +1.0 or degrees | Car, Moto |
| Rudd | Rudder degrees or -1.0 to +1.0 | Sea, Sub, Air |
| Elev | Elevator -1.0 to +1.0 | Air, Heli |
| Ail | Aileron -1.0 to +1.0 | Air |
| Coll | Collective pitch 0.0–1.0 | Heli |
| Cyc | Cyclic <lat,lon> | Heli |
| Planes | Dive planes degrees | Sub |
| Buoy | Buoyancy trim 0.0–1.0 | Sub |

LSL: llSetVehicleFloatParam() or llSetVehicleVectorParam() per parameter

### 4.5 @ALT() — Altitude

Altitude above terrain or sea level.

    @ALT(m=1500)       // 1500 meters above terrain
    @ALT(ft=5000)      // 5000 feet
    @ALT(m=1500,Ref=SL) // above sea level
    @ALT(m=-25)        // submarine depth (negative)

LSL: llGetPos().z (read) or physics-layer buoyancy control (write)

### 4.6 @POS() — World position

Position in world/region coordinates.

    @POS(X=128,Y=200,Z=50)       // SL region coordinates
    @POS(Reg=Zindra,X=64,Y=64)   // region + local coords
    @POS(Lat=37.4,Lon=-122.1)    // real-world coordinates (for OpenSim geo)

LSL: llGetPos() / llSetPos() / llGetRegionName()

### 4.7 @ENG() — Engine state

    @ENG(Thrust=0.9)              // jet thrust 0.0–1.0
    @ENG(RPM=2800)                // RPM for piston/rotor
    @ENG(RPM=2800,Thrust=0.85)    // both
    @ENG(Count=2,Thrust=0.9)      // multi-engine
    @ENG(On=false)                // engine off / stalled

### 4.8 @SURF() — Control surfaces and landing gear

    @SURF(Flap=0.3,Gear=Down,Chute=false)   // aircraft approach config
    @SURF(Flap=0,Gear=Up,Trim=2.5)          // cruise config
    @SURF(Sail=Main+Jib,Reef=0)             // sailing vessel

| Parameter | Meaning | Applies to |
|-----------|---------|-----------|
| Flap | Flap extension 0.0–1.0 | Air |
| Gear | Landing gear Up/Down | Air |
| Chute | Parachute deployed true/false | Air, Space |
| Trim | Pitch trim in degrees | Air |
| Sail | Sail configuration | Sea (sailing) |
| Reef | Reef setting 0.0–1.0 | Sea (sailing) |
| Spoiler | Spoiler 0.0–1.0 | Air, Car |

### 4.9 @NAV() — Navigation state

    @NAV(Hdg=270,SPD=8.5kts)          // boat: heading west, 8.5 knots
    @NAV(Hdg=270,SPD=120,Alt=1500)    // aircraft: heading, speed, altitude
    @NAV(Depth=25,Hdg=180)            // submarine
    @NAV(Dest=<128,128,0>)            // navigating to destination

| Parameter | Meaning |
|-----------|---------|
| Hdg | Heading 0–359 degrees (0=North) |
| SPD | Speed (m/s default, append kts for knots) |
| Alt | Altitude target (aircraft) |
| Depth | Target depth in meters (submarine) |
| Dest | Destination coordinates |
| Bearing | Bearing to destination |
| ETA | Estimated time to destination in seconds |

### 4.10 @ENV() — Local environmental forces

Environmental conditions acting on the vehicle (local to vehicle, not global world state).
For global world environment use ENS protocol.

    @ENV(Wind=<5,0,0>)               // 5 m/s wind from the west
    @ENV(Wind=<5,0,0>,Wave=1.2m)     // wind + wave height
    @ENV(Current=<0,2.5,0>)          // water current

### 4.11 @THRUST() — Thrust vector (spacecraft and VTOL)

For vehicles where thrust direction is variable and not aligned with forward vector.

    @THRUST(Vec=<0,0,1>,N=450)       // upward thrust, 450 Newtons
    @THRUST(Vec=<1,0,0>,Pct=0.8)    // forward thrust, 80%

LSL: llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, normalized_vec * magnitude)

### 4.12 @MODE() — Flight or operational mode

    @MODE(Hover)       // helicopter hover mode
    @MODE(Cruise)      // aircraft cruise
    @MODE(Approach)    // landing approach
    @MODE(Taxi)        // ground taxi
    @MODE(Anchored)    // boat at anchor
    @MODE(Docked)      // submarine docked
    @MODE(Orbit)       // spacecraft orbital mode
    @MODE(Reentry)     // spacecraft reentry

---

## 5. Vehicle-Specific Tag Sets

### 5.1 VMN-Air — Fixed-wing aircraft

Complete string for a small plane on approach:

    @VMN(Air) @MODE(Approach)
    @ATT(Pit=-3,Rol=0,Yaw=090)
    @VEL(Fwd=65,Vert=-2.5)
    @ALT(m=300)
    @CTRL(Throt=0.35,Elev=0.1,Rudd=0)
    @SURF(Flap=0.5,Gear=Down,Trim=-1.5)
    @ENG(RPM=1800,Thrust=0.35)
    @NAV(Hdg=090,SPD=65)

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_AIRPLANE);
    llSetVehicleRotationParam(VEHICLE_REFERENCE_FRAME,
        llEuler2Rot(<-3.0, 0.0, 90.0> * DEG_TO_RAD));
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <65, 0, -2.5>);
    llSetVehicleFloatParam(VEHICLE_LINEAR_MOTOR_TIMESCALE, 2.0);
    llSetVehicleFloatParam(VEHICLE_ANGULAR_DEFLECTION_EFFICIENCY, 0.5);

### 5.2 VMN-Heli — Helicopter

    @VMN(Heli) @MODE(Hover)
    @ATT(Pit=0,Rol=0,Yaw=180)
    @VEL(Fwd=0,Lat=0,Vert=0)
    @ALT(m=50)
    @CTRL(Coll=0.65,Cyc=<0,0>)
    @ENG(RPM=2200,Thrust=0.65)

Hovering helicopter -- collective holds altitude, cyclic centered.

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_AIRPLANE);  // SL has no Heli type, use Airplane
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <0,0,0>);
    llSetVehicleFloatParam(VEHICLE_VERTICAL_ATTRACTION_EFFICIENCY, 0.9);
    llSetVehicleFloatParam(VEHICLE_VERTICAL_ATTRACTION_TIMESCALE, 0.5);
    // Custom rotor physics via llApplyImpulse in rotor script

### 5.3 VMN-Sea — Surface vessel

Sailing yacht reaching in moderate breeze:

    @VMN(Sea) @MODE(Cruise)
    @ATT(Pit=0,Rol=-8,Yaw=145)
    @VEL(Fwd=6.2kts)
    @CTRL(Rudd=-5)
    @SURF(Sail=Main+Jib,Reef=0)
    @ENV(Wind=<-7.5,3.5,0>)
    @NAV(Hdg=145,SPD=6.2kts)

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_BOAT);
    llSetVehicleRotationParam(VEHICLE_REFERENCE_FRAME,
        llEuler2Rot(<0.0, -8.0, 145.0> * DEG_TO_RAD));
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <6.2,0,0>);
    llSetVehicleFloatParam(VEHICLE_BUOYANCY, 1.0);
    llSetVehicleFloatParam(VEHICLE_LINEAR_FRICTION_TIMESCALE, 10.0);
    llSetVehicleFlags(VEHICLE_FLAG_REACT_TO_WIND);

### 5.4 VMN-Sub — Submarine

    @VMN(Sub) @MODE(Cruise)
    @ATT(Pit=-5,Rol=0,Yaw=270)
    @VEL(Fwd=8,Vert=-0.5)
    @ALT(m=-35)
    @CTRL(Throt=0.5,Planes=-5,Buoy=0.4)
    @ENG(RPM=800)
    @NAV(Depth=35,Hdg=270)

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_BOAT);  // Boat with negative buoyancy
    llSetVehicleFloatParam(VEHICLE_BUOYANCY, 0.4);  // < 1.0 = sinks
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <8,0,-0.5>);
    llSetVehicleRotationParam(VEHICLE_REFERENCE_FRAME,
        llEuler2Rot(<-5.0, 0.0, 270.0> * DEG_TO_RAD));

### 5.5 VMN-Car — Ground vehicle

    @VMN(Car)
    @VEL(Fwd=12.5)
    @CTRL(Throt=0.8,Steer=-15,Brake=0)
    @ENG(RPM=2800)
    @ATT(Pit=0,Rol=0,Yaw=045)

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_CAR);
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <12.5,0,0>);
    llSetVehicleFloatParam(VEHICLE_LINEAR_MOTOR_TIMESCALE, 1.0);
    llSetVehicleFloatParam(VEHICLE_ANGULAR_MOTOR_DIRECTION, -0.26); // -15 deg normalized
    llSetVehicleFlags(VEHICLE_FLAG_NO_DEFLECTION_UP);
    llSetVehicleFlags(VEHICLE_FLAG_LIMIT_ROLL_ONLY);

### 5.6 VMN-Space — Spacecraft

    @VMN(Space)
    @ATT(Pit=0,Rol=0,Yaw=090)
    @THRUST(Vec=<0,0,1>,Pct=0.3)
    @VEL(Fwd=120,Lat=0,Vert=0.5)
    @MODE(Orbit)

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_SLED);
    llSetVehicleFloatParam(VEHICLE_BUOYANCY, 1.0);     // negate gravity
    llSetVehicleFloatParam(VEHICLE_LINEAR_FRICTION_TIMESCALE, 1000.0); // no drag
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <0,0,0.3>);
    llSetVehicleFlags(VEHICLE_FLAG_HOVER_UP_ONLY);

### 5.7 VMN-Balloon — Lighter-than-air

    @VMN(Balloon)
    @ALT(m=200)
    @VEL(Lat=2.5,Vert=0.3)
    @CTRL(Buoy=0.85)
    @ENV(Wind=<3,1,0>)

Balloon drifting slowly upwind, slight climb.

LSL translation:

    llSetVehicleType(VEHICLE_TYPE_AIRPLANE);
    llSetVehicleFloatParam(VEHICLE_BUOYANCY, 0.85);
    llSetVehicleVectorParam(VEHICLE_LINEAR_MOTOR_DIRECTION, <2.5,1,0.3>);
    llSetVehicleFloatParam(VEHICLE_LINEAR_MOTOR_TIMESCALE, 20.0); // slow response

### 5.8 VMN-Drone — UAV / Quadcopter

    @VMN(Drone)
    @ATT(Pit=-5,Rol=0,Yaw=000)
    @VEL(Fwd=8,Vert=0)
    @ALT(m=30)
    @CTRL(Throt=0.7,Pitch=-5)
    @MODE(Cruise)

---

## 5b. Multi-Mode Morphing Vehicles

A morphing vehicle can transition between two or more vehicle classes during
operation. This is physically real in SL/OpenSim — llSetVehicleType() can be
called mid-flight and physics parameters interpolated between modes.

### 5b.1 @MULTI() — Multi-mode vehicle declaration

Declares all vehicle modes the craft can operate in. Always listed in order
from least-dense to most-dense medium (Space > Air > Sea > Car/Sub).

    @VMN(Multi:Air+Sea)       // seaplane — air and water modes
    @VMN(Multi:Car+Sea)       // amphibious — ground and water modes
    @VMN(Multi:Space+Air)     // spacecraft with atmospheric re-entry glide
    @VMN(Multi:Air+Sea+Car)   // full amphibious aircraft + ground taxi
    @VMN(Multi:Sub+Sea)       // submarine that surfaces as a boat

### 5b.2 @MODE(Transition:FromTo) — Active transition

Declares that the vehicle is actively morphing between two modes.

    @MODE(Transition:AirToSea)    // transitioning from Air to Sea mode
    @MODE(Transition:CarToSea)    // entering water from ground
    @MODE(Transition:SpaceToAir)  // re-entry — space to atmosphere
    @MODE(Transition:SeaToAir)    // seaplane taking off from water

### 5b.3 @PROGRESS() — Morphing progress 0.0–1.0

Describes how far through the mode transition the vehicle currently is.
0.0 = fully in source mode. 1.0 = fully in destination mode.

    @PROGRESS(0.0)    // still fully in source mode, about to begin
    @PROGRESS(0.35)   // 35% through transition
    @PROGRESS(0.65)   // 65% through — dominant in destination mode
    @PROGRESS(1.0)    // transition complete, fully in destination mode

### 5b.4 Morphing examples

**Seaplane water landing:**

    @VMN(Multi:Air+Sea) @MODE(Transition:AirToSea) @PROGRESS(0.65)
    @ATT(Pit=-8,Rol=0,Yaw=090) @VEL(Fwd=45,Vert=-3)
    ~5000ms.ease-out >> @VMN(Sea) @MODE(Taxi)

**Amphibious vehicle entering water:**

    @VMN(Multi:Car+Sea) @MODE(Transition:CarToSea) @PROGRESS(0.3)
    @VEL(Fwd=8,Vert=-0.5) @ATT(Pit=5)
    ~8000ms.ease-in >> @VMN(Sea) @MODE(Cruise)

**Spacecraft atmospheric re-entry:**

    @VMN(Multi:Space+Air) @MODE(Reentry) @PROGRESS(0.2)
    @ATT(Pit=40,Rol=0,Yaw=270) @VEL(Fwd=7800,Vert=-120)
    ~180000ms.ease-in >> @VMN(Air) @MODE(Glide)

**Seaplane takeoff from water:**

    @VMN(Multi:Air+Sea) @MODE(Transition:SeaToAir) @PROGRESS(0.4)
    @ATT(Pit=8,Rol=0,Yaw=180) @VEL(Fwd=55,Vert=3)
    ~4000ms.ease-out >> @VMN(Air) @MODE(Climb)

**Submarine surfacing:**

    @VMN(Multi:Sub+Sea) @MODE(Transition:SubToSea) @PROGRESS(0.7)
    @NAV(Depth=3,Hdg=270) @VEL(Fwd=4,Vert=0.8)
    ~30000ms.ease-out >> @VMN(Sea) @MODE(Cruise)

### 5b.5 LSL morphing bridge

Morphing is achieved by interpolating physics parameters between source and
destination vehicle type values. The @PROGRESS() value is the interpolation
factor `p` (0.0–1.0).

    // @VMN(Multi:Air+Sea) @PROGRESS(p) →
    // Interpolate between AIRPLANE and BOAT physics parameters:

    float p = 0.65;  // @PROGRESS value

    // Reduce air physics, increase sea physics:
    llSetVehicleFloatParam(VEHICLE_LINEAR_DEFLECTION_EFFICIENCY, 0.5*(1.0-p));
    llSetVehicleFloatParam(VEHICLE_ANGULAR_DEFLECTION_EFFICIENCY, 0.5*(1.0-p));
    llSetVehicleFloatParam(VEHICLE_VERTICAL_ATTRACTION_EFFICIENCY, 0.9*(1.0-p));
    llSetVehicleFloatParam(VEHICLE_BUOYANCY, p * 1.0);
    llSetVehicleFloatParam(VEHICLE_LINEAR_FRICTION_TIMESCALE, 4.0 + (6.0*p));

    // At p >= 0.95: commit to destination mode:
    if (p >= 0.95) llSetVehicleType(VEHICLE_TYPE_BOAT);

    // Mesh morph (SL shape keys / link prim animations):
    // llSetLinkPrimitiveParamsFast(LINK_THIS, [PRIM_TYPE, ...]) at each step

### 5b.6 Valid morphing mode pairs

| Pair | Direction | Use case |
|------|-----------|----------|
| Air + Sea | Both | Seaplane, flying boat |
| Car + Sea | Both | Amphibious vehicle |
| Space + Air | Space→Air | Re-entry vehicle, spaceplane |
| Air + Space | Air→Space | Rocket plane launching |
| Sub + Sea | Both | Submarine surfacing/diving |
| Car + Air | Both | Flying car (SL-possible) |
| Sea + Sub | Both | Diving tender |
| Air + Sea + Car | Any | Full amphibious aircraft |

### 5b.7 Combined HMN + morphing VMN scene string

    // Pilot as seaplane touches down — body braced, expression alert
    @VMN(Multi:Air+Sea) @MODE(Transition:AirToSea) @PROGRESS(0.5)
    @ATT(Pit=-6,Rol=0,Yaw=090) @VEL(Fwd=50,Vert=-2) @ALT(m=1)
    @MOV(Sit) @ACT(Trap:2,Bic:1) @JNT(Sp.L:Flex=5)
    @FNN(Corr:2,Orb.Oc.O:2)

This table is the formal mapping between VMN tags and their LSL equivalents.
It covers all tags defined in this specification.

### 6.1 Vehicle type mapping

| VMN class | LSL constant |
|-----------|-------------|
| @VMN(Air) | VEHICLE_TYPE_AIRPLANE |
| @VMN(Heli) | VEHICLE_TYPE_AIRPLANE + custom rotor physics |
| @VMN(Sea) | VEHICLE_TYPE_BOAT |
| @VMN(Sub) | VEHICLE_TYPE_BOAT + VEHICLE_BUOYANCY < 1.0 |
| @VMN(Car) | VEHICLE_TYPE_CAR |
| @VMN(Moto) | VEHICLE_TYPE_MOTORCYCLE |
| @VMN(Space) | VEHICLE_TYPE_SLED + VEHICLE_BUOYANCY=1.0 |
| @VMN(Balloon) | VEHICLE_TYPE_AIRPLANE + VEHICLE_BUOYANCY near 1.0 |
| @VMN(Drone) | VEHICLE_TYPE_AIRPLANE + tight timescales |
| @VMN(Sled) | VEHICLE_TYPE_SLED |

### 6.2 Float parameter mapping

| VMN tag | LSL function | LSL constant | Notes |
|---------|-------------|-------------|-------|
| @CTRL(Throt=x) | llSetVehicleFloatParam | VEHICLE_LINEAR_MOTOR_TIMESCALE | Inverse: 1-x |
| @CTRL(Brake=x) | llSetVehicleFloatParam | VEHICLE_LINEAR_FRICTION_TIMESCALE | Inverse |
| @CTRL(Buoy=x) | llSetVehicleFloatParam | VEHICLE_BUOYANCY | Direct |
| @SURF(Flap=x) | llSetVehicleFloatParam | VEHICLE_ANGULAR_DEFLECTION_EFFICIENCY | x * 0.5 |
| @ENG(RPM=x) | Custom llApplyRotationalImpulse | -- | Not native LSL param |

### 6.3 Vector parameter mapping

| VMN tag | LSL function | LSL constant |
|---------|-------------|-------------|
| @VEL(Fwd=x,Lat=y,Vert=z) | llSetVehicleVectorParam | VEHICLE_LINEAR_MOTOR_DIRECTION |
| @THRUST(Vec=<x,y,z>) | llSetVehicleVectorParam | VEHICLE_LINEAR_MOTOR_DIRECTION |
| @ENV(Wind=<x,y,z>) | llSetVehicleVectorParam | VEHICLE_WIND_SENSITIVITY_FACTOR |

### 6.4 Rotation parameter mapping

| VMN tag | LSL function | LSL constant |
|---------|-------------|-------------|
| @ATT(Pit=p,Rol=r,Yaw=y) | llSetVehicleRotationParam | VEHICLE_REFERENCE_FRAME |

Code pattern:
    llSetVehicleRotationParam(VEHICLE_REFERENCE_FRAME,
        llEuler2Rot(<Pit, Rol, Yaw> * DEG_TO_RAD));

### 6.5 Vehicle flags mapping

| VMN context | LSL flag constant |
|------------|------------------|
| @VMN(Car) | VEHICLE_FLAG_NO_DEFLECTION_UP + VEHICLE_FLAG_LIMIT_ROLL_ONLY |
| @VMN(Space) @MODE(Orbit) | VEHICLE_FLAG_HOVER_UP_ONLY |
| @VMN(Sea) with wind | VEHICLE_FLAG_REACT_TO_WIND |
| @VMN(Air) inverted flight | VEHICLE_FLAG_HOVER_WATER_ONLY (clear) |
| @SURF(Gear=Down) | Custom land detection script |

---

## 7. Temporal Notation

VMN inherits the transition operator from MNN v2.0 and FNN v1.0.

### 7.1 State transitions

    // Takeoff roll to rotate
    @VMN(Air) @MODE(Taxi) @VEL(Fwd=45) @ATT(Pit=0)
    ~3000ms.ease-in
    >> @VMN(Air) @MODE(Climb) @VEL(Fwd=75,Vert=5) @ATT(Pit=12)

    // Car braking to a stop
    @VMN(Car) @VEL(Fwd=15) @CTRL(Throt=0.8)
    ~2500ms.ease-out
    >> @VMN(Car) @VEL(Fwd=0) @CTRL(Throt=0,Brake=1.0)

### 7.2 Easing curves for vehicle physics

| Curve | Vehicle use case |
|-------|----------------|
| ease-bio | Natural flight path corrections, smooth banking |
| ease-in | Engine spooling up, gradual acceleration |
| ease-out | Braking, engine shutdown, deceleration |
| ease-snap | Collision avoidance, hard maneuver |
| ease-linear | Autopilot, rail vehicle, locked course |
| ease-spring | Suspension bounce, turbulence, wave motion |

### 7.3 Looped motion (patrol routes, orbit, idle)

    // Boat patrol route -- loop between two waypoints
    @VMN(Sea) @NAV(Dest=<64,64,0>) ~60s.ease-linear
    >> @NAV(Dest=<192,192,0>) ~60s.ease-linear @loop

    // Helicopter idle hover with subtle drift
    @VMN(Heli) @MODE(Hover) @VEL(Vert=0.2) ~2000ms.ease-bio
    >> @VEL(Vert=-0.2) ~2000ms.ease-bio @loop @cycle:4000ms

---

## 8. Compound Scene Strings (HMN + VMN)

The full power of VMN is in combination with MNN and FNN. These scene strings
can describe any inhabited vehicle state in a virtual world.

### 8.1 Pilot in cockpit

    // Small plane cruising, pilot relaxed, slight smile
    @VMN(Air) @ATT(Pit=2,Rol=0,Yaw=180) @VEL(Fwd=85) @ALT(m=600)
    @MOV(Sit) @JNT(R.Sh:Flex=25) @JNT(L.Sh:Flex=25) @ACT(Trap:1)
    @FNN(Zyg.Mj:1,Orb.Oc.O:1)

### 8.2 Racing car driver

    // Hard cornering left, driver leaning
    @VMN(Car) @VEL(Fwd=22) @CTRL(Throt=0.9,Steer=-45) @ATT(Rol=8)
    @MOV(Sit) @JNT(Sp.T:Lat=-10) @JNT(Sp.C:Rot=-15) @ACT(Trap:2,Bic:1)
    @FNN(Corr:2,Orb.Oc.O:2)

### 8.3 Submarine crew member

    // Submarine diving, crew member at controls
    @VMN(Sub) @ATT(Pit=-8,Yaw=270) @VEL(Fwd=5,Vert=-1) @NAV(Depth=25)
    @MOV(Sit) @JNT(Sp.C:Flex=10) @JNT(R.Sh:Flex=40,El:Flex=90)
    @FNN(Corr:1)

### 8.4 Sailing crew (physical effort)

    // Beating upwind, crew hiking out
    @VMN(Sea) @ATT(Rol=-25,Yaw=045) @VEL(Fwd=5.5kts) @SURF(Sail=Main+Jib)
    @MOV(Stab) @JNT(Sp.L:Lat=25) @JNT(Hip:Ext=30) @ACT(Obl.E:3,Lat:2,Ers:2)
    @FNN(Corr:2,Plat:2)

---

## 9. Navigation and Waypoint Notation

### 9.1 Single waypoint

    @VMN(Air) @NAV(Dest=<128,64,500>,Bearing=270,ETA=45s)

### 9.2 Multi-waypoint route

    // Three-waypoint flight route
    @VMN(Air) @ROUTE([<0,0,600>,<128,128,600>,<256,0,200>])
    @NAV(Seg=1,ETA=120s) @MODE(Cruise)

### 9.3 Orbit pattern

    // Fixed-wing holding pattern (aviation)
    @VMN(Air) @MODE(Hold) @NAV(Center=<128,128,600>,Radius=300m,Dir=Right)
    @ATT(Rol=25) @VEL(Fwd=70) @loop

---

## 10. Environmental Integration with ENS

VMN describes local vehicle-level environmental forces (@ENV tag).
The ENS protocol describes world-level environment state.
They compose:

    // World environment (ENS)
    @ENS(Weather:Rain=0.4,Wind=<8,2,0>,Vis=800m)

    // Vehicle state in that environment (VMN)
    @VMN(Air) @VEL(Fwd=90) @ATT(Pit=3,Rol=-10,Yaw=270)
    @ENV(Wind=<8,2,0>)   // local wind acting on this vehicle -- from ENS

The @ENV() tag inside a VMN string mirrors the relevant ENS values for
the vehicle's local physics calculation.

---

## 11. Prior Art and Differentiation

| System | Vehicle types | Human-readable | LSL-bridged | Body+Vehicle | Open |
|--------|-------------|----------------|------------|-------------|------|
| LSL raw | All SL types | No (raw params) | Yes (IS LSL) | No | No |
| OpenUSD | Geometry only | Partial (USDA) | No | No | Yes |
| glTF | Geometry only | No (binary) | No | No | Yes |
| COLLADA | Geometry only | XML (verbose) | No | No | Yes |
| Unity C# | Platform-specific | No | No | Partial | No |
| **VMN v1.0** | **10 classes** | **Yes (@TAG)** | **Yes (complete)** | **Yes (HMN+VMN)** | **Yes** |

VMN is the first human-readable, machine-parseable vehicle state notation with
a complete LSL bridge and native composition with human body notation (HMN).

---

## 12. Versioning

This document is VMN_SPEC_v1.md — version 1.0.0.

Version format: MAJOR.MINOR.PATCH (semantic versioning)
- MAJOR: breaking syntax changes
- MINOR: new vehicle classes or tags (backward compatible)
- PATCH: clarifications, corrections, examples

---

## 13. Intellectual Property

VMN (Vehicle Motion Notation), the VMN tag set (@VMN, @ATT, @VEL, @CTRL,
@ALT, @POS, @ENG, @SURF, @NAV, @ENV, @THRUST, @MODE, @ROUTE), the 10-class
vehicle taxonomy, the VMN-to-LSL bridge mapping tables (Sections 6.1–6.5),
the compound HMN+VMN scene string convention, and all original frameworks in
this document are © 2026 AIUNITES LLC. All Rights Reserved. DMCA Protected.

Published freely for educational and professional use. No permission required
to implement VMN in software, hardware, or research. Attribution appreciated.

Primary platform: InThisWorld (inthisworld.com) / Second Life / OpenSim.
Sister protocols under HMN: MNN (body), FNN (face), VRN (voice).
Sister protocols under VWN: BEN (buildings), ENS (environment).

---

*VMN_SPEC_v1.md*
*Version 1.0.0 -- 2026-04-03*
*AIUNITES LLC*
