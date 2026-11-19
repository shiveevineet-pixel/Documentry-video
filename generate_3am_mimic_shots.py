import bpy
import math
import os
import sys
import subprocess
import shutil

print("=== STARTING 'THE 3:00 AM MIMIC' PROCEDURAL 3D PIPELINE (EEVEE) ===")

# 1. Clean existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# 2. Strict EEVEE Render Configuration (Zero Noise)
scene.render.engine = 'BLENDER_EEVEE'
if hasattr(scene, 'eevee'):
    scene.eevee.taa_render_samples = 32
    if hasattr(scene.eevee, 'use_raytracing'):
        scene.eevee.use_raytracing = False
    if hasattr(scene.eevee, 'use_motion_blur'):
        scene.eevee.use_motion_blur = False

# Native 1080x1920 Vertical Full HD
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.resolution_percentage = 100

# Base Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "renders")
TMP_DIR = os.path.join(BASE_DIR, "tmp_blender_frames")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

# 3. Ambient Night World
world = bpy.data.worlds.new("Horror_World")
scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs['Color'].default_value = (0.015, 0.02, 0.035, 1.0)
    bg_node.inputs['Strength'].default_value = 0.6

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
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emission_strength
        if 'Alpha' in bsdf.inputs:
            bsdf.inputs['Alpha'].default_value = alpha
    return mat

# Palette Materials
mat_store_floor = create_mat("StoreFloor", base_color=(0.10, 0.13, 0.18, 1.0), roughness=0.18)
mat_tile_dark   = create_mat("TileDark", base_color=(0.06, 0.08, 0.11, 1.0), roughness=0.20)
mat_store_walls = create_mat("StoreWalls", base_color=(0.18, 0.22, 0.28, 1.0), roughness=0.55)
mat_counter     = create_mat("CounterMat", base_color=(0.12, 0.14, 0.18, 1.0), roughness=0.30)
mat_fluorescent = create_mat("FluorescentGlow", base_color=(0.90, 0.96, 1.0, 1.0),
                             emission_color=(0.90, 0.96, 1.0, 1.0), emission_strength=10.0)
mat_clock_red   = create_mat("ClockRedGlow", base_color=(1.0, 0.08, 0.08, 1.0),
                             emission_color=(1.0, 0.08, 0.08, 1.0), emission_strength=12.0)
mat_radio_led   = create_mat("RadioLedGlow", base_color=(1.0, 0.05, 0.05, 1.0),
                             emission_color=(1.0, 0.05, 0.05, 1.0), emission_strength=15.0)
mat_radio_body  = create_mat("RadioBody", base_color=(0.14, 0.16, 0.15, 1.0), roughness=0.6)
mat_phone       = create_mat("PhonePlastic", base_color=(0.06, 0.07, 0.09, 1.0), roughness=0.35)
mat_glass       = create_mat("StoreGlass", base_color=(0.88, 0.94, 1.0, 1.0), roughness=0.04, transmission=0.88, alpha=0.3)
mat_metal_frame = create_mat("MetalFrame", base_color=(0.35, 0.38, 0.44, 1.0), roughness=0.25, metallic=0.85)
mat_closed_sign = create_mat("ClosedSign", base_color=(1.0, 0.05, 0.05, 1.0),
                             emission_color=(1.0, 0.05, 0.05, 1.0), emission_strength=10.0)
mat_asphalt     = create_mat("AsphaltGround", base_color=(0.04, 0.05, 0.06, 1.0), roughness=0.92)
mat_park_stripe = create_mat("ParkingStripe", base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.6)
mat_street_head = create_mat("StreetlampBulb", base_color=(1.0, 0.65, 0.10, 1.0),
                             emission_color=(1.0, 0.65, 0.10, 1.0), emission_strength=20.0)
mat_corridor    = create_mat("CorridorWalls", base_color=(0.09, 0.10, 0.12, 1.0), roughness=0.75)
mat_emerg_red   = create_mat("EmergencyRed", base_color=(0.95, 0.08, 0.08, 1.0),
                             emission_color=(0.95, 0.08, 0.08, 1.0), emission_strength=18.0)
mat_freezer_door= create_mat("FreezerDoorSteel", base_color=(0.42, 0.46, 0.52, 1.0), roughness=0.22, metallic=0.92)
mat_exit_green  = create_mat("ExitGreenGlow", base_color=(0.15, 0.95, 0.35, 1.0),
                             emission_color=(0.15, 0.95, 0.35, 1.0), emission_strength=8.0)
mat_freezer_int = create_mat("FreezerInterior", base_color=(0.02, 0.03, 0.05, 1.0), roughness=0.85)

# Character Materials (Matching viral Reference Video)
mat_skin        = create_mat("CharacterSkin", base_color=(0.92, 0.94, 0.98, 1.0), roughness=0.45)
mat_dark_eyes   = create_mat("DarkEyesGoggles", base_color=(0.02, 0.02, 0.03, 1.0), roughness=0.20)
mat_cap_blue    = create_mat("CapBlue", base_color=(0.10, 0.18, 0.42, 1.0), roughness=0.50)
mat_cashier_torso = create_mat("CashierApron", base_color=(0.75, 0.12, 0.14, 1.0), roughness=0.55) # Bold Red Shirt matching ref video!
mat_cashier_pants = create_mat("CashierPants", base_color=(0.12, 0.20, 0.38, 1.0), roughness=0.50) # Blue Pants matching ref video!
mat_hands_white = create_mat("HandsWhite", base_color=(0.96, 0.96, 0.98, 1.0), roughness=0.35) # Pure white sphere hands!
mat_shoes       = create_mat("ShoesDark", base_color=(0.04, 0.04, 0.05, 1.0), roughness=0.60)

# Mimic Entity Materials
mat_friend_hood = create_mat("FriendHoodie", base_color=(0.22, 0.26, 0.32, 1.0), roughness=0.65)
mat_mimic_void  = create_mat("MimicObsidian", base_color=(0.02, 0.02, 0.03, 1.0), roughness=0.35) # Glossy obsidian catching rim light
mat_mimic_glow  = create_mat("MimicCrescentGlow", base_color=(1.0, 1.0, 1.0, 1.0),
                             emission_color=(1.0, 1.0, 1.0, 1.0), emission_strength=10.0)

# Product Box Colors
box_colors = [
    create_mat("BoxRed", base_color=(0.85, 0.15, 0.15, 1.0), roughness=0.4),
    create_mat("BoxYellow", base_color=(0.92, 0.75, 0.12, 1.0), roughness=0.4),
    create_mat("BoxGreen", base_color=(0.15, 0.65, 0.25, 1.0), roughness=0.4),
    create_mat("BoxBlue", base_color=(0.18, 0.45, 0.85, 1.0), roughness=0.4),
    create_mat("CanSilver", base_color=(0.75, 0.78, 0.82, 1.0), roughness=0.2, metallic=0.9),
]

# 5. Mesh Creation Helpers with Bevels and Smooth Shading
def add_bevel(obj, width=0.015, segments=2):
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = width
    mod.segments = segments

def shade_smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

def create_cube(name, location, scale, material=None, bevel=True):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    if material:
        obj.data.materials.append(material)
    if bevel:
        add_bevel(obj)
    return obj

def create_cylinder(name, location, radius, depth, material=None, rotation=(0, 0, 0), smooth=True):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    if smooth:
        shade_smooth(obj)
    return obj

def create_sphere(name, location, radius, material=None, smooth=True):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=location)
    obj = bpy.context.active_object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    if smooth:
        shade_smooth(obj)
    return obj

# 6. Curved Crescent Grin (Spline Bevel Arc - NOT a flat rectangle!)
def create_crescent_arc(name, location, scale, material):
    curve_data = bpy.data.curves.new(name, type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 0.022
    curve_data.bevel_resolution = 4
    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(2)
    p0, p1, p2 = spline.bezier_points
    p0.co = (-0.14, 0, 0.05)
    p0.handle_left = (-0.18, 0, 0.08)
    p0.handle_right = (-0.07, 0, 0.01)
    p1.co = (0, 0, -0.04)
    p1.handle_left = (-0.06, 0, -0.04)
    p1.handle_right = (0.06, 0, -0.04)
    p2.co = (0.14, 0, 0.05)
    p2.handle_left = (0.07, 0, 0.01)
    p2.handle_right = (0.18, 0, 0.08)
    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    obj.scale = scale
    if material:
        obj.data.materials.append(material)
    return obj

# Crescent Eye (Curved Arc)
def create_crescent_eye(name, location, scale, material, flip=False):
    curve_data = bpy.data.curves.new(name, type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 0.018
    curve_data.bevel_resolution = 3
    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(1)
    p0, p1 = spline.bezier_points
    p0.co = (-0.04, 0, 0.02)
    p0.handle_right = (0, 0, 0.04)
    p1.co = (0.04, 0, 0.02)
    p1.handle_left = (0, 0, 0.04)
    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    obj.scale = scale
    if material:
        obj.data.materials.append(material)
    return obj

print("Building Stylized 3D Environment...")

# 7. ENVIRONMENT: SET 1 - 3:00 AM Convenience Store (X: -5 to 5, Y: -1.8 to 8)
# Tiled Glossy Floor
store_floor = create_cube("Store_Floor", (0, 3, 0), (5.5, 5.0, 0.08), mat_store_floor, bevel=False)
# Checkered Floor Accents
for tx in range(-2, 3):
    for ty in range(0, 5):
        if (tx + ty) % 2 == 1:
            create_cube(f"Tile_{tx}_{ty}", (tx * 1.8, ty * 1.5, 0.01), (0.85, 0.70, 0.08), mat_tile_dark, bevel=False)

store_ceiling   = create_cube("Store_Ceiling", (0, 3, 3.8), (5.5, 5.0, 0.08), mat_store_walls, bevel=False)
store_back_wall = create_cube("Store_BackWall", (0, 8, 1.9), (5.5, 0.08, 1.9), mat_store_walls)
store_left_wall = create_cube("Store_LeftWall", (-5.5, 3, 1.9), (0.08, 5.0, 1.9), mat_store_walls)
store_right_wall= create_cube("Store_RightWall", (5.5, 3, 1.9), (0.08, 5.0, 1.9), mat_store_walls)

# Glowing Fluorescent Ceiling Fixtures
tube_housing1 = create_cube("Fluo_Housing_1", (-1.8, 2.5, 3.75), (0.2, 2.2, 0.06), mat_metal_frame)
tube_strip1   = create_cube("Fluo_Strip_1", (-1.8, 2.5, 3.70), (0.12, 2.0, 0.02), mat_fluorescent, bevel=False)
tube_housing2 = create_cube("Fluo_Housing_2", (1.8, 2.5, 3.75), (0.2, 2.2, 0.06), mat_metal_frame)
tube_strip2   = create_cube("Fluo_Strip_2", (1.8, 2.5, 3.70), (0.12, 2.0, 0.02), mat_fluorescent, bevel=False)

# Store Interior Lighting (Crisp overhead Key Light)
store_light_data = bpy.data.lights.new(name="Store_Fluo_Key", type='POINT')
store_light_data.energy = 1600
store_light_data.color = (0.88, 0.95, 1.0)
store_light_obj = bpy.data.objects.new("Store_Fluo_Key_Obj", store_light_data)
scene.collection.objects.link(store_light_obj)
store_light_obj.location = (0, 2.5, 3.3)

# Store Shelving Aisles (Multi-tier with stocked groceries)
def build_shelf_aisle(name, center_x):
    aisle = create_cube(f"{name}_Frame", (center_x, 4.8, 1.3), (0.45, 2.4, 1.3), mat_metal_frame)
    # 4 shelves
    for s in range(4):
        sz = 0.4 + s * 0.6
        create_cube(f"{name}_Tier_{s}", (center_x, 4.8, sz), (0.48, 2.45, 0.03), mat_metal_frame)
        # Stock with items
        for item_i in range(8):
            iy = 4.8 - 2.0 + item_i * 0.55
            mat_item = box_colors[item_i % len(box_colors)]
            if item_i % 3 == 0:
                create_cylinder(f"{name}_Can_{s}_{item_i}", (center_x, iy, sz + 0.12), 0.08, 0.22, mat_item)
            else:
                create_cube(f"{name}_Box_{s}_{item_i}", (center_x, iy, sz + 0.14), (0.14, 0.16, 0.14), mat_item)

build_shelf_aisle("Aisle_Left", -3.2)
build_shelf_aisle("Aisle_Right", 3.2)

# Checkout Counter (L-Shaped with Bevels)
counter_main = create_cube("Checkout_Counter", (0, 2.8, 0.55), (2.4, 0.65, 0.55), mat_counter)
counter_side = create_cube("Checkout_Side", (-2.0, 3.4, 0.55), (0.45, 0.75, 0.55), mat_counter)

# POS Cash Register Monitor
pos_stand = create_cylinder("POS_Stand", (-0.8, 2.8, 1.18), 0.04, 0.18, mat_metal_frame)
pos_screen = create_cube("POS_Screen", (-0.8, 2.75, 1.35), (0.24, 0.04, 0.16), mat_phone)

# Glowing Red 03:00 Digital Clock
clock_body = create_cube("Clock_Body", (0.85, 2.8, 1.18), (0.24, 0.10, 0.08), mat_phone)
clock_face = create_cube("Clock_Display_0300", (0.85, 2.74, 1.18), (0.20, 0.02, 0.06), mat_clock_red, bevel=False)

# Blinking Red Emergency Radio
radio_body = create_cube("Radio_Body", (-0.1, 2.8, 1.20), (0.16, 0.12, 0.12), mat_radio_body)
radio_ant  = create_cylinder("Radio_Antenna", (-0.18, 2.8, 1.48), 0.008, 0.42, mat_metal_frame)
radio_led  = create_sphere("Radio_LED", (-0.02, 2.73, 1.25), 0.03, mat_radio_led)

# Telephone Base & Handset
phone_base = create_cube("Phone_Base", (0.35, 2.8, 1.15), (0.18, 0.18, 0.05), mat_phone)
phone_handset = create_cube("Phone_Handset", (0.35, 2.8, 1.22), (0.05, 0.24, 0.04), mat_phone)

# Aluminum-Framed Double Glass Doors (Y = -1.8)
door_frame_top = create_cube("Glass_Door_Top", (0, -1.8, 3.6), (2.4, 0.08, 0.08), mat_metal_frame)
door_frame_l   = create_cube("Glass_Door_FL", (-2.35, -1.8, 1.8), (0.08, 0.08, 1.8), mat_metal_frame)
door_frame_r   = create_cube("Glass_Door_FR", (2.35, -1.8, 1.8), (0.08, 0.08, 1.8), mat_metal_frame)
door_frame_mid = create_cube("Glass_Door_FMid", (0, -1.8, 1.8), (0.06, 0.08, 1.8), mat_metal_frame)

glass_door_l = create_cube("Glass_Door_L", (-1.15, -1.8, 1.8), (1.1, 0.03, 1.75), mat_glass, bevel=False)
glass_door_r = create_cube("Glass_Door_R", (1.15, -1.8, 1.8), (1.1, 0.03, 1.75), mat_glass, bevel=False)
closed_sign  = create_cube("Closed_Sign_Neon", (0.6, -1.75, 2.2), (0.35, 0.02, 0.18), mat_closed_sign, bevel=False)

# Exterior Asphalt Parking Lot (Y < -1.8)
asphalt_ground = create_cube("Asphalt_Ground", (0, -10.0, -0.06), (16.0, 9.0, 0.06), mat_asphalt, bevel=False)
# Parking lines
for pl in range(-3, 4):
    create_cube(f"ParkLine_{pl}", (pl * 2.5, -7.0, -0.02), (0.08, 3.5, 0.01), mat_park_stripe, bevel=False)

# Streetlamp Pole & Dramatic Warm Amber Spotlight
street_pole = create_cylinder("Streetlamp_Pole", (-3.5, -6.5, 3.2), 0.09, 6.4, mat_metal_frame)
street_arm  = create_cube("Streetlamp_Arm", (-3.0, -6.5, 6.3), (0.6, 0.1, 0.1), mat_metal_frame)
street_head = create_cube("Streetlamp_Fixture", (-2.5, -6.5, 6.15), (0.35, 0.55, 0.16), mat_street_head)

street_light_data = bpy.data.lights.new(name="Street_Amber_Spot", type='SPOT')
street_light_data.energy = 5500
street_light_data.color = (1.0, 0.65, 0.12)
street_light_data.spot_size = math.radians(65)
street_light_data.spot_blend = 0.35
street_light_obj = bpy.data.objects.new("Street_Amber_Spot_Obj", street_light_data)
scene.collection.objects.link(street_light_obj)
street_light_obj.location = (-2.5, -6.5, 6.0)
street_light_obj.rotation_euler = (math.radians(22), 0, 0)

# Flying Glass Shards (for Shot 4 breach)
glass_shards = []
for i in range(28):
    sx = (i % 6 - 2.5) * 0.22
    sy = -1.8 - (i // 6) * 0.15
    sz = 0.8 + (i % 7) * 0.28
    shard = create_cube(f"Glass_Shard_{i}", (sx, sy, sz), (0.08, 0.08, 0.08), mat_glass)
    shard.hide_render = True
    glass_shards.append(shard)

# 8. ENVIRONMENT: SET 2 - Dark Back Corridor & Walk-In Freezer (Y: 8 to 22)
corridor_floor = create_cube("Corridor_Floor", (0, 14.5, 0), (1.5, 6.5, 0.06), mat_store_floor, bevel=False)
corridor_ceil  = create_cube("Corridor_Ceil", (0, 14.5, 3.6), (1.5, 6.5, 0.06), mat_corridor, bevel=False)
corridor_wall_l= create_cube("Corridor_Wall_L", (-1.5, 14.5, 1.8), (0.06, 6.5, 1.8), mat_corridor)
corridor_wall_r= create_cube("Corridor_Wall_R", (1.5, 14.5, 1.8), (0.06, 6.5, 1.8), mat_corridor)
corridor_wall_end = create_cube("Corridor_End", (0, 21.0, 1.8), (1.5, 0.06, 1.8), mat_corridor)

# Industrial Pipes along ceiling
pipe1 = create_cylinder("Ceiling_Pipe1", (-0.9, 14.5, 3.35), 0.04, 13.0, mat_metal_frame, rotation=(math.radians(90), 0, 0))
pipe2 = create_cylinder("Ceiling_Pipe2", (0.9, 14.5, 3.35), 0.03, 13.0, mat_metal_frame, rotation=(math.radians(90), 0, 0))

# Pulsing Crimson Emergency Light
emerg_fixture = create_cube("Emerg_Fixture", (0, 15.0, 3.45), (0.15, 0.25, 0.08), mat_metal_frame)
emerg_bulb    = create_sphere("Emerg_Bulb", (0, 15.0, 3.32), 0.11, mat_emerg_red)
emerg_light_data = bpy.data.lights.new(name="Emerg_Red_Point", type='POINT')
emerg_light_data.energy = 1400
emerg_light_data.color = (0.95, 0.08, 0.08)
emerg_light_obj = bpy.data.objects.new("Emerg_Red_Point_Obj", emerg_light_data)
scene.collection.objects.link(emerg_light_obj)
emerg_light_obj.location = (0, 15.0, 3.1)

# Left wall: Roof Access Steel Ladder
ladder_rail1 = create_cylinder("Ladder_Rail1", (-1.38, 18.2, 1.8), 0.03, 3.6, mat_metal_frame)
ladder_rail2 = create_cylinder("Ladder_Rail2", (-1.38, 19.1, 1.8), 0.03, 3.6, mat_metal_frame)
for rung in range(9):
    create_cylinder(f"Ladder_Rung_{rung}", (-1.38, 18.65, 0.4 + rung * 0.38), 0.02, 0.88, mat_metal_frame, rotation=(math.radians(90), 0, 0))

# Right wall: Heavy Brushed-Steel Walk-In Freezer Door
freezer_door_frame = create_cube("Freezer_Frame", (1.44, 18.65, 1.65), (0.08, 0.95, 1.65), mat_metal_frame)
freezer_door = create_cube("Freezer_Door", (1.40, 18.65, 1.65), (0.06, 0.85, 1.55), mat_freezer_door)
freezer_hinge1 = create_cylinder("Freezer_Hinge1", (1.35, 18.0, 2.5), 0.04, 0.25, mat_metal_frame)
freezer_hinge2 = create_cylinder("Freezer_Hinge2", (1.35, 18.0, 0.8), 0.04, 0.25, mat_metal_frame)
freezer_latch = create_cube("Freezer_Latch", (1.32, 19.2, 1.5), (0.04, 0.08, 0.35), mat_metal_frame)
exit_sign = create_cube("Exit_Freezer_Sign", (1.38, 18.65, 3.15), (0.04, 0.45, 0.16), mat_exit_green, bevel=False)

# Walk-In Freezer Interior (X > 1.45, Y: 16 to 22)
freezer_floor = create_cube("Freezer_Floor", (4.5, 18.65, 0), (3.0, 3.0, 0.06), mat_freezer_int, bevel=False)
freezer_ceil  = create_cube("Freezer_Ceil", (4.5, 18.65, 3.6), (3.0, 3.0, 0.06), mat_freezer_int, bevel=False)
freezer_back  = create_cube("Freezer_Back", (7.5, 18.65, 1.8), (0.06, 3.0, 1.8), mat_freezer_int)
freezer_side1 = create_cube("Freezer_Side1", (4.5, 15.65, 1.8), (3.0, 0.06, 1.8), mat_freezer_int)
freezer_side2 = create_cube("Freezer_Side2", (4.5, 21.65, 1.8), (3.0, 0.06, 1.8), mat_freezer_int)

# Wire Shelving Racks inside freezer
freezer_rack1 = create_cube("Freezer_Rack1", (6.8, 18.65, 1.4), (0.5, 2.4, 1.4), mat_metal_frame)

# Frost-Blue Cold Rim Light inside freezer
freezer_rim_data = bpy.data.lights.new(name="Freezer_Cold_Rim", type='SPOT')
freezer_rim_data.energy = 450
freezer_rim_data.color = (0.22, 0.74, 0.98) # #38BDF8
freezer_rim_data.spot_size = math.radians(55)
freezer_rim_data.spot_blend = 0.45
freezer_rim_obj = bpy.data.objects.new("Freezer_Cold_Rim_Obj", freezer_rim_data)
scene.collection.objects.link(freezer_rim_obj)
freezer_rim_obj.location = (6.2, 17.0, 2.8)
freezer_rim_obj.rotation_euler = (math.radians(-32), math.radians(45), 0)

# 9. STYLIZED CHARACTERS (Matching Reference Video frame_001, frame_030, frame_054)
class StylizedCharacter:
    def __init__(self, prefix, is_protagonist=True):
        self.prefix = prefix
        self.is_protagonist = is_protagonist

        # Smooth Rounded-Pill Torso
        self.torso = create_cylinder(f"{prefix}_Torso", (0, 0, 1.25), 0.32, 0.75,
                                     mat_cashier_torso if is_protagonist else mat_friend_hood)
        self.torso_cap_top = create_sphere(f"{prefix}_Torso_CapT", (0, 0, 1.62), 0.32,
                                           mat_cashier_torso if is_protagonist else mat_friend_hood)
        self.torso_cap_bot = create_sphere(f"{prefix}_Torso_CapB", (0, 0, 0.88), 0.32,
                                           mat_cashier_torso if is_protagonist else mat_friend_hood)

        # Neck
        self.neck = create_cylinder(f"{prefix}_Neck", (0, 0, 1.74), 0.12, 0.18, mat_skin)

        # Head (Smooth Sphere)
        self.head = create_sphere(f"{prefix}_Head", (0, 0, 2.02), 0.26, mat_skin)

        # Cap & Visor (Protagonist only)
        if is_protagonist:
            self.cap_dome = create_sphere(f"{prefix}_Cap_Dome", (0, 0, 2.16), 0.27, mat_cap_blue)
            self.cap_visor = create_cube(f"{prefix}_Cap_Visor", (0, -0.22, 2.10), (0.24, 0.16, 0.03), mat_cap_blue)
            # Sunglasses / Dark Curved Oval Eyes
            self.eye_l = create_sphere(f"{prefix}_Eye_L", (-0.08, -0.24, 2.05), 0.045, mat_dark_eyes)
            self.eye_r = create_sphere(f"{prefix}_Eye_R", (0.08, -0.24, 2.05), 0.045, mat_dark_eyes)
        else:
            self.cap_dome = None
            self.cap_visor = None
            self.eye_l = None
            self.eye_r = None

        # Shoulders & Articulated Arms
        self.shoulder_l = create_sphere(f"{prefix}_Shoulder_L", (-0.44, 0, 1.48), 0.11,
                                        mat_cashier_torso if is_protagonist else mat_friend_hood)
        self.shoulder_r = create_sphere(f"{prefix}_Shoulder_R", (0.44, 0, 1.48), 0.11,
                                        mat_cashier_torso if is_protagonist else mat_friend_hood)

        self.arm_upper_l = create_cylinder(f"{prefix}_ArmUp_L", (-0.44, 0, 1.25), 0.09, 0.38,
                                           mat_cashier_torso if is_protagonist else mat_friend_hood)
        self.arm_upper_r = create_cylinder(f"{prefix}_ArmUp_R", (0.44, 0, 1.25), 0.09, 0.38,
                                           mat_cashier_torso if is_protagonist else mat_friend_hood)

        self.elbow_l = create_sphere(f"{prefix}_Elbow_L", (-0.44, 0, 1.05), 0.085,
                                     mat_cashier_torso if is_protagonist else mat_friend_hood)
        self.elbow_r = create_sphere(f"{prefix}_Elbow_R", (0.44, 0, 1.05), 0.085,
                                     mat_cashier_torso if is_protagonist else mat_friend_hood)

        self.arm_lower_l = create_cylinder(f"{prefix}_ArmLow_L", (-0.44, 0, 0.88), 0.08, 0.34, mat_skin)
        self.arm_lower_r = create_cylinder(f"{prefix}_ArmLow_R", (0.44, 0, 0.88), 0.08, 0.34, mat_skin)

        # White Sphere Hands (Matching Reference Video)
        self.hand_l = create_sphere(f"{prefix}_Hand_L", (-0.44, 0, 0.68), 0.10, mat_hands_white)
        self.hand_r = create_sphere(f"{prefix}_Hand_R", (0.44, 0, 0.68), 0.10, mat_hands_white)

        # Legs & Shoes
        self.leg_l = create_cylinder(f"{prefix}_Leg_L", (-0.18, 0, 0.44), 0.11, 0.85, mat_cashier_pants)
        self.leg_r = create_cylinder(f"{prefix}_Leg_R", (0.18, 0, 0.44), 0.11, 0.85, mat_cashier_pants)
        self.shoe_l = create_cube(f"{prefix}_Shoe_L", (-0.18, -0.06, 0.06), (0.12, 0.20, 0.06), mat_shoes)
        self.shoe_r = create_cube(f"{prefix}_Shoe_R", (0.18, -0.06, 0.06), (0.12, 0.20, 0.06), mat_shoes)

        # Mimic-Specific Features (Curved Glowing Crescent Eyes & Crescent Grin Arc)
        if not is_protagonist:
            self.mimic_eye_l = create_crescent_eye(f"{prefix}_MimicEye_L", (-0.09, -0.26, 2.06), (1, 1, 1), mat_mimic_glow)
            self.mimic_eye_r = create_crescent_eye(f"{prefix}_MimicEye_R", (0.09, -0.26, 2.06), (1, 1, 1), mat_mimic_glow)
            self.mimic_grin  = create_crescent_arc(f"{prefix}_MimicGrin", (0, -0.26, 1.86), (1, 1, 1), mat_mimic_glow)
            self.mimic_eye_l.hide_render = True
            self.mimic_eye_r.hide_render = True
            self.mimic_grin.hide_render = True
        else:
            self.mimic_eye_l = None
            self.mimic_eye_r = None
            self.mimic_grin = None

    def set_position(self, x, y, z=0.0, rot_z=0.0):
        parts = [
            (self.torso, (0, 0, 1.25)),
            (self.torso_cap_top, (0, 0, 1.62)),
            (self.torso_cap_bot, (0, 0, 0.88)),
            (self.neck, (0, 0, 1.74)),
            (self.head, (0, 0, 2.02)),
            (self.shoulder_l, (-0.44, 0, 1.48)),
            (self.shoulder_r, (0.44, 0, 1.48)),
            (self.arm_upper_l, (-0.44, 0, 1.25)),
            (self.arm_upper_r, (0.44, 0, 1.25)),
            (self.elbow_l, (-0.44, 0, 1.05)),
            (self.elbow_r, (0.44, 0, 1.05)),
            (self.arm_lower_l, (-0.44, 0, 0.88)),
            (self.arm_lower_r, (0.44, 0, 0.88)),
            (self.hand_l, (-0.44, 0, 0.68)),
            (self.hand_r, (0.44, 0, 0.68)),
            (self.leg_l, (-0.18, 0, 0.44)),
            (self.leg_r, (0.18, 0, 0.44)),
            (self.shoe_l, (-0.18, -0.06, 0.06)),
            (self.shoe_r, (0.18, -0.06, 0.06)),
        ]
        if self.cap_dome:
            parts.extend([
                (self.cap_dome, (0, 0, 2.16)),
                (self.cap_visor, (0, -0.22, 2.10)),
                (self.eye_l, (-0.08, -0.24, 2.05)),
                (self.eye_r, (0.08, -0.24, 2.05)),
            ])
        if self.mimic_eye_l:
            parts.extend([
                (self.mimic_eye_l, (-0.09, -0.26, 2.06)),
                (self.mimic_eye_r, (0.09, -0.26, 2.06)),
                (self.mimic_grin, (0, -0.26, 1.86)),
            ])

        cos_r = math.cos(rot_z)
        sin_r = math.sin(rot_z)
        for obj, offset in parts:
            ox, oy, oz = offset
            rx = ox * cos_r - oy * sin_r
            ry = ox * sin_r + oy * cos_r
            obj.location = (x + rx, y + ry, z + oz)
            obj.rotation_euler[2] = rot_z

    def morph_to_mimic(self, reveal_progress):
        if reveal_progress <= 0:
            mat = mat_friend_hood
            self.mimic_eye_l.hide_render = True
            self.mimic_eye_r.hide_render = True
            self.mimic_grin.hide_render = True
        else:
            mat = mat_mimic_void
            self.mimic_eye_l.hide_render = False
            self.mimic_eye_r.hide_render = False
            self.mimic_grin.hide_render = False
            strength = min(18.0, 6.0 + reveal_progress * 12.0)
            mat_mimic_glow.node_tree.nodes["Principled BSDF"].inputs['Emission Strength'].default_value = strength

        for obj in [self.torso, self.torso_cap_top, self.torso_cap_bot, self.head, self.neck,
                    self.shoulder_l, self.shoulder_r, self.arm_upper_l, self.arm_upper_r,
                    self.elbow_l, self.elbow_r, self.arm_lower_l, self.arm_lower_r,
                    self.hand_l, self.hand_r, self.leg_l, self.leg_r, self.shoe_l, self.shoe_r]:
            if obj and obj.data.materials:
                obj.data.materials[0] = mat

# Instantiate Cashier and Mimic
cashier = StylizedCharacter("Cashier", is_protagonist=True)
mimic   = StylizedCharacter("Mimic", is_protagonist=False)

# Main Camera
cam_data = bpy.data.cameras.new("Main_Camera")
cam_data.lens = 24 # Wide cinematic lens for vertical framing
cam_obj = bpy.data.objects.new("Main_Camera", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Camera Back Fill Light (Ensures specular rim highlights on characters)
cam_fill_data = bpy.data.lights.new("Cam_Fill_Light", 'POINT')
cam_fill_data.energy = 500
cam_fill_data.color = (0.55, 0.65, 0.85)
cam_fill_obj = bpy.data.objects.new("Cam_Fill_Light_Obj", cam_fill_data)
scene.collection.objects.link(cam_fill_obj)

print("Scene setup completed successfully!")

# 10. The 8 Modular Shots Definition (3300 frames total @ 60fps)
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
    # progress: 0.0 to 1.0 within the shot
    if shot_idx == 1:
        # Shot 1: Over-the-shoulder dolly-in on Cashier at counter at 03:00.
        # Displays glowing red digital clock, radio, phone, and storefront glass.
        cam_x = 0.85 - progress * 0.20
        cam_y = 5.4 - progress * 1.0
        cam_z = 1.95 + math.sin(progress * 4) * 0.015
        cam_obj.location = (cam_x, cam_y, cam_z)
        cam_obj.rotation_euler = (math.radians(82), 0, math.radians(165))
        cam_fill_obj.location = (cam_x + 0.2, cam_y + 0.4, cam_z + 0.3)

        # Cashier idle breathing bob
        bob = math.sin(progress * 12) * 0.02
        cashier.set_position(0, 3.4, bob, rot_z=math.radians(180))

        # Radio LED rapid pulse
        blink = (math.sin(progress * 35) > 0.0)
        radio_led.hide_render = not blink

        # Fluorescent light flicker around progress 0.55
        flicker = 1.0
        if 0.52 < progress < 0.60:
            flicker = 0.15 if int(progress * 80) % 2 == 0 else 1.0
        store_light_data.energy = 1600 * flicker
        tube_strip1.scale = (0.12, 2.0, 0.02 * flicker)
        tube_strip2.scale = (0.12, 2.0, 0.02 * flicker)

    elif shot_idx == 2:
        # Shot 2: Outside glass doors, Friend runs under flickering streetlamp, bangs on glass.
        # At progress > 0.55, whip-pan down to counter phone vibrating.
        if progress < 0.55:
            p2 = progress / 0.55
            cam_obj.location = (0, 1.2, 1.6 + math.sin(progress * 8) * 0.02)
            cam_obj.rotation_euler = (math.radians(90), 0, math.radians(180))
            cam_fill_obj.location = (0, 2.0, 2.2)

            # Friend runs from parking lot to glass door
            f_y = -5.0 + p2 * 3.0
            run_bob = abs(math.sin(p2 * 14)) * 0.06
            mimic.set_position(0, f_y, run_bob, rot_z=0.0)
            if p2 > 0.8:
                # Banging hands on glass!
                mimic.hand_l.location = (-0.22, -1.85, 1.55 + math.sin(p2 * 30) * 0.05)
                mimic.hand_r.location = (0.22, -1.85, 1.55 + math.cos(p2 * 30) * 0.05)
        else:
            p_pan = (progress - 0.55) / 0.45
            # Whip-pan down to counter telephone
            cam_x = 0.35 + math.sin(p_pan * 80) * 0.015 # Phone vibration
            cam_obj.location = (cam_x, 2.2 - p_pan * 0.3, 1.7 - p_pan * 0.35)
            cam_obj.rotation_euler = (math.radians(55 + p_pan * 20), 0, math.radians(175))
            cam_fill_obj.location = (0.35, 2.6, 2.0)
            phone_handset.location = (0.35 + math.sin(p_pan * 70) * 0.02, 2.8, 1.22)

    elif shot_idx == 3:
        # Shot 3: Medium-wide framing both Friend at door (left) and ringing counter phone (right).
        sway_x = math.sin(progress * 3.5) * 0.04
        cam_obj.location = (0.4 + sway_x, 3.2, 1.7)
        cam_obj.rotation_euler = (math.radians(82), 0, math.radians(172))
        cam_fill_obj.location = (0.4, 3.8, 2.2)

        cashier.set_position(0.2, 3.6, math.sin(progress * 10) * 0.015, rot_z=math.radians(175))
        mimic.set_position(-0.8, -2.0, 0, rot_z=0.0)
        # Phone vibrating
        phone_handset.location = (0.35 + math.sin(progress * 40) * 0.015, 2.8, 1.22)

    elif shot_idx == 4:
        # Shot 4: Cashier holds receiver, turns toward glass. Outside, Friend stops, morphs to Mimic void
        # with curved glowing eyes and crescent grin. At progress > 0.75, smashes through glass doors!
        cam_obj.location = (0.3 - progress * 0.15, 3.0 - progress * 0.8, 1.75)
        cam_obj.rotation_euler = (math.radians(85), 0, math.radians(178))
        cam_fill_obj.location = (0.3, 3.5, 2.2)

        if progress < 0.40:
            cashier.set_position(0.1, 3.5, 0, rot_z=math.radians(180))
            mimic.set_position(0, -2.05, 0, rot_z=0.0)
            mimic.morph_to_mimic(0.0)
        elif progress < 0.75:
            # Reveal: Stops banging, morphs to obsidian void with glowing eyes and crescent grin!
            cashier.set_position(0.1, 3.5, 0, rot_z=math.radians(170))
            mimic.set_position(0, -2.05, 0, rot_z=0.0)
            mimic.morph_to_mimic((progress - 0.40) / 0.35)
        else:
            # SMASH! Lunges through glass door!
            p_smash = (progress - 0.75) / 0.25
            cashier.set_position(0.1, 3.5, 0, rot_z=math.radians(160))
            mimic.set_position(0, -2.05 + p_smash * 2.8, abs(math.sin(p_smash * 8)) * 0.15, rot_z=0.0)
            mimic.morph_to_mimic(1.0)
            # Shatter glass doors into flying cubes
            glass_door_l.scale = (0.01, 0.01, 0.01)
            glass_door_r.scale = (0.01, 0.01, 0.01)
            for i, shard in enumerate(glass_shards):
                shard.hide_render = False
                shard.location = (shard.location[0] + (i % 5 - 2) * p_smash * 0.4,
                                  -1.8 + p_smash * 2.2 + (i % 4) * 0.2,
                                  shard.location[2] - p_smash * 0.5)

    elif shot_idx == 5:
        # Shot 5: Fast handheld sprint camera down red-lit corridor. Quick look-back at progress 0.6.
        if progress < 0.60:
            # Running forward into corridor
            p_run = progress / 0.60
            curr_y = 9.0 + p_run * 8.5
            bob_z = abs(math.sin(p_run * 18)) * 0.08
            bob_x = math.sin(p_run * 9) * 0.05
            cam_obj.location = (bob_x, curr_y, 1.65 + bob_z)
            cam_obj.rotation_euler = (math.radians(90), math.radians(bob_x * 15), 0)
            cam_fill_obj.location = (bob_x, curr_y - 0.8, 1.8)
        else:
            # Whip-look back: Mimic vaulting counter in red light!
            p_look = (progress - 0.60) / 0.40
            cam_obj.location = (0, 17.5, 1.65)
            cam_obj.rotation_euler = (math.radians(88), 0, math.radians(180))
            cam_fill_obj.location = (0, 16.8, 1.8)
            # Mimic pursuing in red corridor
            mimic.morph_to_mimic(1.0)
            mimic.set_position(0, 11.0 + p_look * 3.5, 0.2, rot_z=0.0)

        # Pulse red emergency light
        emerg_light_data.energy = 1400 * (0.6 + 0.4 * math.sin(progress * 25))

    elif shot_idx == 6:
        # Shot 6: Skids to stop facing red corridor fork: Roof Ladder (left) vs Freezer Door (right).
        cam_obj.location = (0, 17.8 + math.sin(progress * 4) * 0.03, 1.65)
        cam_obj.rotation_euler = (math.radians(85), 0, 0)
        cam_fill_obj.location = (0, 17.0, 1.8)

        # Emergency red bulb pulsing
        emerg_light_data.energy = 1400 * (0.7 + 0.3 * math.sin(progress * 30))

    elif shot_idx == 7:
        # Shot 7: Camera rushes into freezer. At progress > 0.50, heavy door slams shut!
        if progress < 0.50:
            p_in = progress / 0.50
            # Diving through door into freezer
            cam_obj.location = (1.4 + p_in * 2.2, 18.65, 1.65)
            cam_obj.rotation_euler = (math.radians(85), 0, math.radians(-90))
            cam_fill_obj.location = (2.0, 18.65, 1.8)
        else:
            p_shut = (progress - 0.50) / 0.50
            cam_obj.location = (4.2, 18.65, 1.65)
            cam_obj.rotation_euler = (math.radians(85), 0, math.radians(-90))
            cam_fill_obj.location = (3.5, 18.65, 1.8)
            # Door swings shut sealing out corridor red light
            freezer_door.rotation_euler = (0, 0, math.radians(max(0, 75 - p_shut * 75)))
            # Red light cut off, frost blue rim light takes over
            emerg_light_data.energy = 0
            cashier.set_position(4.8, 18.65, math.sin(progress * 10) * 0.02, rot_z=math.radians(-90))

    elif shot_idx == 8:
        # Shot 8: Tight close-up on Cashier in dark freezer. From progress 0.3 to 0.8,
        # two glowing crescent white eyes and crescent grin fade in behind shoulder.
        # Snaps forward on final 15% before cut to black!
        cam_obj.location = (4.0, 18.65, 1.85)
        cam_obj.rotation_euler = (math.radians(88), 0, math.radians(-90))
        cam_fill_obj.location = (4.5, 18.65, 2.0)
        cam_fill_data.energy = 150 # Faint rim light

        cashier.set_position(4.6, 18.65, math.sin(progress * 8) * 0.015, rot_z=math.radians(-90))

        if progress < 0.30:
            mimic.mimic_eye_l.hide_render = True
            mimic.mimic_eye_r.hide_render = True
            mimic.mimic_grin.hide_render = True
        elif progress < 0.80:
            # Fading in right behind Cashier's shoulder in the pitch-black freezer!
            p_fade = (progress - 0.30) / 0.50
            mimic.morph_to_mimic(1.0)
            mat_mimic_glow.node_tree.nodes["Principled BSDF"].inputs['Emission Strength'].default_value = p_fade * 14.0
            mimic.set_position(5.5, 18.4, 0.0, rot_z=math.radians(-90))
        else:
            # JUMP-SNAP FORWARD! Snapping right next to camera!
            p_snap = (progress - 0.80) / 0.20
            mimic.morph_to_mimic(1.0)
            mat_mimic_glow.node_tree.nodes["Principled BSDF"].inputs['Emission Strength'].default_value = 22.0
            snap_x = 5.5 - p_snap * 1.15
            mimic.set_position(snap_x, 18.45, 0.0, rot_z=math.radians(-90))

# 11. PREVIEW RENDER FUNCTION (Mandatory Still Checks)
def render_previews():
    print("\n=== RENDERING MANDATORY PREVIEW STILLS (ZERO NOISE EEVEE) ===")
    scene.render.image_settings.file_format = 'PNG'

    # Preview 1: Store Setup (Shot 1, mid frame)
    setup_shot(1, 0.5)
    test_store_path = os.path.join(OUTPUT_DIR, "test_store.png")
    scene.render.filepath = test_store_path
    bpy.ops.render.render(write_still=True)
    print(f"Rendered test preview: {test_store_path} ({os.path.getsize(test_store_path)} bytes)")

    # Preview 2: Mimic Reveal (Shot 4, reveal frame)
    setup_shot(4, 0.65)
    test_mimic_path = os.path.join(OUTPUT_DIR, "test_mimic.png")
    scene.render.filepath = test_mimic_path
    bpy.ops.render.render(write_still=True)
    print(f"Rendered test preview: {test_mimic_path} ({os.path.getsize(test_mimic_path)} bytes)")
    print("=== PREVIEWS COMPLETED SUCCESSFULLY ===")

# 12. BATCH RENDER FUNCTION FOR ALL 8 SHOTS
def render_all_shots():
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 92

    for s_idx, shot_info in enumerate(SHOTS, start=1):
        shot_name = shot_info["id"]
        n_frames = shot_info["frames"]
        dur_sec = shot_info["dur_sec"]
        target_mp4 = os.path.join(OUTPUT_DIR, f"{shot_name}.mp4")
        shot_tmp_dir = os.path.join(TMP_DIR, shot_name)

        os.makedirs(shot_tmp_dir, exist_ok=True)
        print(f"\n--- RENDERING {shot_name.upper()} ({dur_sec}s | {n_frames} frames) ---")

        # Reset shot state
        store_light_data.energy = 1600
        emerg_light_data.energy = 1400
        freezer_door.rotation_euler = (0, 0, 0)
        glass_door_l.scale = (1.1, 0.03, 1.75)
        glass_door_r.scale = (1.1, 0.03, 1.75)
        for shard in glass_shards:
            shard.hide_render = True

        if s_idx < 4:
            mimic.morph_to_mimic(0.0)

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
            "-crf", "16",
            "-preset", "fast",
            target_mp4
        ]
        print(f"[{shot_name}] Encoding to {target_mp4} at 60fps...")
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"[{shot_name}] Successfully created {target_mp4} ({os.path.getsize(target_mp4)} bytes)")

        # Clean temporary frames for this shot
        shutil.rmtree(shot_tmp_dir, ignore_errors=True)

    # Clean up base tmp dir
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("\n=== ALL 8 SHOTS SUCCESSFULLY RENDERED IN PUBLIC/RENDERS/ ===")

if __name__ == "__main__":
    if "--preview-only" in sys.argv:
        render_previews()
    else:
        render_all_shots()
