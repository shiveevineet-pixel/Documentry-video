import bpy
import math
import os
import sys
import subprocess
import shutil

print("=== STARTING THE 3:00 AM MIMIC 3D GENERATOR ===")

# Clean existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# Configure Ultra-Fast Cycles CPU Engine (Reliable, fully-illuminated 3D rendering on all systems)
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 1
scene.cycles.use_denoising = False
scene.cycles.max_bounces = 1
scene.cycles.diffuse_bounces = 1
scene.cycles.glossy_bounces = 0
scene.cycles.transmission_bounces = 0
scene.cycles.transparent_max_bounces = 1

# Resolution 540x960 rendered, scaled to 1080x1920 in FFmpeg (crisp stylized indie horror)
scene.render.resolution_x = 540
scene.render.resolution_y = 960
scene.render.resolution_percentage = 100

# World Ambient Background (ensures rich dark-blue night atmosphere, never pitch-black void)
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs['Color'].default_value = (0.04, 0.06, 0.10, 1.0)
    bg.inputs['Strength'].default_value = 1.0

# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "renders")
TMP_DIR = os.path.join(BASE_DIR, "tmp_blender_frames")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

# Helper: Create Material
def make_material(name, base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0,
                  transmission=0.0, emission_color=(0, 0, 0, 1.0), emission_strength=0.0):
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
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emission_strength
    return mat

# Create Materials
mat_store_floor = make_material("StoreFloor", base_color=(0.08, 0.10, 0.14, 1.0), roughness=0.18)
mat_store_walls = make_material("StoreWalls", base_color=(0.18, 0.22, 0.28, 1.0), roughness=0.6)
mat_counter = make_material("Counter", base_color=(0.12, 0.14, 0.18, 1.0), roughness=0.35)
mat_fluorescent = make_material("Fluorescent", base_color=(0.88, 0.95, 1.0, 1.0),
                                emission_color=(0.88, 0.95, 1.0, 1.0), emission_strength=8.0)
mat_clock_red = make_material("ClockRed", base_color=(0.95, 0.1, 0.1, 1.0),
                              emission_color=(0.95, 0.1, 0.1, 1.0), emission_strength=12.0)
mat_radio_led = make_material("RadioLed", base_color=(1.0, 0.05, 0.05, 1.0),
                              emission_color=(1.0, 0.05, 0.05, 1.0), emission_strength=15.0)
mat_radio_body = make_material("RadioBody", base_color=(0.15, 0.18, 0.16, 1.0), roughness=0.7)
mat_phone = make_material("Phone", base_color=(0.06, 0.07, 0.09, 1.0), roughness=0.4)
mat_glass = make_material("StoreGlass", base_color=(0.85, 0.92, 1.0, 1.0), roughness=0.08, transmission=0.85)
mat_closed_sign = make_material("ClosedSign", base_color=(0.95, 0.1, 0.1, 1.0),
                                emission_color=(0.95, 0.1, 0.1, 1.0), emission_strength=10.0)
mat_asphalt = make_material("Asphalt", base_color=(0.05, 0.06, 0.08, 1.0), roughness=0.92)
mat_streetlamp = make_material("StreetlampBulb", base_color=(1.0, 0.65, 0.1, 1.0),
                               emission_color=(1.0, 0.65, 0.1, 1.0), emission_strength=25.0)
mat_corridor_walls = make_material("CorridorWalls", base_color=(0.09, 0.09, 0.11, 1.0), roughness=0.85)
mat_corridor_emergency = make_material("EmergencyRed", base_color=(0.9, 0.1, 0.1, 1.0),
                                       emission_color=(0.9, 0.1, 0.1, 1.0), emission_strength=20.0)
mat_freezer_door = make_material("FreezerDoor", base_color=(0.35, 0.40, 0.48, 1.0), roughness=0.28, metallic=0.9)
mat_freezer_interior = make_material("FreezerInterior", base_color=(0.01, 0.02, 0.05, 1.0), roughness=0.9)
mat_ladder = make_material("Ladder", base_color=(0.55, 0.60, 0.68, 1.0), roughness=0.4, metallic=0.85)

# Characters
mat_cashier_skin = make_material("CashierSkin", base_color=(0.85, 0.88, 0.92, 1.0), roughness=0.5)
mat_cashier_apron = make_material("CashierApron", base_color=(0.10, 0.14, 0.20, 1.0), roughness=0.6)
mat_cashier_cap = make_material("CashierCap", base_color=(0.06, 0.08, 0.12, 1.0), roughness=0.5)

# Friend / Mimic
mat_friend_hoodie = make_material("FriendHoodie", base_color=(0.20, 0.25, 0.32, 1.0), roughness=0.7)
mat_mimic_void = make_material("MimicVoid", base_color=(0.02, 0.02, 0.02, 1.0), roughness=0.95)
mat_mimic_glow = make_material("MimicGlow", base_color=(1.0, 1.0, 1.0, 1.0),
                               emission_color=(1.0, 1.0, 1.0, 1.0), emission_strength=8.0)

# Helper: Create Mesh Objects
def add_cube(name, location, scale, material):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    if material:
        obj.data.materials.append(material)
    return obj

def add_cylinder(name, location, radius, depth, material, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    return obj

def add_sphere(name, location, radius, material):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=location)
    obj = bpy.context.active_object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    return obj

print("Building 3D Environment...")

# 1. SET 1: CONVENIENCE STORE (Located around X=0, Y=0 to Y=8)
store_floor = add_cube("Store_Floor", (0, 3, 0), (5, 5, 0.1), mat_store_floor)
store_ceiling = add_cube("Store_Ceiling", (0, 3, 3.8), (5, 5, 0.1), mat_store_walls)
store_back_wall = add_cube("Store_BackWall", (0, 8, 1.9), (5, 0.1, 1.9), mat_store_walls)
store_left_wall = add_cube("Store_LeftWall", (-5, 3, 1.9), (0.1, 5, 1.9), mat_store_walls)
store_right_wall = add_cube("Store_RightWall", (5, 3, 1.9), (0.1, 5, 1.9), mat_store_walls)

# Fluorescent tubes (ceiling strips)
tube1 = add_cube("Fluo_1", (-1.5, 2.5, 3.7), (0.12, 2.0, 0.05), mat_fluorescent)
tube2 = add_cube("Fluo_2", (1.5, 2.5, 3.7), (0.12, 2.0, 0.05), mat_fluorescent)

# Lights for interior store
interior_light = bpy.data.lights.new(name="Store_Light", type='POINT')
interior_light.energy = 1500
interior_light.color = (0.88, 0.95, 1.0)
interior_light_obj = bpy.data.objects.new("Store_Light_Obj", interior_light)
scene.collection.objects.link(interior_light_obj)
interior_light_obj.location = (0, 3.0, 3.2)

# Checkout Counter
counter = add_cube("Checkout_Counter", (0, 2.8, 0.55), (2.2, 0.6, 0.55), mat_counter)

# 03:00 Digital Clock on counter
clock_box = add_cube("Clock_Body", (0.8, 2.8, 1.18), (0.22, 0.1, 0.08), mat_phone)
clock_text_face = add_cube("Clock_Screen", (0.8, 2.74, 1.18), (0.18, 0.02, 0.05), mat_clock_red)

# Blinking Emergency Radio on counter
radio_box = add_cube("Radio_Body", (-0.7, 2.7, 1.2), (0.15, 0.12, 0.12), mat_radio_body)
radio_antenna = add_cylinder("Radio_Antenna", (-0.78, 2.7, 1.45), 0.008, 0.35, mat_ladder)
radio_led = add_sphere("Radio_LED", (-0.62, 2.62, 1.25), 0.025, mat_radio_led)

# Telephone on counter
phone_base = add_cube("Phone_Base", (0.1, 2.8, 1.15), (0.18, 0.18, 0.04), mat_phone)
phone_handset = add_cube("Phone_Handset", (0.1, 2.8, 1.21), (0.05, 0.22, 0.04), mat_phone)

# Glass Storefront Doors (Y = -1.8)
glass_door_l = add_cube("Glass_Door_L", (-1.1, -1.8, 1.8), (1.0, 0.05, 1.8), mat_glass)
glass_door_r = add_cube("Glass_Door_R", (1.1, -1.8, 1.8), (1.0, 0.05, 1.8), mat_glass)
closed_sign = add_cube("Closed_Sign", (0.5, -1.75, 2.1), (0.35, 0.02, 0.18), mat_closed_sign)

# 2. EXTERIOR PARKING LOT (Y < -1.8)
asphalt_ground = add_cube("Asphalt_Ground", (0, -10, -0.05), (15, 8, 0.05), mat_asphalt)

# Streetlamp Pole & Amber Light
lamp_pole = add_cylinder("Streetlamp_Pole", (-3.5, -7.0, 3.0), 0.08, 6.0, mat_corridor_walls)
lamp_head = add_cube("Streetlamp_Head", (-3.5, -6.5, 5.8), (0.3, 0.6, 0.15), mat_streetlamp)

street_light = bpy.data.lights.new(name="Street_Amber_Light", type='SPOT')
street_light.energy = 4500
street_light.color = (1.0, 0.62, 0.08)
street_light.spot_size = math.radians(75)
street_light.spot_blend = 0.4
street_light_obj = bpy.data.objects.new("Street_Amber_Obj", street_light)
scene.collection.objects.link(street_light_obj)
street_light_obj.location = (-3.5, -6.5, 5.7)
street_light_obj.rotation_euler = (math.radians(25), 0, 0)

# 3. SET 2: DARK BACK CORRIDOR & WALK-IN FREEZER (Located around X=0, Y=8 to Y=22)
corridor_floor = add_cube("Corridor_Floor", (0, 14, 0), (1.4, 6, 0.05), mat_store_floor)
corridor_ceiling = add_cube("Corridor_Ceiling", (0, 14, 3.6), (1.4, 6, 0.05), mat_corridor_walls)
corridor_left_wall = add_cube("Corridor_L_Wall", (-1.4, 14, 1.8), (0.05, 6, 1.8), mat_corridor_walls)
corridor_right_wall = add_cube("Corridor_R_Wall", (1.4, 14, 1.8), (0.05, 6, 1.8), mat_corridor_walls)
corridor_end_wall = add_cube("Corridor_End_Wall", (0, 20, 1.8), (1.4, 0.05, 1.8), mat_corridor_walls)

# Pulsing Red Emergency Bulb in corridor
corridor_red_bulb = add_sphere("Emergency_Bulb", (0, 14, 3.3), 0.1, mat_corridor_emergency)
corridor_red_light = bpy.data.lights.new(name="Corridor_Red_Light", type='POINT')
corridor_red_light.energy = 1200
corridor_red_light.color = (0.95, 0.1, 0.1)
corridor_red_light_obj = bpy.data.objects.new("Corridor_Red_Obj", corridor_red_light)
scene.collection.objects.link(corridor_red_light_obj)
corridor_red_light_obj.location = (0, 14, 3.1)

# Left wall: Metal ladder to roof hatch
ladder_rail1 = add_cylinder("Ladder_Rail1", (-1.3, 17.8, 1.8), 0.03, 3.6, mat_ladder)
ladder_rail2 = add_cylinder("Ladder_Rail2", (-1.3, 18.6, 1.8), 0.03, 3.6, mat_ladder)
for r in range(8):
    add_cylinder(f"Ladder_Rung_{r}", (-1.3, 18.2, 0.6 + r * 0.4), 0.02, 0.8, mat_ladder, rotation=(math.radians(90), 0, 0))

# Right wall: Walk-in Freezer Door & Handle
freezer_door = add_cube("Freezer_Door", (1.35, 18.2, 1.6), (0.08, 0.8, 1.5), mat_freezer_door)
freezer_handle = add_cube("Freezer_Handle", (1.25, 18.7, 1.5), (0.04, 0.06, 0.3), mat_ladder)

# Walk-in Freezer Interior (X > 1.4, Y=16 to 22)
freezer_floor = add_cube("Freezer_Floor", (4.5, 18.2, 0), (3, 3, 0.05), mat_freezer_interior)
freezer_ceiling = add_cube("Freezer_Ceiling", (4.5, 18.2, 3.6), (3, 3, 0.05), mat_freezer_interior)
freezer_wall_back = add_cube("Freezer_Wall_Back", (7.5, 18.2, 1.8), (0.05, 3, 1.8), mat_freezer_interior)
freezer_wall_side1 = add_cube("Freezer_Wall_S1", (4.5, 15.2, 1.8), (3, 0.05, 1.8), mat_freezer_interior)
freezer_wall_side2 = add_cube("Freezer_Wall_S2", (4.5, 21.2, 1.8), (3, 0.05, 1.8), mat_freezer_interior)

# Faint frost-blue rim light inside freezer
freezer_rim_light = bpy.data.lights.new(name="Freezer_Rim_Light", type='SPOT')
freezer_rim_light.energy = 160
freezer_rim_light.color = (0.2, 0.6, 1.0)
freezer_rim_light.spot_size = math.radians(50)
freezer_rim_light_obj = bpy.data.objects.new("Freezer_Rim_Obj", freezer_rim_light)
scene.collection.objects.link(freezer_rim_light_obj)
freezer_rim_light_obj.location = (6.0, 16.5, 2.8)
freezer_rim_light_obj.rotation_euler = (math.radians(-35), math.radians(40), 0)

# Shattered glass cubes container (for Shot 4 breach)
glass_shards = []
for i in range(24):
    sx = (i % 5 - 2) * 0.15
    sy = -1.8 - (i // 5) * 0.1
    sz = 1.0 + (i % 6) * 0.25
    shard = add_cube(f"Glass_Shard_{i}", (sx, sy, sz), (0.06, 0.06, 0.06), mat_glass)
    shard.hide_render = True
    glass_shards.append(shard)

# 4. CHARACTERS
# Cashier (Protagonist)
cashier_torso = add_cylinder("Cashier_Torso", (0, 3.6, 1.3), 0.32, 0.7, mat_cashier_apron)
cashier_head = add_sphere("Cashier_Head", (0, 3.6, 1.85), 0.24, mat_cashier_skin)
cashier_cap = add_cube("Cashier_Cap", (0, 3.6, 2.05), (0.26, 0.28, 0.06), mat_cashier_cap)
cashier_arm_l = add_cylinder("Cashier_Arm_L", (-0.42, 3.6, 1.2), 0.09, 0.6, mat_cashier_apron)
cashier_arm_r = add_cylinder("Cashier_Arm_R", (0.42, 3.6, 1.2), 0.09, 0.6, mat_cashier_apron)

# Friend / Mimic Character
mimic_torso = add_cylinder("Mimic_Torso", (0, -4.5, 1.3), 0.32, 0.7, mat_friend_hoodie)
mimic_head = add_sphere("Mimic_Head", (0, -4.5, 1.85), 0.24, mat_cashier_skin)
mimic_arm_l = add_cylinder("Mimic_Arm_L", (-0.42, -4.5, 1.2), 0.09, 0.6, mat_friend_hoodie)
mimic_arm_r = add_cylinder("Mimic_Arm_R", (0.42, -4.5, 1.2), 0.09, 0.6, mat_friend_hoodie)

# Mimic Glowing Eyes & Grin (child features)
mimic_eye_l = add_sphere("Mimic_Eye_L", (-0.08, -4.3, 1.9), 0.035, mat_mimic_glow)
mimic_eye_r = add_sphere("Mimic_Eye_R", (0.08, -4.3, 1.9), 0.035, mat_mimic_glow)
mimic_grin = add_cube("Mimic_Grin", (0, -4.3, 1.76), (0.12, 0.02, 0.025), mat_mimic_glow)
mimic_eye_l.hide_render = True
mimic_eye_r.hide_render = True
mimic_grin.hide_render = True

# Main Camera
cam_data = bpy.data.cameras.new("Main_Camera")
cam_data.lens = 28
cam_obj = bpy.data.objects.new("Main_Camera", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

print("Scene setup completed successfully!")

# Define the 8 Shots and their timeline parameters
# Remotion frames (60fps):
# Shot 1: 0-420 (7s)
# Shot 2: 420-780 (6s)
# Shot 3: 780-1080 (5s)
# Shot 4: 1080-1560 (8s)
# Shot 5: 1560-1980 (7s)
# Shot 6: 1980-2460 (8s)
# Shot 7: 2460-2880 (7s)
# Shot 8: 2880-3300 (7s)

SHOTS = [
    {"id": "shot_01", "dur_sec": 7.0, "frames": 56},
    {"id": "shot_02", "dur_sec": 6.0, "frames": 48},
    {"id": "shot_03", "dur_sec": 5.0, "frames": 40},
    {"id": "shot_04", "dur_sec": 8.0, "frames": 64},
    {"id": "shot_05", "dur_sec": 7.0, "frames": 56},
    {"id": "shot_06", "dur_sec": 8.0, "frames": 64},
    {"id": "shot_07", "dur_sec": 7.0, "frames": 56},
    {"id": "shot_08", "dur_sec": 7.0, "frames": 56},
]

# Function to setup animation for each shot
def setup_shot(shot_idx, progress):
    # progress goes from 0.0 to 1.0 within the shot
    if shot_idx == 1:
        # Shot 1: Slow cinematic dolly-in behind Cashier at counter at 03:00.
        # Radio LED pulses rapidly; fluorescent flickers once at progress ~0.55
        cam_obj.location = (0.2 * math.sin(progress * 2), 4.8 - progress * 0.9, 1.8 + math.sin(progress * 3) * 0.02)
        cam_obj.rotation_euler = (math.radians(88), 0, math.radians(180))
        # Cashier breathing bob
        cashier_torso.location = (0, 3.6, 1.3 + math.sin(progress * 12) * 0.015)
        cashier_head.location = (0, 3.6, 1.85 + math.sin(progress * 12) * 0.015)
        # Radio led blink
        blink = (math.sin(progress * 35) > 0.1)
        radio_led.hide_render = not blink
        # Light flicker
        flicker = 1.0
        if 0.52 < progress < 0.60:
            flicker = 0.15 if int(progress * 100) % 2 == 0 else 1.0
        interior_light.energy = 1500 * flicker
        tube1.scale = (0.12, 2.0, 0.05 * flicker)
        tube2.scale = (0.12, 2.0, 0.05 * flicker)

    elif shot_idx == 2:
        # Shot 2: Outside glass doors, Friend runs up under flickering streetlamp, bangs on glass.
        # At progress > 0.55, whip-pan down to counter phone vibrating aggressively.
        if progress < 0.55:
            p2 = progress / 0.55
            # Camera inside looking out at glass door
            cam_obj.location = (0, 1.2, 1.6 + math.sin(progress * 8) * 0.02)
            cam_obj.rotation_euler = (math.radians(90), 0, math.radians(180))
            # Friend running from parking lot to glass door (-4.5 to -2.1)
            f_y = -4.5 + p2 * 2.4
            mimic_torso.location = (0, f_y, 1.3 + abs(math.sin(p2 * 14)) * 0.05)
            mimic_head.location = (0, f_y, 1.85 + abs(math.sin(p2 * 14)) * 0.05)
            # Bang arms against glass
            arm_reach = 0.2 * math.sin(p2 * 20) if p2 > 0.6 else 0
            mimic_arm_l.location = (-0.42, f_y + arm_reach, 1.3)
            mimic_arm_r.location = (0.42, f_y + arm_reach, 1.3)
        else:
            # Whip-pan down to counter phone
            p_pan = (progress - 0.55) / 0.45
            cam_obj.location = (0.1 + p_pan * 0.1, 2.2 + p_pan * 0.2, 1.6 - p_pan * 0.25)
            cam_obj.rotation_euler = (math.radians(90 - p_pan * 35), 0, math.radians(180 + p_pan * 15))
            # Phone vibrating
            vib = math.sin(progress * 60) * 0.02
            phone_handset.location = (0.1 + vib, 2.8, 1.21)

    elif shot_idx == 3:
        # Shot 3: CHOICE 1 (A vs B): Framing Friend outside glass (left) and phone on counter (right)
        sway = math.sin(progress * 4) * 0.03
        cam_obj.location = (0.5 + sway, 2.2, 1.45 + sway * 0.5)
        cam_obj.rotation_euler = (math.radians(78), 0, math.radians(160))
        # Friend banging frantically outside
        mimic_torso.location = (-0.8, -2.1, 1.3 + math.sin(progress * 18) * 0.03)
        mimic_head.location = (-0.8, -2.1, 1.85 + math.sin(progress * 18) * 0.03)
        mimic_arm_l.location = (-1.1, -1.95 + math.sin(progress * 22) * 0.08, 1.4)
        mimic_arm_r.location = (-0.5, -1.95 + math.cos(progress * 22) * 0.08, 1.4)
        # Phone vibrating
        vib = math.sin(progress * 50) * 0.015
        phone_handset.location = (0.1 + vib, 2.8, 1.21)

    elif shot_idx == 4:
        # Shot 4: Cashier holds phone, Friend turns pitch-black Mimic with glowing eyes/grin,
        # at progress > 0.7 breaches glass!
        if progress < 0.65:
            # Pushing in toward glass
            cam_obj.location = (0, 2.6 - progress * 1.5, 1.6)
            cam_obj.rotation_euler = (math.radians(88), 0, math.radians(180))
            # Friend stands upright, turns pitch-black void
            mimic_torso.location = (0, -2.2, 1.35)
            mimic_head.location = (0, -2.2, 1.9)
            mimic_arm_l.location = (-0.42, -2.2, 1.2)
            mimic_arm_r.location = (0.42, -2.2, 1.2)
            # Material morph to void
            if progress > 0.3:
                mimic_torso.data.materials[0] = mat_mimic_void
                mimic_head.data.materials[0] = mat_mimic_void
                mimic_arm_l.data.materials[0] = mat_mimic_void
                mimic_arm_r.data.materials[0] = mat_mimic_void
                mimic_eye_l.hide_render = False
                mimic_eye_r.hide_render = False
                mimic_grin.hide_render = False
                mimic_eye_l.location = (-0.08, -2.0, 1.92)
                mimic_eye_r.location = (0.08, -2.0, 1.92)
                mimic_grin.location = (0, -2.0, 1.76)
        else:
            # BREACH! Frame 1420 (lunges through glass door)
            p_lunge = (progress - 0.65) / 0.35
            lunge_y = -2.2 + p_lunge * 3.2
            mimic_torso.location = (0, lunge_y, 1.4)
            mimic_head.location = (0, lunge_y, 1.95)
            mimic_eye_l.location = (-0.08, lunge_y + 0.2, 1.97)
            mimic_eye_r.location = (0.08, lunge_y + 0.2, 1.97)
            mimic_grin.location = (0, lunge_y + 0.2, 1.81)
            # Shatter glass doors & scatter glass shards
            glass_door_l.scale = (0.1, 0.05, 0.1)
            glass_door_r.scale = (0.1, 0.05, 0.1)
            for idx, shard in enumerate(glass_shards):
                shard.hide_render = False
                shard.location = (shard.location[0] + (idx % 3 - 1) * p_lunge * 0.8,
                                  -1.8 + p_lunge * 2.0 + (idx * 0.05),
                                  shard.location[2] - p_lunge * 0.6)

    elif shot_idx == 5:
        # Shot 5: Hallway Sprint! Handheld-bob running down corridor lit by pulsing red emergency light.
        # At progress > 0.52, quick whip-look back shows Mimic leaping counter!
        # Hide glass shards
        for shard in glass_shards:
            shard.hide_render = True
        # Red light pulse
        pulse = 0.5 + 0.5 * math.sin(progress * 20)
        corridor_red_light.energy = 100 + 200 * pulse

        if progress < 0.52 or progress > 0.82:
            # Sprinting forward
            sprint_y = 7.0 + progress * 8.0
            bob_z = 1.6 + abs(math.sin(progress * 24)) * 0.12
            bob_tilt = math.sin(progress * 12) * 0.08
            cam_obj.location = (bob_tilt * 0.5, sprint_y, bob_z)
            cam_obj.rotation_euler = (math.radians(90), bob_tilt, 0)
        else:
            # Whip-look back at pursuing Mimic!
            whip_p = (progress - 0.52) / 0.30
            rot_y = 180 * math.sin(whip_p * math.pi)
            cam_obj.location = (0, 11.5, 1.6)
            cam_obj.rotation_euler = (math.radians(90), 0, math.radians(rot_y))
            # Mimic vaulting over counter (vaulting at Y=5.5)
            mimic_torso.location = (0, 5.0 + whip_p * 2.5, 1.6 + math.sin(whip_p * math.pi) * 0.5)
            mimic_head.location = (0, 5.0 + whip_p * 2.5, 2.15 + math.sin(whip_p * math.pi) * 0.5)
            mimic_eye_l.location = (-0.08, 5.2 + whip_p * 2.5, 2.17)
            mimic_eye_r.location = (0.08, 5.2 + whip_p * 2.5, 2.17)
            mimic_grin.location = (0, 5.2 + whip_p * 2.5, 2.01)

    elif shot_idx == 6:
        # Shot 6: CHOICE 2 (A vs B): Skids to stop facing ladder (left) and freezer door (right)
        stop_y = 17.0 + (1.0 - math.exp(-progress * 6)) * 0.8
        sway = math.sin(progress * 5) * 0.04
        cam_obj.location = (sway, stop_y, 1.55 + math.sin(progress * 8) * 0.03)
        cam_obj.rotation_euler = (math.radians(88), 0, 0)
        # Pulsing red light
        corridor_red_light.energy = 150 + 150 * math.sin(progress * 15)

    elif shot_idx == 7:
        # Shot 7: Dives into freezer, heavy door swings shut at progress ~0.45, sealing out red light.
        if progress < 0.45:
            # Camera enters freezer
            p_in = progress / 0.45
            cam_obj.location = (1.5 + p_in * 2.0, 18.2, 1.6 - p_in * 0.1)
            cam_obj.rotation_euler = (math.radians(90), 0, math.radians(-90))
            freezer_door.rotation_euler = (0, 0, math.radians(-60 * (1 - p_in)))
        else:
            # Door slammed shut! Near-total darkness, cold blue rim light on Cashier
            p_shut = (progress - 0.45) / 0.55
            cam_obj.location = (3.8, 18.2, 1.55 + math.sin(p_shut * 8) * 0.02)
            cam_obj.rotation_euler = (math.radians(90), 0, math.radians(-90))
            freezer_door.rotation_euler = (0, 0, 0)
            # Cashier inside freezer turning around
            cashier_torso.location = (4.8, 18.2, 1.3)
            cashier_head.location = (4.8, 18.2, 1.85)
            cashier_cap.location = (4.8, 18.2, 2.05)
            cashier_arm_l.location = (4.8, 17.8, 1.2)
            cashier_arm_r.location = (4.8, 18.6, 1.2)

    elif shot_idx == 8:
        # Shot 8: Tight close-up on Cashier in dark freezer.
        # Behind Cashier's shoulder in pitch-black void, glowing white eyes and grin fade in,
        # then snap forward on the last 15 frames!
        cam_obj.location = (4.4, 18.2, 1.8)
        cam_obj.rotation_euler = (math.radians(90), 0, math.radians(-90))
        # Cashier close in frame
        cashier_torso.location = (4.9, 18.1, 1.25)
        cashier_head.location = (4.9, 18.1, 1.8)
        cashier_cap.location = (4.9, 18.1, 2.0)

        # Mimic lurking right behind Cashier's shoulder (X=5.8, Y=18.4)
        mimic_torso.data.materials[0] = mat_mimic_void
        mimic_head.data.materials[0] = mat_mimic_void
        mimic_torso.location = (5.8, 18.4, 1.3)
        mimic_head.location = (5.8, 18.4, 1.85)

        mimic_eye_l.hide_render = False
        mimic_eye_r.hide_render = False
        mimic_grin.hide_render = False

        if progress < 0.2:
            # Completely invisible at first
            mat_mimic_glow.node_tree.nodes["Principled BSDF"].inputs['Emission Strength'].default_value = 0.0
            mimic_eye_l.location = (5.6, 18.3, 1.9)
            mimic_eye_r.location = (5.6, 18.5, 1.9)
            mimic_grin.location = (5.6, 18.4, 1.76)
        elif progress < 0.82:
            # Slow eerie fade-in of glowing eyes and grin
            glow = ((progress - 0.2) / 0.62) * 8.0
            mat_mimic_glow.node_tree.nodes["Principled BSDF"].inputs['Emission Strength'].default_value = glow
            mimic_eye_l.location = (5.6, 18.3, 1.9)
            mimic_eye_r.location = (5.6, 18.5, 1.9)
            mimic_grin.location = (5.6, 18.4, 1.76)
        else:
            # JUMP-SNAP FORWARD! Snapping right next to camera!
            p_snap = (progress - 0.82) / 0.18
            mat_mimic_glow.node_tree.nodes["Principled BSDF"].inputs['Emission Strength'].default_value = 15.0
            snap_x = 5.6 - p_snap * 1.05
            mimic_eye_l.location = (snap_x, 18.25, 1.85)
            mimic_eye_r.location = (snap_x, 18.45, 1.85)
            mimic_grin.location = (snap_x, 18.35, 1.72)

# RENDER LOOP FUNCTION
def render_all_shots():
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 90

    for s_idx, shot_info in enumerate(SHOTS, start=1):
        shot_name = shot_info["id"]
        n_frames = shot_info["frames"]
        dur_sec = shot_info["dur_sec"]
        target_mp4 = os.path.join(OUTPUT_DIR, f"{shot_name}.mp4")
        shot_tmp_dir = os.path.join(TMP_DIR, shot_name)
        os.makedirs(shot_tmp_dir, exist_ok=True)

        print(f"\n--- RENDERING {shot_name.upper()} ({dur_sec}s | {n_frames} frames) ---")
        
        # Reset shot state
        tube1.scale = (0.12, 2.0, 0.05)
        tube2.scale = (0.12, 2.0, 0.05)
        interior_light.energy = 1500
        glass_door_l.scale = (1.0, 0.05, 1.8)
        glass_door_r.scale = (1.0, 0.05, 1.8)
        for shard in glass_shards:
            shard.hide_render = True
        if s_idx < 4:
            mimic_torso.data.materials[0] = mat_friend_hoodie
            mimic_head.data.materials[0] = mat_cashier_skin
            mimic_arm_l.data.materials[0] = mat_friend_hoodie
            mimic_arm_r.data.materials[0] = mat_friend_hoodie
            mimic_eye_l.hide_render = True
            mimic_eye_r.hide_render = True
            mimic_grin.hide_render = True

        # Render frames
        for f in range(n_frames):
            prog = f / max(1, n_frames - 1)
            setup_shot(s_idx, prog)
            
            frame_path = os.path.join(shot_tmp_dir, f"frame_{f:04d}.jpg")
            scene.render.filepath = frame_path
            bpy.ops.render.render(write_still=True)
            if f % 15 == 0 or f == n_frames - 1:
                print(f"[{shot_name}] Rendered frame {f+1}/{n_frames} ({prog*100:.1f}%)")

        # Encode with FFmpeg directly to 60fps 1080x1920 MP4
        input_pattern = os.path.join(shot_tmp_dir, "frame_%04d.jpg")
        src_fps = n_frames / dur_sec
        ffmpeg_cmd = [
            "ffmpeg", "-y",
            "-framerate", str(src_fps),
            "-i", input_pattern,
            "-vf", "minterpolate=mi_mode=blend:fps=60,scale=1080:1920:flags=lanczos",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-r", "60",
            "-crf", "17",
            "-preset", "fast",
            target_mp4
        ]
        print(f"[{shot_name}] Encoding to {target_mp4} at 60fps...")
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"[{shot_name}] Successfully created {target_mp4} ({os.path.getsize(target_mp4)} bytes)")

        # Clean up temporary frames for this shot to save disk
        shutil.rmtree(shot_tmp_dir, ignore_errors=True)

    # Clean up base tmp dir
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("\n=== ALL 8 SHOTS SUCCESSFULLY RENDERED IN PUBLIC/RENDERS/ ===")

if __name__ == "__main__":
    if "--verify-only" in sys.argv:
        print("Verify mode only - testing setup_shot...")
        for s in range(1, 9):
            setup_shot(s, 0.0)
            setup_shot(s, 0.5)
            setup_shot(s, 1.0)
        print("Setup shot verified successfully!")
    else:
        render_all_shots()
