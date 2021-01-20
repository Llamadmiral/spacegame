const MATRIX_ANY = -1;
const MATRIX_SPACE = 0;
const MATRIX_TILE = 1;
const MATRIX_WALL = 2;

const IMAGES = [
    {"name": "tile", "src": "img/tile.png"},
    {"name": "wall_horizontal", "src": "img/walls/wall_horizontal.png"},
    {"name": "wall_vertical", "src": "img/walls/wall_vertical.png"},
    {"name": "wall_cross", "src": "img/walls/wall_cross.png"},
    {"name": "player", "src": "img/player.png"},
    {"name": "tile_debug", "src": "img/tile_debug.png"},
    {"name": "door_open_horizontal", "src": "img/doors/door_open_horizontal.png"},
    {"name": "door_open_vertical", "src": "img/doors/door_open_vertical.png"},
    {"name": "door_closed_horizontal", "src": "img/doors/door_closed_horizontal.png"},
    {"name": "door_closed_vertical", "src": "img/doors/door_closed_vertical.png"},
    {
        "name": "door_opening_horizontal",
        "src": "img/doors/door_opening_horizontal.png",
        "anim": true,
        "numberOfFrames": 8
    },
    {
        "name": "door_closing_horizontal",
        "src": "img/doors/door_closing_horizontal.png",
        "anim": true,
        "numberOfFrames": 8
    },
    {"name": "door_opening_vertical", "src": "img/doors/door_opening_vertical.png", "anim": true, "numberOfFrames": 8},
    {"name": "door_closing_vertical", "src": "img/doors/door_closing_vertical.png", "anim": true, "numberOfFrames": 8},
    {"name": "ship_front", "src": "img/ship/ship_front.png"},
    {"name": "ship_inner_wing_right", "src": "img/ship/ship_inner_wing_right.png"},
    {"name": "ship_tile_rust", "src": "img/ship/ship_tile_rust.png"},
    {"name": "ship_tile_normal", "src": "img/ship/ship_tile_normal.png"},
    {"name": "TILE_Floor_HeavyPlated_A_EWWW", "src": "img/ship/floor/TILE_FLOOR_HeavyPlated_A_EWWW.png"},
    {"name": "TILE_Floor_Plated_D_WWEW", "src": "img/ship/floor/TILE_FLOOR_Plated_D_WWEW.png"},
    {"name": "TILE_Floor_ScrapPlated_F", "src": "img/ship/floor/TILE_FLOOR_ScrapPlated_F.png"},
    {"name": "TILE_Floor_Plated_D_WWEW", "src": "img/ship/floor/TILE_FLOOR_Plated_D_WWEW.png"},
    {"name": "TILE_Floor_DarkPlated_B_EEWE", "src": "img/ship/floor/TILE_FLOOR_DarkPlated_B_EEWE.png"},
    {"name": "TILE_Floor_HeavyPlated_D_EWWW", "src": "img/ship/floor/TILE_FLOOR_HeavyPlated_D_EWWW.png"},
    {"name": "TILE_Floor_DarkPlated_A_EWWW", "src": "img/ship/floor/TILE_FLOOR_DarkPlated_A_EWWW.png"},
    {"name": "TILE_Floor_Plain_H_WEWW", "src": "img/ship/floor/TILE_FLOOR_Plain_H_WEWW.png"},
    {"name": "TILE_Floor_Plain_A_EWWE", "src": "img/ship/floor/TILE_FLOOR_Plain_A_EWWE.png"},
    {"name": "TILE_Floor_Plain_G_EWWW", "src": "img/ship/floor/TILE_FLOOR_Plain_G_EWWW.png"},
    {"name": "TILE_Floor_HeavyPlated_B_EEWE", "src": "img/ship/floor/TILE_FLOOR_HeavyPlated_B_EEWE.png"},
    {"name": "TILE_Floor_Plain_D_EWWW", "src": "img/ship/floor/TILE_FLOOR_Plain_D_EWWW.png"},
    {"name": "TILE_Floor_HeavyPlated_C_EEWW", "src": "img/ship/floor/TILE_FLOOR_HeavyPlated_C_EEWW.png"},
    {"name": "TILE_Floor_Plain_E_EEWE", "src": "img/ship/floor/TILE_FLOOR_Plain_E_EEWE.png"},
    {"name": "TILE_Floor_Plain_F_EEWE", "src": "img/ship/floor/TILE_FLOOR_Plain_F_EEWE.png"},
    {"name": "TILE_Floor_Plain_C_EEWE", "src": "img/ship/floor/TILE_FLOOR_Plain_C_EEWE.png"},
    {"name": "TILE_Floor_Plain_B_EWWE", "src": "img/ship/floor/TILE_FLOOR_Plain_B_EWWE.png"},
    {"name": "ship_inner_wing_left", "src": "img/ship/ship_inner_wing_left.png"},
    {"name": "TILE_nav_system", "src": "img/ship/TILE_nav_system.png"},
    {"name": "ship_middle_wing_left", "src": "img/ship/ship_middle_wing_left.png", "anim": true, "numberOfFrames": 4},
    {"name": "ship_middle_wing_right", "src": "img/ship/ship_middle_wing_right.png", "anim": true, "numberOfFrames": 4},


    {
        "name": "TILE_Door_Floor_A_Animation_55F",
        "src": "img/doors/TILE_Door_Floor_A_Animation_55F.png",
        "anim": true,
        "numberOfFrames": 55,
        "animationLength": FPS * 2
    },
    {
        "name": "TILE_Door_Left_Down_Animation_55F",
        "src": "img/doors/TILE_Door_Left_Down_Animation_55F.png",
        "anim": true,
        "numberOfFrames": 55,
        "animationLength": FPS * 2
    },
    {
        "name": "TILE_Door_Left_Up_Animation_55F",
        "src": "img/doors/TILE_Door_Left_Up_Animation_55F.png",
        "anim": true,
        "numberOfFrames": 55,
        "animationLength": FPS * 2
    },

    {
        "name": "TILE_Door_Floor_A_Animation_55F",
        "src": "img/doors/TILE_Door_Floor_A_Animation_55F.png",
        "anim": true,
        "numberOfFrames": 55,
        "animationLength": FPS * 2
    },
    {
        "name": "TILE_Door_Right_Down_Animation_55F",
        "src": "img/doors/TILE_Door_Right_Down_Animation_55F.png",
        "anim": true,
        "numberOfFrames": 55,
        "animationLength": FPS * 2
    },
    {
        "name": "TILE_Door_Right_Up_Animation_55F",
        "src": "img/doors/TILE_Door_Right_Up_Animation_55F.png",
        "anim": true,
        "numberOfFrames": 55,
        "animationLength": FPS * 2
    },

    {"name": "TILE_Wall_Bottom_EE", "src": "img/ship/TILE_Wall_Bottom_EE.png"},
    {"name": "TILE_Wall_Bottom_WE", "src": "img/ship/TILE_Wall_Bottom_WE.png"},
    {"name": "TILE_Wall_Bottom_Window_WW", "src": "img/ship/TILE_Wall_Bottom_Window_WW.png"},

    {"name": "TILE_Wall_Outer_Bottom_Left", "src": "img/ship/TILE_Wall_Outer_Bottom_Left.png"},
    {"name": "TILE_Wall_Bottom_LeftBent_EE", "src": "img/ship/TILE_Wall_Bottom_LeftBent_EE.png"},

    {"name": "TILE_Wall_Outer_Bottom_Right", "src": "img/ship/TILE_Wall_Outer_Bottom_Right.png"},
    {"name": "TILE_Wall_Bottom_RightBent_EE", "src": "img/ship/TILE_Wall_Bottom_RightBent_EE.png"},
    {"name": "TILE_Wall_Inner_Bottom_Right", "src": "img/ship/TILE_Wall_Inner_Bottom_Right.png"},
    {"name": "TILE_Wall_Inner_Bottom_Left", "src": "img/ship/TILE_Wall_Inner_Bottom_Left.png"},

    {"name": "TILE_Wall_Outer_Top_Left", "src": "img/ship/TILE_Wall_Outer_Top_Left.png"},
    {"name": "TILE_Wall_Top_LeftBent_EW", "src": "img/ship/TILE_Wall_Top_LeftBent_EW.png"},
    {"name": "TILE_Wall_Top_LeftBent_WE", "src": "img/ship/TILE_Wall_Top_LeftBent_WE.png"},
    {"name": "TILE_Wall_Inner_Top_Left", "src": "img/ship/TILE_Wall_Inner_Top_Left.png"},

    {"name": "TILE_Wall_Inner_Top_Right", "src": "img/ship/TILE_Wall_Inner_Top_Right.png"},
    {"name": "TILE_Wall_Outer_Top_Right", "src": "img/ship/TILE_Wall_Outer_Top_Right.png"},
    {"name": "TILE_Wall_Top_RightBent_EE", "src": "img/ship/TILE_Wall_Top_RightBent_EE.png"},
    {"name": "TILE_Wall_Top_RightBent_WW", "src": "img/ship/TILE_Wall_Top_RightBent_WW.png"},


    {"name": "TILE_Wall_Top_EE", "src": "img/ship/TILE_Wall_Top_EE.png"},
    {"name": "TILE_Wall_Top_WE", "src": "img/ship/TILE_Wall_Top_WE.png"},
    {"name": "TILE_Wall_Top_WW", "src": "img/ship/TILE_Wall_Top_WW.png"},


    {"name": "TILE_Wall_Left", "src": "img/ship/TILE_Wall_Left.png"},
    {"name": "TILE_Wall_Right", "src": "img/ship/TILE_Wall_Right.png"},
    {"name": "TILE_Wall_Right_Pipes", "src": "img/ship/TILE_Wall_Right_Pipes.png"},

    {"name": "TILE_Floor_Bridge_C", "src": "img/ship/floor/TILE_FLOOR_Bridge_C.png"},
    {"name": "TILE_Wall_Bridge_Top_C", "src": "img/ship/TILE_Wall_Bridge_Top_C.png"},
    {"name": "TILE_Wall_Bridge_Bottom_C", "src": "img/ship/TILE_Wall_Bridge_Bottom_C.png"},

    {"name": "TILE_Wall_Start_WW", "src": "img/ship/TILE_Wall_Start_WW.png"},
    {"name": "TILE_Wall_Pipes_WW", "src": "img/ship/TILE_Wall_Pipes_WW.png"},
    {"name": "TILE_Wall_Top_Shifted_X_WW", "src": "img/ship/TILE_Wall_Top_Shifted_X_WW.png"},
    {"name": "TILE_Wall_WW", "src": "img/ship/TILE_Wall_WW.png"},
    {"name": "TILE_Wall_End_WW", "src": "img/ship/TILE_Wall_End_WW.png"},

    {"name": "monster_blob", "src": "img/monster/monster_blob.png", "selectable": true},

    {"name": "hologram_border", "src": "img/ui/hologram_border.png", "createRotaiton": true},
    {"name": "hologram_border_pillar", "src": "img/ui/hologram_border_pillar.png"},

    {"name": "pew", "src": "img/ui/action_icons/pew.png"},
];

const STRUCTURES = [
    {
        "name": "player_ship", "tiles": [
            ["tile_debug", "tile_debug", "tile_debug", "TILE_nav_system", "tile_debug", "tile_debug", "tile_debug"],
            ["tile_debug", "ship_tile", "ship_tile", "spawn_point", "ship_tile", "ship_tile", "docking_door_vertical_top_right"],
            ["tile_debug", "ship_tile", "ship_tile", "ship_tile", "ship_tile", "ship_tile", "docking_door_vertical_right"],
            ["tile_debug", "ship_tile", "ship_tile", "ship_tile", "ship_tile", "ship_tile", "docking_door_vertical_bottom_right"],
            ["tile_debug", "ship_tile", "ship_tile", "ship_tile", "ship_tile", "ship_tile", "tile_debug"],
            ["tile_debug", "ship_middle_wing_left", "ship_inner_wing_left", "ship_front", "ship_inner_wing_right", "ship_middle_wing_right", "tile_debug"]
        ]
    },
];

const STRUCTURE_TILES = [
    {
        "name": "tile",
        "walkable": true,
        "passesLight": true,
        "tileImages": ["TILE_Floor_Plain_A_EWWE", "TILE_Floor_Plain_B_EWWE", "TILE_Floor_Plain_C_EEWE", "TILE_Floor_Plain_D_EWWW", "TILE_Floor_Plain_E_EEWE", "TILE_Floor_Plain_F_EEWE", "TILE_Floor_Plain_G_EWWW", "TILE_Floor_Plain_H_WEWW"]
    },
    {"name": "tile_debug", "walkable": true, "passesLight": true, "tileImage": "tile_debug"},
    {"name": "wall_horizontal", "walkable": false, "passesLight": false, "clazz": Wall, "tileImage": "wall_horizontal"},
    {"name": "wall_vertical", "walkable": false, "passesLight": false, "clazz": Wall, "tileImage": "wall_vertical"},
    {"name": "wall_cross", "walkable": false, "passesLight": false, "clazz": Wall, "tileImage": "wall_cross"},
    {"name": "ship_tile", "walkable": true, "passesLight": true, "tileImages": ["ship_tile_normal", "ship_tile_rust"]},
    {
        "name": "spawn_point",
        "walkable": true,
        "passesLight": true,
        "tileImages": ["ship_tile_normal", "ship_tile_rust"]
    },
    {
        "name": "door_vertical",
        "walkable": true,
        "passesLight": true,
        "clazz": Door,
        "tileImage": "door_closed_vertical"
    },
    {
        "name": "door_horizontal",
        "walkable": true,
        "passesLight": true,
        "clazz": Door,
        "tileImage": "door_closed_horizontal"
    },
    {
        "name": "docking_door_vertical_left",
        "walkable": true,
        "passesLight": true,
        "clazz": Door,
        "tileImage": "TILE_Door_Floor_A_Animation_55F"
    },
    {
        "name": "docking_door_vertical_top_left",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Door_Left_Up_Animation_55F"
    },
    {
        "name": "docking_door_vertical_bottom_left",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Door_Left_Down_Animation_55F"
    },
    {
        "name": "docking_door_vertical_right",
        "walkable": true,
        "passesLight": true,
        "clazz": Door,
        "tileImage": "TILE_Door_Floor_A_Animation_55F"
    },
    {
        "name": "docking_door_vertical_top_right",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Door_Right_Up_Animation_55F"
    },
    {
        "name": "docking_door_vertical_bottom_right",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Door_Right_Down_Animation_55F"
    },
    {
        "name": "ship_hull_bottom",
        "walkable": false,
        "passesLight": false,
        "tileImages": ["TILE_Wall_Bottom_EE", "TILE_Wall_Bottom_WE", "TILE_Wall_Bottom_Window_WW"]
    },
    {
        "name": "ship_hull_top",
        "walkable": false,
        "passesLight": false,
        "tileImages": ["TILE_Wall_Top_EE", "TILE_Wall_Top_WE", "TILE_Wall_Top_WW"]
    },
    {"name": "ship_hull_left", "walkable": false, "passesLight": false, "tileImage": "TILE_Wall_Left"},
    {
        "name": "ship_hull_right",
        "walkable": false,
        "passesLight": false,
        "tileImages": ["TILE_Wall_Right", "TILE_Wall_Right_Pipes"]
    },
    {
        "name": "ship_hull_bottom_left_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Outer_Bottom_Left"
    },
    {
        "name": "ship_hull_bottom_left_inner_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Inner_Bottom_Left"
    },
    {
        "name": "ship_hull_bottom_right_inner_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Inner_Bottom_Right"
    },
    {
        "name": "ship_hull_bottom_left",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Bottom_LeftBent_EE"
    },
    {
        "name": "ship_hull_bottom_right_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Outer_Bottom_Right"
    },
    {
        "name": "ship_hull_bottom_right",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Bottom_RightBent_EE"
    },
    {
        "name": "ship_hull_top_left_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Outer_Top_Left"
    },
    {
        "name": "ship_hull_top_left_inner_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Inner_Top_Left"
    },
    {
        "name": "ship_hull_top_left",
        "walkable": false,
        "passesLight": false,
        "tileImages": ["TILE_Wall_Top_LeftBent_EW", "TILE_Wall_Top_LeftBent_WE"]
    },
    {
        "name": "ship_hull_top_right_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Outer_Top_Right"
    },
    {
        "name": "ship_hull_top_right_inner_corner",
        "walkable": false,
        "passesLight": false,
        "tileImage": "TILE_Wall_Inner_Top_Right"
    },
    {
        "name": "ship_hull_top_right",
        "walkable": false,
        "passesLight": false,
        "tileImages": ["TILE_Wall_Top_RightBent_EE", "TILE_Wall_Top_RightBent_WW"]
    },
    {"name": "ship_inner_wall_NS_start", "walkable": false, "passesLight": false, "tileImage": "TILE_Wall_Start_WW"},
    {
        "name": "ship_inner_wall_NS",
        "walkable": false,
        "passesLight": false,
        "tileImages": ["TILE_Wall_Pipes_WW", "TILE_Wall_Top_Shifted_X_WW", "TILE_Wall_WW"]
    },
    {"name": "ship_inner_wall_NS_end", "walkable": false, "passesLight": false, "tileImage": "TILE_Wall_End_WW"},
    {"name": "ship_bridge_floor_c", "walkable": true, "passesLight": true, "tileImage": "TILE_Floor_Bridge_C"},
    {"name": "ship_bridge_top_c", "walkable": false, "passesLight": false, "tileImage": "TILE_Wall_Bridge_Top_C"},
    {"name": "ship_bridge_bottom_c", "walkable": false, "passesLight": false, "tileImage": "TILE_Wall_Bridge_Bottom_C"},
    {
        "name": "TILE_nav_system",
        "walkable": false,
        "passesLight": false,
        "clazz": PlayerShipNavigation,
        "tileImage": "TILE_nav_system"
    },
];

const STRUCTURE_MATRIX = [
    {
        "name": "ship_hull_left",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY]
    },
    {
        "name": "ship_hull_top",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_TILE]
    },
    {
        "name": "ship_hull_right",
        "matrix": [MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_bottom",
        "matrix": [MATRIX_TILE, MATRIX_ANY, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_bottom_left_corner",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_bottom_left",
        "matrix": [MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_bottom_right_corner",
        "matrix": [MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_bottom_right",
        "matrix": [MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_top_left_corner",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE]
    },
    {
        "name": "ship_hull_top_left",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE]
    },
    {
        "name": "ship_hull_top_right_corner",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_top_right",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE]
    },
    {
        "name": "ship_hull_top_left_inner_corner",
        "matrix": [MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_ANY]
    },
    {
        "name": "ship_hull_top_right_inner_corner",
        "matrix": [MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY, MATRIX_SPACE, MATRIX_SPACE, MATRIX_TILE, MATRIX_ANY, MATRIX_TILE, MATRIX_TILE]
    },
    {
        "name": "ship_hull_bottom_right_inner_corner",
        "matrix": [MATRIX_ANY, MATRIX_TILE, MATRIX_ANY, MATRIX_ANY, MATRIX_SPACE, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY]
    },
    {
        "name": "ship_hull_bottom_left_inner_corner",
        "matrix": [MATRIX_ANY, MATRIX_TILE, MATRIX_ANY, MATRIX_TILE, MATRIX_SPACE, MATRIX_SPACE, MATRIX_ANY, MATRIX_SPACE, MATRIX_ANY]
    },
    {
        "name": "docking_door_vertical",
        "matrix": [MATRIX_SPACE, MATRIX_WALL, MATRIX_TILE, MATRIX_SPACE, MATRIX_WALL, MATRIX_TILE, MATRIX_SPACE, MATRIX_WALL, MATRIX_TILE]
    },
    {
        "name": "ship_inner_wall_NS_start",
        "matrix": [MATRIX_TILE, MATRIX_TILE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE]
    },
    {
        "name": "ship_inner_wall_NS",
        "matrix": [MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE]
    },
    {
        "name": "ship_inner_wall_NS_end",
        "matrix": [MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_SPACE, MATRIX_TILE, MATRIX_TILE, MATRIX_TILE, MATRIX_TILE]
    },
];

const LOADED_STRUCTURE_TILES = {};
const LOADED_IMAGES = {};
const LOADED_STRUCTURES = {};
const LOADED_STRUCTURE_MATRIXES = {};