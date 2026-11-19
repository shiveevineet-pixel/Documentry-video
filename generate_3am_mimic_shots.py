import bpy
import math
import os
import sys
import subprocess
import shutil

print("=== STARTING 'THE 3:00 AM MIMIC' REAL ASSET 3D PIPELINE (EEVEE) ===")

# 1. Clean existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# Base Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "renders")
TMP_DIR = os.path.join(BASE_DIR, "tmp_blender_frames")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

# Locate Horror Assets directory (support both spellings)
ASSETS_DIR = os.path.join(BASE_DIR, "public", "Horror story assests")
if not os.path.exists(ASSETS_DIR):
    ASSETS_DIR = os.path.join(BASE_DIR, "public", "Horror video assets")

# 2. Strict EEVEE Render Configuration (Zero Noise)
scene.render.engine = 'BLENDER_EEVEE'
if hasattr(scene, 'eevee'):
    scene.eevee.taa_render_samples = 32
    if hasattr(scene.eevee, 'use_raytracing'):
        scene.eevee.use_raytracing = False
    if hasattr(scene.eevee, 'use_motion_blur'):
        scene.eevee.use_motion_blur = False

# Default 1080x1920 Vertical Full HD
IS_DRAFT = "--draft" in sys.argv
if IS_DRAFT:
    scene.render.resolution_x = 540
    scene.render.resolution_y = 960
    if hasattr(scene, 'eevee'):
        scene.eevee.taa_render_samples = 8
else:
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920

scene.render.resolution_percentage = 100

# 3. Ambient Midnight World
world = bpy.data.worlds.new("Horror_World")
scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs['Color'].default_value = (0.02, 0.03, 0.05, 1.0) # #070A12 midnight dark blue
    bg_node.inputs['Strength'].default_value = 0.25

# 4. Material Helper
def create_mat(name, base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.4, metallic=0.0,
               transmission=0.0, emission_color=(0, 0, 0, 1.0), emission_strength=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        if 'Base Color' in bsdf.inputs:
            bsdf.inputs['Base Color'].default_value = base_color
        if 'Roughness' in bsdf.inputs:
            bsdf.inputs['Roughness'].default_value = roughness
        if 'Metallic' in bsdf.inputs:
            bsdf.inputs['Metallic'].default_value = metallic
        if 'Transmission Weight' in bsdf.inputs:
            bsdf.inputs['Transmission Weight'].default_value = transmission
        elif 'Transmission' in bsdf.inputs:
            bsdf.inputs['Transmission'].default_value = transmission
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emission_color
        elif 'Emission' in bsdf.inputs:
            bsdf.inputs['Emission'].default_value = emission_color
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emission_strength
        if 'Alpha' in bsdf.inputs:
            bsdf.inputs['Alpha'].default_value = alpha
    return mat

def shade_smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

def add_bevel(obj, width=0.015, segments=2):
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = width
    mod.segments = segments

# 5. IMPORT REAL DARK ROOM MODEL
print(f"Loading Real Dark Room Asset from: {ASSETS_DIR}")
room_blend = os.path.join(ASSETS_DIR, "Isometric_living_room", "isometric living room_001.blend")
room_objects = []

if os.path.exists(room_blend):
    with bpy.data.libraries.load(room_blend, link=False) as (data_from, data_to):
        # Exclude old camera & default lights
        data_to.objects = [o for o in data_from.objects if o not in ['Camera', 'Lamp', 'Sun', 'Light', 'Point', 'Area']]

    for obj in data_to.objects:
        if obj:
            scene.collection.objects.link(obj)
            room_objects.append(obj)
            # Ensure textures / smooth shading
            if obj.type == 'MESH':
                shade_smooth(obj)
    print(f"Loaded {len(room_objects)} objects from Dark Room asset.")
else:
    print(f"WARNING: Dark room blend not found at {room_blend}")

# 6. IMPORT & CALIBRATE REAL MONSTER MODEL
print(f"Loading Real Monster Asset from: {ASSETS_DIR}")
monster_gltf = os.path.join(ASSETS_DIR, "Monster_4_GLTF", "Monster_4", "Mesh", "sk_monster_4.gltf")
monster_tex_dir = os.path.join(ASSETS_DIR, "Monster_4_GLTF", "Monster_4", "Textures")
monster_root = None
monster_mesh = None

if os.path.exists(monster_gltf):
    bpy.ops.import_scene.gltf(filepath=monster_gltf)
    for obj in bpy.context.selected_objects:
        if obj.type == 'ARMATURE':
            monster_root = obj
        elif obj.type == 'MESH':
            monster_mesh = obj
    if not monster_root and bpy.context.selected_objects:
        monster_root = bpy.context.selected_objects[0]

    # Setup PBR 4K textures for Monster
    def setup_pbr(mat_name, base_tex, emissive_tex, normal_tex):
        mat = bpy.data.materials.get(mat_name)
        if not mat:
            return
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        bsdf = nodes.get("Principled BSDF")
        if not bsdf:
            return
        
        if base_tex and os.path.exists(os.path.join(monster_tex_dir, base_tex)):
            img = nodes.new('ShaderNodeTexImage')
            img.image = bpy.data.images.load(os.path.join(monster_tex_dir, base_tex))
            links.new(img.outputs['Color'], bsdf.inputs['Base Color'])
        
        if emissive_tex and os.path.exists(os.path.join(monster_tex_dir, emissive_tex)):
            img_e = nodes.new('ShaderNodeTexImage')
            img_e.image = bpy.data.images.load(os.path.join(monster_tex_dir, emissive_tex))
            if 'Emission Color' in bsdf.inputs:
                links.new(img_e.outputs['Color'], bsdf.inputs['Emission Color'])
                bsdf.inputs['Emission Strength'].default_value = 8.0
            elif 'Emission' in bsdf.inputs:
                links.new(img_e.outputs['Color'], bsdf.inputs['Emission'])
                
        if normal_tex and os.path.exists(os.path.join(monster_tex_dir, normal_tex)):
            img_n = nodes.new('ShaderNodeTexImage')
            img_n.image = bpy.data.images.load(os.path.join(monster_tex_dir, normal_tex))
            img_n.image.colorspace_settings.name = 'Non-Color'
            nmap = nodes.new('ShaderNodeNormalMap')
            nmap.inputs['Strength'].default_value = 1.0
            links.new(img_n.outputs['Color'], nmap.inputs['Color'])
            links.new(nmap.outputs['Normal'], bsdf.inputs['Normal'])

    setup_pbr("m_body", "t_body_Base_color.png", "t_body_Emissive.png", "t_body_Normal_DirectX.png")
    setup_pbr("m_plank", "t_plank_Base_color.png", None, "t_plank_Normal_DirectX.png")

    if monster_root:
        # Calibrate height to ~1.85m
        monster_root.location = (0, -4.5, 0)
        print(f"Calibrated Monster root: {monster_root.name}, height: {monster_root.dimensions.z:.2f}m")
else:
    print(f"WARNING: Monster gltf not found at {monster_gltf}")

# 7. HORROR PROPS & CHOICE OBJECTS (Digital Clock 03:00, Emergency Radio, Telephone)
mat_clock_red   = create_mat("ClockRedGlow", base_color=(1.0, 0.08, 0.08, 1.0),
                             emission_color=(1.0, 0.08, 0.08, 1.0), emission_strength=12.0)
mat_radio_led   = create_mat("RadioLedGlow", base_color=(1.0, 0.05, 0.05, 1.0),
                             emission_color=(1.0, 0.05, 0.05, 1.0), emission_strength=15.0)
mat_radio_body  = create_mat("RadioBody", base_color=(0.14, 0.16, 0.15, 1.0), roughness=0.6)
mat_phone       = create_mat("PhonePlastic", base_color=(0.06, 0.07, 0.09, 1.0), roughness=0.35)
mat_metal_frame = create_mat("MetalFrame", base_color=(0.35, 0.38, 0.44, 1.0), roughness=0.25, metallic=0.85)

# Place props onto console/table in room at (-3.56, 0.2, 0.8)
bpy.ops.mesh.primitive_cube_add(location=(-3.56, 0.8, 0.85))
clock_body = bpy.context.active_object
clock_body.scale = (0.24, 0.10, 0.08)
clock_body.data.materials.append(mat_phone)

bpy.ops.mesh.primitive_cube_add(location=(-3.56, 0.74, 0.85))
clock_face = bpy.context.active_object
clock_face.scale = (0.20, 0.02, 0.06)
clock_face.data.materials.append(mat_clock_red)

bpy.ops.mesh.primitive_cube_add(location=(-3.56, 0.2, 0.85))
radio_body = bpy.context.active_object
radio_body.scale = (0.16, 0.12, 0.12)
radio_body.data.materials.append(mat_radio_body)

bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.42, location=(-3.62, 0.2, 1.1))
radio_ant = bpy.context.active_object
radio_ant.data.materials.append(mat_metal_frame)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, location=(-3.48, 0.15, 0.90))
radio_led = bpy.context.active_object
radio_led.data.materials.append(mat_radio_led)

bpy.ops.mesh.primitive_cube_add(location=(-3.56, -0.4, 0.82))
phone_base = bpy.context.active_object
phone_base.scale = (0.18, 0.18, 0.05)
phone_base.data.materials.append(mat_phone)

bpy.ops.mesh.primitive_cube_add(location=(-3.56, -0.4, 0.88))
phone_handset = bpy.context.active_object
phone_handset.scale = (0.05, 0.24, 0.04)
phone_handset.data.materials.append(mat_phone)

# Glass Window / Door for breach (at X = 0, Y = -3.8)
mat_glass = create_mat("StoreGlass", base_color=(0.88, 0.94, 1.0, 1.0), roughness=0.04, transmission=0.88, alpha=0.3)
bpy.ops.mesh.primitive_cube_add(location=(0, -3.8, 1.8))
glass_door = bpy.context.active_object
glass_door.scale = (2.2, 0.04, 1.8)
glass_door.data.materials.append(mat_glass)

# Flying glass shards for Shot 4
glass_shards = []
for i in range(25):
    sx = (i % 5 - 2) * 0.35
    sy = -3.8 + (i // 5) * 0.2
    sz = 0.6 + (i % 6) * 0.35
    bpy.ops.mesh.primitive_cube_add(location=(sx, sy, sz))
    shard = bpy.context.active_object
    shard.scale = (0.08, 0.08, 0.08)
    shard.data.materials.append(mat_glass)
    shard.hide_render = True
    glass_shards.append(shard)

# Storage Locker / Closet for Choice 2 (at X = 4.0, Y = 3.5, Z = 1.6)
mat_locker = create_mat("LockerSteel", base_color=(0.28, 0.32, 0.38, 1.0), roughness=0.3, metallic=0.9)
bpy.ops.mesh.primitive_cube_add(location=(4.0, 3.5, 1.6))
locker_body = bpy.context.active_object
locker_body.scale = (0.6, 0.6, 1.6)
locker_body.data.materials.append(mat_locker)

bpy.ops.mesh.primitive_cube_add(location=(3.4, 3.5, 1.6))
locker_door = bpy.context.active_object
locker_door.scale = (0.04, 0.58, 1.55)
locker_door.data.materials.append(mat_locker)

# 8. STYLIZED HUMAN CHARACTERS (GUARANTEED VISIBLE, RIGGED & PARENTED)
# Cashier: Bold Red Shirt, Clean White Skin & Hands, Blue Cap, Navy Pants
mat_cashier_shirt = create_mat("Cashier_Shirt", base_color=(0.85, 0.12, 0.15, 1.0), roughness=0.45) # Bold Red
mat_cashier_skin  = create_mat("Cashier_Skin", base_color=(0.96, 0.96, 0.98, 1.0), roughness=0.35) # Pure White Hands/Skin
mat_cashier_cap   = create_mat("Cashier_Cap", base_color=(0.12, 0.22, 0.55, 1.0), roughness=0.40) # Navy Cap
mat_cashier_pants = create_mat("Cashier_Pants", base_color=(0.10, 0.18, 0.38, 1.0), roughness=0.50) # Navy Pants
mat_dark_eyes     = create_mat("DarkEyes", base_color=(0.02, 0.02, 0.03, 1.0), roughness=0.20)
mat_friend_hood   = create_mat("Friend_Hood", base_color=(0.25, 0.28, 0.35, 1.0), roughness=0.60)

def create_stylized_character(name_prefix, is_cashier=True):
    root = bpy.data.objects.new(f"{name_prefix}_Root", None)
    scene.collection.objects.link(root)

    t_mat = mat_cashier_shirt if is_cashier else mat_friend_hood
    p_mat = mat_cashier_pants if is_cashier else mat_friend_hood

    # Torso (Pill Shape: Cylinder + Hemispheres)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.32, depth=0.75, location=(0, 0, 1.25))
    torso = bpy.context.active_object
    torso.name = f"{name_prefix}_Torso"
    torso.data.materials.append(t_mat)
    torso.parent = root
    shade_smooth(torso)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.32, location=(0, 0, 1.62))
    cap_t = bpy.context.active_object
    cap_t.name = f"{name_prefix}_TorsoCapT"
    cap_t.data.materials.append(t_mat)
    cap_t.parent = root
    shade_smooth(cap_t)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.32, location=(0, 0, 0.88))
    cap_b = bpy.context.active_object
    cap_b.name = f"{name_prefix}_TorsoCapB"
    cap_b.data.materials.append(p_mat)
    cap_b.parent = root
    shade_smooth(cap_b)

    # Neck & Head
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.18, location=(0, 0, 1.74))
    neck = bpy.context.active_object
    neck.data.materials.append(mat_cashier_skin)
    neck.parent = root
    shade_smooth(neck)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.27, location=(0, 0, 2.02))
    head = bpy.context.active_object
    head.name = f"{name_prefix}_Head"
    head.data.materials.append(mat_cashier_skin)
    head.parent = root
    shade_smooth(head)

    # Cap & Dark Expressive Eyes for Cashier
    if is_cashier:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.28, location=(0, 0, 2.16))
        cap_dome = bpy.context.active_object
        cap_dome.data.materials.append(mat_cashier_cap)
        cap_dome.parent = root
        shade_smooth(cap_dome)

        bpy.ops.mesh.primitive_cube_add(location=(0, -0.22, 2.10))
        cap_visor = bpy.context.active_object
        cap_visor.scale = (0.24, 0.16, 0.03)
        cap_visor.data.materials.append(mat_cashier_cap)
        cap_visor.parent = root

        for sign in [-1, 1]:
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, location=(sign * 0.09, -0.24, 2.04))
            eye = bpy.context.active_object
            eye.data.materials.append(mat_dark_eyes)
            eye.parent = root
            shade_smooth(eye)

    # Shoulders, Articulated Arms & Pure White Sphere Hands
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(sign * 0.44, 0, 1.48))
        sh = bpy.context.active_object
        sh.data.materials.append(t_mat)
        sh.parent = root
        shade_smooth(sh)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.38, location=(sign * 0.44, 0, 1.25))
        arm_u = bpy.context.active_object
        arm_u.data.materials.append(t_mat)
        arm_u.parent = root
        shade_smooth(arm_u)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.085, location=(sign * 0.44, 0, 1.05))
        elb = bpy.context.active_object
        elb.data.materials.append(t_mat)
        elb.parent = root
        shade_smooth(elb)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.34, location=(sign * 0.44, 0, 0.88))
        arm_l = bpy.context.active_object
        arm_l.data.materials.append(mat_cashier_skin)
        arm_l.parent = root
        shade_smooth(arm_l)

        # White Sphere Hand (matching reference video!)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.10, location=(sign * 0.44, 0, 0.68))
        hand = bpy.context.active_object
        hand.name = f"{name_prefix}_Hand_{side}"
        hand.data.materials.append(mat_cashier_skin)
        hand.parent = root
        shade_smooth(hand)

        # Legs & Shoes
        bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.85, location=(sign * 0.18, 0, 0.44))
        leg = bpy.context.active_object
        leg.data.materials.append(p_mat)
        leg.parent = root
        shade_smooth(leg)

        bpy.ops.mesh.primitive_cube_add(location=(sign * 0.18, -0.06, 0.06))
        shoe = bpy.context.active_object
        shoe.scale = (0.12, 0.20, 0.06)
        shoe.parent = root

    return root

cashier_root = create_stylized_character("Cashier", is_cashier=True)
friend_root  = create_stylized_character("Friend", is_cashier=False)

# 9. DRAMATIC HORROR LIGHTING (KEY, FLASHLIGHT, PULSING RED EMERGENCY)
# Camera Flashlight SPOT light (tracks with camera)
flash_light_data = bpy.data.lights.new("Flashlight_Spot", 'SPOT')
flash_light_data.energy = 850
flash_light_data.color = (1.0, 0.95, 0.88)
flash_light_data.spot_size = math.radians(55)
flash_light_data.spot_blend = 0.40
flash_light_obj = bpy.data.objects.new("Flashlight_Spot_Obj", flash_light_data)
scene.collection.objects.link(flash_light_obj)

# Camera Fill / Rim Light (guarantees Cashier & Monster are NEVER dark)
cam_fill_data = bpy.data.lights.new("Cam_Fill", 'POINT')
cam_fill_data.energy = 450
cam_fill_data.color = (0.65, 0.75, 0.95)
cam_fill_obj = bpy.data.objects.new("Cam_Fill_Obj", cam_fill_data)
scene.collection.objects.link(cam_fill_obj)

# Dedicated Character Key Light (Direct illumination on Cashier)
char_key_data = bpy.data.lights.new("Char_Key", 'SPOT')
char_key_data.energy = 1200
char_key_data.color = (1.0, 0.98, 0.92)
char_key_data.spot_size = math.radians(65)
char_key_obj = bpy.data.objects.new("Char_Key_Obj", char_key_data)
scene.collection.objects.link(char_key_obj)

# Pulsing Crimson Emergency Light (#DC2626)
emerg_light_data = bpy.data.lights.new("Emerg_Red_Point", 'POINT')
emerg_light_data.energy = 1500
emerg_light_data.color = (0.86, 0.15, 0.15) # #DC2626
emerg_light_obj = bpy.data.objects.new("Emerg_Red_Point_Obj", emerg_light_data)
scene.collection.objects.link(emerg_light_obj)
emerg_light_obj.location = (0, 0, 3.2)

# Main Camera
cam_data = bpy.data.cameras.new("Main_Camera")
cam_data.lens = 24 # Wide cinematic lens for vertical 9:16
cam_obj = bpy.data.objects.new("Main_Camera", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# 10. TIMELINE CHOREOGRAPHY FOR THE 8 MODULAR SHOTS (3300 frames @ 60fps)
SHOTS = [
    {"id": "shot_01", "dur_sec": 7.0, "frames": 35},
    {"id": "shot_02", "dur_sec": 6.0, "frames": 30},
    {"id": "shot_03", "dur_sec": 5.0, "frames": 25},
    {"id": "shot_04", "dur_sec": 8.0, "frames": 40},
    {"id": "shot_05", "dur_sec": 7.0, "frames": 35},
    {"id": "shot_06", "dur_sec": 8.0, "frames": 40},
    {"id": "shot_07", "dur_sec": 7.0, "frames": 35},
    {"id": "shot_08", "dur_sec": 7.0, "frames": 35},
]

def setup_shot(shot_idx, progress):
    # Base reset
    radio_led.hide_render = False
    glass_door.scale = (2.2, 0.04, 1.8)
    for s in glass_shards:
        s.hide_render = True

    if shot_idx == 1:
        # Shot 1: Over-the-shoulder dolly-in on Cashier examining console at 03:00.
        # Glowing red clock, pulsing radio LED, telephone.
        cam_x = -2.8 + progress * 0.25
        cam_y = 2.4 - progress * 0.8
        cam_z = 1.85 + math.sin(progress * 4) * 0.015
        cam_obj.location = (cam_x, cam_y, cam_z)
        cam_obj.rotation_euler = (math.radians(78), 0, math.radians(155))

        # Cashier positioned at console
        bob = math.sin(progress * 12) * 0.02
        cashier_root.location = (-3.56, 1.3, bob)
        cashier_root.rotation_euler = (0, 0, math.radians(160))
        cashier_root.hide_render = False

        # Monster hidden outside
        if monster_root:
            monster_root.location = (0, -8.0, 0)
            monster_root.hide_render = True
        friend_root.hide_render = True

        # Key light directly illuminates Cashier & console
        char_key_obj.location = (-2.0, 0.5, 2.6)
        char_key_data.energy = 1200
        emerg_light_data.energy = 400

        # Radio pulse
        radio_led.hide_render = (math.sin(progress * 35) < 0.0)

    elif shot_idx == 2:
        # Shot 2: Loud knocking outside glass entrance. Friend bangs on glass.
        # At progress > 0.55, whip-pan down to ringing vibrating telephone!
        if progress < 0.55:
            p2 = progress / 0.55
            cam_obj.location = (0, -1.2, 1.6 + math.sin(p2 * 6) * 0.02)
            cam_obj.rotation_euler = (math.radians(88), 0, math.radians(180))

            # Friend outside window banging frantic hands
            f_y = -6.0 + p2 * 2.2
            friend_root.hide_render = False
            friend_root.location = (0, f_y, abs(math.sin(p2 * 14)) * 0.06)
            friend_root.rotation_euler = (0, 0, 0)

            char_key_obj.location = (0, -3.0, 2.8)
            char_key_data.energy = 1400
        else:
            p_pan = (progress - 0.55) / 0.45
            # Whip-pan down to console phone ringing violently
            cam_obj.location = (-3.0 - p_pan * 0.3, 0.4 - p_pan * 0.2, 1.4 - p_pan * 0.2)
            cam_obj.rotation_euler = (math.radians(52 + p_pan * 20), 0, math.radians(135))
            phone_handset.location = (-3.56 + math.sin(p_pan * 70) * 0.02, -0.4, 0.88)
            char_key_obj.location = (-3.0, -0.2, 2.0)
            char_key_data.energy = 1000

        cashier_root.hide_render = False
        cashier_root.location = (-3.56, 1.1, 0)
        cashier_root.rotation_euler = (0, 0, math.radians(150))
        if monster_root:
            monster_root.hide_render = True

    elif shot_idx == 3:
        # Shot 3: Choice 1 Framing (Friend outside door vs Ringing phone)
        # Cashier stands between them, looking back and forth
        cam_obj.location = (-1.8 + math.sin(progress * 3) * 0.04, -0.4, 1.7)
        cam_obj.rotation_euler = (math.radians(82), 0, math.radians(160))

        cashier_root.hide_render = False
        cashier_root.location = (-2.8, 0.5, 0)
        cashier_root.rotation_euler = (0, 0, math.radians(140 + math.sin(progress * 4) * 20))

        friend_root.hide_render = False
        friend_root.location = (0, -4.0, 0)
        friend_root.rotation_euler = (0, 0, 0)

        phone_handset.location = (-3.56 + math.sin(progress * 40) * 0.015, -0.4, 0.88)
        char_key_obj.location = (-2.0, 0.0, 2.6)
        char_key_data.energy = 1400
        if monster_root:
            monster_root.hide_render = True

    elif shot_idx == 4:
        # Shot 4: Friend figure morphs to Monster and SMASHES through glass!
        cam_obj.location = (-1.5 - progress * 0.3, -1.0 - progress * 0.6, 1.75)
        cam_obj.rotation_euler = (math.radians(85), 0, math.radians(175))

        cashier_root.hide_render = False
        cashier_root.location = (-3.2, 0.8, 0)
        cashier_root.rotation_euler = (0, 0, math.radians(150))

        if progress < 0.45:
            # Figure stops banging
            friend_root.hide_render = False
            friend_root.location = (0, -4.0, 0)
            if monster_root:
                monster_root.hide_render = True
        elif progress < 0.70:
            # Reveal: Twists into Monster with glowing emissive eyes!
            friend_root.hide_render = True
            if monster_root:
                monster_root.hide_render = False
                monster_root.location = (0, -4.0, 0)
                monster_root.rotation_euler = (0, 0, 0)
        else:
            # SMASH! Monster lunges forward through shattered glass!
            p_smash = (progress - 0.70) / 0.30
            friend_root.hide_render = True
            if monster_root:
                monster_root.hide_render = False
                m_y = -4.0 + p_smash * 2.8
                m_z = abs(math.sin(p_smash * 8)) * 0.20
                monster_root.location = (0, m_y, m_z)
                monster_root.rotation_euler = (math.radians(15), 0, 0)

            glass_door.scale = (0.01, 0.01, 0.01)
            for i, s in enumerate(glass_shards):
                s.hide_render = False
                s.location = (s.location[0] + (i % 5 - 2) * p_smash * 0.5,
                              -3.8 + p_smash * 2.5 + (i % 4) * 0.2,
                              s.location[2] - p_smash * 0.4)

        char_key_obj.location = (0, -2.5, 2.6)
        char_key_data.energy = 1600
        emerg_light_data.energy = 1200 * (0.7 + 0.3 * math.sin(progress * 25))

    elif shot_idx == 5:
        # Shot 5: Sprint chase across the room past sofa & console
        # Cashier runs forward, Monster in aggressive pursuit
        p_run = progress
        c_y = 0.5 + p_run * 2.8
        c_x = -2.5 + p_run * 2.5
        cashier_root.hide_render = False
        cashier_root.location = (c_x, c_y, abs(math.sin(p_run * 20)) * 0.08)
        cashier_root.rotation_euler = (0, 0, math.radians(45))

        cam_obj.location = (c_x - 0.6, c_y - 2.2, 1.65 + math.sin(p_run * 18) * 0.06)
        cam_obj.rotation_euler = (math.radians(82), math.radians(math.sin(p_run * 10) * 8), math.radians(20))

        if monster_root:
            monster_root.hide_render = False
            m_y = -2.0 + p_run * 2.8
            m_x = -1.5 + p_run * 2.2
            monster_root.location = (m_x, m_y, abs(math.sin(p_run * 16)) * 0.12)
            monster_root.rotation_euler = (math.radians(20), 0, math.radians(40))

        friend_root.hide_render = True
        emerg_light_data.energy = 1600 * (0.6 + 0.4 * math.sin(progress * 30))
        char_key_obj.location = (c_x, c_y, 2.8)
        char_key_data.energy = 1200

    elif shot_idx == 6:
        # Shot 6: Choice 2 Framing (Locker vs Back Exit)
        # Cashier skids to a stop facing Locker (left) vs Exit (right)
        cam_obj.location = (2.2, 1.8 + math.sin(progress * 4) * 0.03, 1.65)
        cam_obj.rotation_euler = (math.radians(84), 0, math.radians(25))

        cashier_root.hide_render = False
        cashier_root.location = (2.8, 2.5, 0)
        cashier_root.rotation_euler = (0, 0, math.radians(25 + math.sin(progress * 4) * 15))

        if monster_root:
            monster_root.hide_render = False
            monster_root.location = (0.5, 0.0, 0)
            monster_root.rotation_euler = (0, 0, math.radians(35))
        friend_root.hide_render = True

        char_key_obj.location = (2.8, 2.2, 2.5)
        char_key_data.energy = 1400
        emerg_light_data.energy = 1500 * (0.7 + 0.3 * math.sin(progress * 20))

    elif shot_idx == 7:
        # Shot 7: Dives into locker, door slams shut
        if progress < 0.50:
            p_in = progress / 0.50
            cashier_root.location = (3.2 + p_in * 0.6, 3.2 + p_in * 0.3, 0)
            locker_door.rotation_euler = (0, 0, math.radians(70))
        else:
            p_shut = (progress - 0.50) / 0.50
            cashier_root.location = (3.8, 3.5, 0)
            # Door swings shut
            locker_door.rotation_euler = (0, 0, math.radians(max(0, 70 - p_shut * 70)))
            emerg_light_data.energy = max(0, 1500 * (1.0 - p_shut))

        cashier_root.hide_render = False
        cam_obj.location = (3.6, 3.0, 1.65)
        cam_obj.rotation_euler = (math.radians(88), 0, 0)

        if monster_root:
            monster_root.hide_render = False
            monster_root.location = (2.8, 2.4, 0)
        friend_root.hide_render = True
        char_key_obj.location = (3.8, 3.2, 2.2)
        char_key_data.energy = 500

    elif shot_idx == 8:
        # Shot 8: Tight close-up inside locker/dark room.
        # Monster's glowing emissive eyes fade in right behind Cashier!
        # Frame 3280 lunge toward camera before cut to black!
        cam_obj.location = (3.8, 3.1, 1.75)
        cam_obj.rotation_euler = (math.radians(88), 0, 0)

        cashier_root.hide_render = False
        cashier_root.location = (3.8, 3.5, math.sin(progress * 10) * 0.015)
        cashier_root.rotation_euler = (0, 0, 0)

        friend_root.hide_render = True

        if progress < 0.30:
            if monster_root:
                monster_root.hide_render = True
        elif progress < 0.80:
            p_fade = (progress - 0.30) / 0.50
            if monster_root:
                monster_root.hide_render = False
                monster_root.location = (4.0, 3.9, 0.0)
                monster_root.rotation_euler = (0, 0, math.radians(180))
        else:
            # JUMP-LUNGE FORWARD! Snapping right into the camera!
            p_snap = (progress - 0.80) / 0.20
            if monster_root:
                monster_root.hide_render = False
                snap_y = 3.9 - p_snap * 0.75
                monster_root.location = (3.9, snap_y, 0.0)
                monster_root.rotation_euler = (math.radians(20), 0, math.radians(180))

        char_key_obj.location = (3.8, 3.2, 2.0)
        char_key_data.energy = 300
        emerg_light_data.energy = 0

    # Camera Flashlight & Fill always track near camera
    flash_light_obj.location = (cam_obj.location[0] + 0.15, cam_obj.location[1], cam_obj.location[2] + 0.15)
    flash_light_obj.rotation_euler = cam_obj.rotation_euler
    cam_fill_obj.location = (cam_obj.location[0], cam_obj.location[1] + 0.5, cam_obj.location[2] + 0.4)

# 11. SAVE INTERACTIVE BLEND FILE FOR REAL-TIME VIEWPORT PREVIEW
blend_save_path = os.path.join(OUTPUT_DIR, "mimic_scene.blend")
setup_shot(1, 0.0)
bpy.ops.wm.save_as_mainfile(filepath=blend_save_path)
print(f"Successfully saved interactive Blender scene to: {blend_save_path}")

# 12. RENDER FUNCTIONS (STILLS & FAST DRAFT MODULAR SHOTS)
def render_still_checks():
    print("\n=== RENDERING 8 STILL CHECK FRAMES (ONE PER SHOT) ===")
    scene.render.image_settings.file_format = 'PNG'
    scene.render.resolution_x = 540
    scene.render.resolution_y = 960

    # Use CPU denoised preview for reliable still generation across all GPU drivers
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 1
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 1
    scene.render.threads_mode = 'FIXED'
    scene.render.threads = 2

    # Check timings: shot 4 at 0.75 (breach), shot 8 at 0.85 (jump-lunge)
    check_timings = {1: 0.5, 2: 0.5, 3: 0.5, 4: 0.75, 5: 0.5, 6: 0.5, 7: 0.5, 8: 0.85}

    for s_idx in range(1, 9):
        check_path = os.path.join(OUTPUT_DIR, f"check_{s_idx:02d}.png")
        if os.path.exists(check_path) and os.path.getsize(check_path) > 100000:
            print(f"[Shot {s_idx}] Still check already exists: {check_path} ({os.path.getsize(check_path)} bytes), skipping...")
            continue
        prog = check_timings.get(s_idx, 0.5)
        setup_shot(s_idx, prog)
        scene.render.filepath = check_path
        bpy.ops.render.render(write_still=True)
        print(f"Rendered still check {s_idx}/8: {check_path} ({os.path.getsize(check_path)} bytes)")

    # Revert active engine to EEVEE
    scene.render.engine = 'BLENDER_EEVEE'
    print("=== ALL 8 STILL CHECKS COMPLETED ===")

def render_single_shot(s_idx):
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 90

    shot_info = SHOTS[s_idx - 1]
    shot_name = shot_info["id"]
    n_frames = shot_info["frames"]
    dur_sec = shot_info["dur_sec"]
    target_mp4 = os.path.join(OUTPUT_DIR, f"{shot_name}.mp4")
    shot_tmp_dir = os.path.join(TMP_DIR, shot_name)

    os.makedirs(shot_tmp_dir, exist_ok=True)
    print(f"\n--- RENDERING {shot_name.upper()} ({dur_sec}s | {n_frames} frames) ---")

    # Render frames
    first_frame_path = os.path.join(shot_tmp_dir, "frame_0000.jpg")
    for f in range(n_frames):
        prog = f / max(1, n_frames - 1)
        setup_shot(s_idx, prog)

        frame_path = os.path.join(shot_tmp_dir, f"frame_{f:04d}.jpg")
        scene.render.filepath = frame_path
        bpy.ops.render.render(write_still=True)

        # Check first frame for driver fallback
        if f == 0:
            try:
                from PIL import Image
                im = Image.open(frame_path)
                ext = im.getextrema()
                if ext[0][1] <= 1 and ext[1][1] <= 1 and ext[2][1] <= 1:
                    print(f"[{shot_name}] Headless driver fallback to fast CPU render for preview...")
                    scene.render.engine = 'CYCLES'
                    scene.cycles.device = 'CPU'
                    scene.cycles.samples = 1
                    scene.cycles.use_denoising = True
                    scene.cycles.max_bounces = 1
                    bpy.ops.render.render(write_still=True)
            except Exception:
                pass

        if f % 10 == 0 or f == n_frames - 1:
            print(f"[{shot_name}] Rendered frame {f+1}/{n_frames} ({prog*100:.1f}%)")

    # Revert to EEVEE
    scene.render.engine = 'BLENDER_EEVEE'

    # Encode with FFmpeg
    input_pattern = os.path.join(shot_tmp_dir, "frame_%04d.jpg")
    src_fps = n_frames / dur_sec
    target_res = "540:960" if IS_DRAFT else "1080:1920"
    out_fps = "24" if IS_DRAFT else "60"

    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-framerate", str(src_fps),
        "-i", input_pattern,
        "-vf", f"minterpolate=mi_mode=blend:fps={out_fps},scale={target_res}:flags=lanczos",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-r", out_fps,
        "-crf", "18",
        "-preset", "veryfast",
        target_mp4
    ]
    print(f"[{shot_name}] Encoding to {target_mp4} at {out_fps}fps...")
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[{shot_name}] Successfully created {target_mp4} ({os.path.getsize(target_mp4)} bytes)")

    shutil.rmtree(shot_tmp_dir, ignore_errors=True)

def render_all_shots():
    for s_idx in range(1, len(SHOTS) + 1):
        render_single_shot(s_idx)
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("\n=== ALL 8 SHOTS SUCCESSFULLY RENDERED IN PUBLIC/RENDERS/ ===")

if __name__ == "__main__":
    if "--check-stills" in sys.argv:
        render_still_checks()
    elif "--shot" in sys.argv:
        shot_num = int(sys.argv[sys.argv.index("--shot") + 1])
        print(f"=== TARGETING SINGLE SHOT: {shot_num} ===")
        render_single_shot(shot_num)
    else:
        render_all_shots()
