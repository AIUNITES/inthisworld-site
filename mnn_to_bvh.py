#!/usr/bin/env python3
"""
mnn_to_bvh.py — MNN [Pos:] string to Second Life / OpenSim BVH converter
Part of the AIUNITES HMN (Human Movement Notation) toolchain
Version: 1.0.0  |  2026-03-15
Usage:
    python mnn_to_bvh.py "[Pos:L.Sh(Abd:90,Flex:45) L.El(Flex:60)]" --out pose.bvh
    python mnn_to_bvh.py --interactive
    python mnn_to_bvh.py --examples

Outputs a single-frame BVH file ready for upload to Second Life or OpenSim.
The BVH coordinate system used is SL/OpenSim standard:
    X+ = forward (anterior), Y+ = left, Z+ = up
    Rotations in degrees, Euler order ZYX per SL convention.
"""

import re, sys, math, argparse, os

# =============================================================================
# MNN joint symbol → SL BVH bone name mapping
# Ref: wiki.secondlife.com/wiki/Internal_Animation_Format
# =============================================================================
MNN_TO_SL = {
    # Spine / axial
    'Sp.L':  'Abdomen',
    'Sp.T':  'Chest',
    'Sp.C':  'Neck',
    'AA':    'Head',

    # Left arm chain
    'L.Sh':  'lCollar',    # shoulder = clavicle+glenohumeral combined in SL
    'L.El':  'lForeArm',
    'L.Wr':  'lHand',

    # Right arm chain
    'R.Sh':  'rCollar',
    'R.El':  'rForeArm',
    'R.Wr':  'rHand',

    # Left leg chain
    'L.Hip': 'lThigh',
    'L.Kn':  'lShin',
    'L.Ank': 'lFoot',

    # Right leg chain
    'R.Hip': 'rThigh',
    'R.Kn':  'rShin',
    'R.Ank': 'rFoot',

    # Root
    'Pelvis': 'hip',
}

# MNN axis label → SL rotation axis
# SL BVH: X = lateral (abduction/adduction), Y = sagittal (flex/extension), Z = axial (rotation/IR/ER)
# This is approximate — SL uses a non-standard axis convention per bone.
# Mapping is empirically derived from SL wiki joint rotation limits.
AXIS_MAP = {
    # (MNN_axis): (sl_x, sl_y, sl_z)  — which MNN axes contribute to SL X/Y/Z
    # Values are sign multipliers to handle left/right mirroring.

    # Shoulder: Abd maps to X (mediolateral), Flex maps to Y (anterior), IR/ER maps to Z
    'L.Sh': {'Abd': ('x',  1), 'Flex': ('y',  1), 'IR':  ('z',  1), 'ER':  ('z', -1)},
    'R.Sh': {'Abd': ('x', -1), 'Flex': ('y',  1), 'IR':  ('z', -1), 'ER':  ('z',  1)},

    # Elbow: Flex only (hinge joint)
    'L.El': {'Flex': ('y',  1)},
    'R.El': {'Flex': ('y', -1)},

    # Wrist
    'L.Wr': {'Flex': ('y',  1), 'Rad': ('x', -1), 'Uln': ('x',  1)},
    'R.Wr': {'Flex': ('y',  1), 'Rad': ('x',  1), 'Uln': ('x', -1)},

    # Spine: Flex=Y, Lat=X, Rot=Z
    'Sp.L': {'Flex': ('y',  1), 'Lat': ('x',  1), 'Rot': ('z',  1)},
    'Sp.T': {'Flex': ('y',  1), 'Lat': ('x',  1), 'Rot': ('z',  1)},
    'Sp.C': {'Flex': ('y',  1), 'Lat': ('x',  1), 'Rot': ('z',  1)},

    # Hip: Flex=Y, Abd=X, IR/ER=Z
    'L.Hip': {'Flex': ('y',  1), 'Abd': ('x', -1), 'IR':  ('z', -1), 'ER':  ('z',  1)},
    'R.Hip': {'Flex': ('y',  1), 'Abd': ('x',  1), 'IR':  ('z',  1), 'ER':  ('z', -1)},

    # Knee: Flex only
    'L.Kn': {'Flex': ('y', -1)},
    'R.Kn': {'Flex': ('y',  1)},

    # Ankle: Dors=dorsiflexion (toes up), Plan=plantarflexion (toes down)
    'L.Ank': {'Dors': ('y', -1), 'Plan': ('y',  1), 'Inv': ('x',  1), 'Ev': ('x', -1)},
    'R.Ank': {'Dors': ('y', -1), 'Plan': ('y',  1), 'Inv': ('x', -1), 'Ev': ('x',  1)},
}

# Default T-pose for SL — all joints at 0 except the reference hip
# SL BVH requires frame 1 = reference (T-pose), frame 2 = actual pose
SL_BONES_ORDER = [
    'hip',
    'Abdomen', 'Chest', 'Neck', 'Head',
    'lCollar', 'lShldr', 'lForeArm', 'lHand',
    'rCollar', 'rShldr', 'rForeArm', 'rHand',
    'lThigh',  'lShin',  'lFoot',
    'rThigh',  'rShin',  'rFoot',
]

# SL BVH hierarchy: parent→children
# Source: wiki.secondlife.com/wiki/How_to_create_animations
BVH_HIERARCHY = """\
HIERARCHY
ROOT hip
{{
\tOFFSET 0.00 0.00 0.00
\tCHANNELS 6 Xposition Yposition Zposition Zrotation Xrotation Yrotation
\tJOINT Abdomen
\t{{
\t\tOFFSET 0.00 3.422 0.00
\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\tJOINT Chest
\t\t{{
\t\t\tOFFSET 0.00 8.488 -0.77
\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\tJOINT Neck
\t\t\t{{
\t\t\t\tOFFSET 0.00 10.486 -0.77
\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\tJOINT Head
\t\t\t\t{{
\t\t\t\t\tOFFSET 0.00 3.500 0.00
\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\tEnd Site
\t\t\t\t\t{{
\t\t\t\t\t\tOFFSET 0.00 3.500 0.00
\t\t\t\t\t}}
\t\t\t\t}}
\t\t\t}}
\t\t\tJOINT lCollar
\t\t\t{{
\t\t\t\tOFFSET 3.500 10.000 -0.77
\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\tJOINT lShldr
\t\t\t\t{{
\t\t\t\t\tOFFSET 3.500 0.00 0.00
\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\tJOINT lForeArm
\t\t\t\t\t{{
\t\t\t\t\t\tOFFSET 10.000 0.00 0.00
\t\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\t\tJOINT lHand
\t\t\t\t\t\t{{
\t\t\t\t\t\t\tOFFSET 11.000 0.00 0.00
\t\t\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\t\t\tEnd Site
\t\t\t\t\t\t\t{{
\t\t\t\t\t\t\t\tOFFSET 5.000 0.00 0.00
\t\t\t\t\t\t\t}}
\t\t\t\t\t\t}}
\t\t\t\t\t}}
\t\t\t\t}}
\t\t\t}}
\t\t\tJOINT rCollar
\t\t\t{{
\t\t\t\tOFFSET -3.500 10.000 -0.77
\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\tJOINT rShldr
\t\t\t\t{{
\t\t\t\t\tOFFSET -3.500 0.00 0.00
\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\tJOINT rForeArm
\t\t\t\t\t{{
\t\t\t\t\t\tOFFSET -10.000 0.00 0.00
\t\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\t\tJOINT rHand
\t\t\t\t\t\t{{
\t\t\t\t\t\t\tOFFSET -11.000 0.00 0.00
\t\t\t\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\t\t\t\tEnd Site
\t\t\t\t\t\t\t{{
\t\t\t\t\t\t\t\tOFFSET -5.000 0.00 0.00
\t\t\t\t\t\t\t}}
\t\t\t\t\t\t}}
\t\t\t\t\t}}
\t\t\t\t}}
\t\t\t}}
\t\t}}
\t}}
\tJOINT lThigh
\t{{
\t\tOFFSET 5.627 -1.501 1.500
\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\tJOINT lShin
\t\t{{
\t\t\tOFFSET 0.00 -15.000 0.00
\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\tJOINT lFoot
\t\t\t{{
\t\t\t\tOFFSET 0.00 -15.000 0.00
\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\tEnd Site
\t\t\t\t{{
\t\t\t\t\tOFFSET 0.00 -3.500 4.000
\t\t\t\t}}
\t\t\t}}
\t\t}}
\t}}
\tJOINT rThigh
\t{{
\t\tOFFSET -5.627 -1.501 1.500
\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\tJOINT rShin
\t\t{{
\t\t\tOFFSET 0.00 -15.000 0.00
\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\tJOINT rFoot
\t\t\t{{
\t\t\t\tOFFSET 0.00 -15.000 0.00
\t\t\t\tCHANNELS 3 Zrotation Xrotation Yrotation
\t\t\t\tEnd Site
\t\t\t\t{{
\t\t\t\t\tOFFSET 0.00 -3.500 4.000
\t\t\t\t}}
\t\t\t}}
\t\t}}
\t}}
}}
"""

# =============================================================================
# MNN PARSER
# =============================================================================
def parse_mnn(mnn_string):
    """Parse an MNN string and return a dict of {joint_symbol: {axis: degrees}}."""
    joints = {}
    for block in re.finditer(r'\[Pos:([^\]]+)\]', mnn_string):
        for jm in re.finditer(r'([LRBi]*\.?[A-Za-z.]+)\(([^)]+)\)', block.group(1)):
            symbol = jm.group(1).strip()
            axes = {}
            for am in re.finditer(r'([A-Za-z]+):\s*(-?\d+(?:\.\d+)?)', jm.group(2)):
                axes[am.group(1)] = float(am.group(2))
            joints[symbol] = axes
    return joints

# =============================================================================
# CONVERT MNN JOINTS → SL BVH ROTATION DICT
# =============================================================================
def mnn_to_sl_rotations(mnn_joints):
    """
    Convert parsed MNN joint dict to SL bone rotation dict.
    Returns {sl_bone_name: (x_deg, y_deg, z_deg)}
    """
    sl_rots = {bone: [0.0, 0.0, 0.0] for bone in SL_BONES_ORDER}

    for mnn_sym, axes in mnn_joints.items():
        if mnn_sym not in MNN_TO_SL:
            print(f"  [warn] Unknown MNN joint '{mnn_sym}' — skipped")
            continue
        sl_bone = MNN_TO_SL[mnn_sym]
        if sl_bone not in sl_rots:
            print(f"  [warn] SL bone '{sl_bone}' not in skeleton — skipped")
            continue

        ax_map = AXIS_MAP.get(mnn_sym, {})
        rot = sl_rots[sl_bone]

        for mnn_axis, deg in axes.items():
            if mnn_axis not in ax_map:
                print(f"  [info] Axis '{mnn_axis}' on '{mnn_sym}' has no SL mapping — skipped")
                continue
            sl_axis, sign = ax_map[mnn_axis]
            idx = {'x': 0, 'y': 1, 'z': 2}[sl_axis]
            rot[idx] += deg * sign

        # Special case: SL separates lCollar→lShldr; copy shoulder to lShldr
        if sl_bone == 'lCollar':
            sl_rots['lShldr'] = list(rot)
        elif sl_bone == 'rCollar':
            sl_rots['rShldr'] = list(rot)

    return sl_rots

# =============================================================================
# BVH FRAME DATA BUILDER
# =============================================================================
def build_frame_data(sl_rots, is_reference=False):
    """
    Build one BVH frame line.
    Reference frame (frame 1): T-pose, all zeros except hip translation.
    Pose frame (frame 2): actual rotations.
    BVH channel order per bone: Zrotation Xrotation Yrotation
    Hip has 6 channels: Xpos Ypos Zpos Zrot Xrot Yrot
    """
    values = []

    for bone in SL_BONES_ORDER:
        if bone == 'hip':
            # Hip position — keep at 0 for static pose
            values += [0.0, 0.0, 0.0]

        rot = sl_rots.get(bone, [0.0, 0.0, 0.0])
        if is_reference:
            # Reference frame: use tiny non-zero values so SL recognises
            # each bone as "to be animated". SL ignores joints at exactly 0
            # in the reference frame. Use 0.001 per SL wiki recommendation.
            z, x, y = 0.001, 0.001, 0.001
        else:
            x, y, z = rot[0], rot[1], rot[2]

        values += [z, x, y]  # SL channel order: Z X Y

    return '\t'.join(f'{v:.6f}' for v in values)

# =============================================================================
# MAIN CONVERTER
# =============================================================================
def convert(mnn_string, output_path, fps=30, label='MNN pose'):
    """Convert an MNN [Pos:] string to a SL/OpenSim-compatible BVH file."""
    print(f"\nMNN → BVH Converter  |  AIUNITES HMN v1.6")
    print(f"Input:  {mnn_string[:80]}{'...' if len(mnn_string)>80 else ''}")
    print(f"Output: {output_path}")

    # Parse
    mnn_joints = parse_mnn(mnn_string)
    if not mnn_joints:
        print("  [error] No [Pos:] data found in MNN string.")
        return False

    print(f"  Parsed joints: {list(mnn_joints.keys())}")

    # Convert
    sl_rots = mnn_to_sl_rotations(mnn_joints)

    # Count channels for MOTION section
    # hip = 6 channels, all others = 3
    total_channels = 6 + (len(SL_BONES_ORDER) - 1) * 3

    # Build BVH
    frame_time = 1.0 / fps
    ref_frame  = build_frame_data(sl_rots, is_reference=True)
    pose_frame = build_frame_data(sl_rots, is_reference=False)

    bvh = BVH_HIERARCHY
    bvh += f"MOTION\n"
    bvh += f"Frames:\t2\n"
    bvh += f"Frame Time:\t{frame_time:.6f}\n"
    bvh += ref_frame  + "\n"
    bvh += pose_frame + "\n"

    # Write
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(bvh)

    size = os.path.getsize(output_path)
    print(f"  Written: {size} bytes  |  2 frames @ {fps}fps")
    print(f"  Upload to SL/OpenSim via: Inventory > Upload Animation > {output_path}")
    print(f"  Set Priority: 4, Loop: off for static pose")
    return True

# =============================================================================
# EXAMPLE POSES
# =============================================================================
EXAMPLES = {
    'tpose':    '[Pos:L.Sh(Abd:90) R.Sh(Abd:90) L.Hip(Abd:5) R.Hip(Abd:5)]',
    'squat':    '[Pos:L.Hip(Flex:90,Abd:20) R.Hip(Flex:90,Abd:20) L.Kn(Flex:100) R.Kn(Flex:100)]',
    'wave':     '[Pos:R.Sh(Abd:155,Flex:20) R.El(Flex:35)]',
    'ohpress':  '[Pos:L.Sh(Abd:175,Flex:10) R.Sh(Abd:175,Flex:10) L.El(Flex:15) R.El(Flex:15)]',
    'curl':     '[Pos:L.Sh(Abd:10) L.El(Flex:130) R.Sh(Abd:10) R.El(Flex:10)]',
    'run':      '[Pos:L.Hip(Flex:60,Abd:5) R.Hip(Flex:20,Abd:5) L.Kn(Flex:30) R.Kn(Flex:80) L.Sh(Abd:35,Flex:30) R.Sh(Abd:35,Flex:-20) L.El(Flex:90) R.El(Flex:85) Sp.L(Rot:10)]',
}

# =============================================================================
# CLI
# =============================================================================
def main():
    parser = argparse.ArgumentParser(
        description='Convert MNN [Pos:] string to Second Life / OpenSim BVH',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python mnn_to_bvh.py "[Pos:L.Sh(Abd:90) R.Sh(Abd:90)]" --out tpose.bvh
  python mnn_to_bvh.py --example wave --out wave.bvh
  python mnn_to_bvh.py --examples
  python mnn_to_bvh.py --interactive
        """
    )
    parser.add_argument('mnn', nargs='?', help='MNN string containing [Pos:] tag')
    parser.add_argument('--out', default='pose.bvh', help='Output BVH file path (default: pose.bvh)')
    parser.add_argument('--fps', type=int, default=30, help='Frame rate (default: 30)')
    parser.add_argument('--example', choices=list(EXAMPLES.keys()), help='Use a built-in example pose')
    parser.add_argument('--examples', action='store_true', help='Convert all built-in examples')
    parser.add_argument('--interactive', action='store_true', help='Interactive mode — paste MNN strings')

    args = parser.parse_args()

    if args.examples:
        out_dir = os.path.dirname(args.out) or '.'
        for name, mnn in EXAMPLES.items():
            path = os.path.join(out_dir, f'{name}.bvh')
            convert(mnn, path, args.fps, name)
        return

    if args.example:
        mnn = EXAMPLES[args.example]
        convert(mnn, args.out, args.fps, args.example)
        return

    if args.interactive:
        print("MNN → BVH Interactive Mode  (type 'quit' to exit)")
        print("Paste an MNN string containing [Pos:] tags:\n")
        while True:
            try:
                mnn = input('MNN> ').strip()
                if mnn.lower() in ('quit', 'exit', 'q'):
                    break
                if not mnn:
                    continue
                name = input('Output filename (default: pose.bvh)> ').strip() or 'pose.bvh'
                convert(mnn, name, args.fps)
                print()
            except (KeyboardInterrupt, EOFError):
                break
        return

    if args.mnn:
        convert(args.mnn, args.out, args.fps)
        return

    parser.print_help()

if __name__ == '__main__':
    main()
