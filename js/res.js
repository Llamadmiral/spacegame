const IMAGES = [
	{"name": "tile", "src": "img/tile.png", "anim": false},
	{"name": "wall_horizontal", "src": "img/walls/wall_horizontal.png", "anim": false},
	{"name": "wall_vertical", "src": "img/walls/wall_vertical.png", "anim": false},
	{"name": "wall_cross", "src": "img/walls/wall_cross.png", "anim": false},
	{"name": "player", "src": "img/player.png", "anim": false},
	{"name": "tile_debug", "src": "img/tile_debug.png", "anim": false},
	{"name": "door_open_horizontal", "src": "img/doors/door_open_horizontal.png", "anim": false},
	{"name": "door_open_vertical", "src": "img/doors/door_open_vertical.png", "anim": false},
	{"name": "door_closed_horizontal", "src": "img/doors/door_closed_horizontal.png", "anim": false},
	{"name": "door_closed_vertical", "src": "img/doors/door_closed_vertical.png", "anim": false},
	{"name": "door_opening_horizontal", "src": "img/doors/door_opening_horizontal.png", "anim": true, "numberOfFrames":8},
	{"name": "door_closing_horizontal", "src": "img/doors/door_closing_horizontal.png", "anim": true, "numberOfFrames":8},
	{"name": "door_opening_vertical", "src": "img/doors/door_opening_vertical.png", "anim": true, "numberOfFrames":8},
	{"name": "door_closing_vertical", "src": "img/doors/door_closing_vertical.png", "anim": true, "numberOfFrames":8},
	{"name": "ship_front", "src":"img/ship/ship_front.png","anim":false},
	{"name": "ship_inner_wing_right", "src":"img/ship/ship_inner_wing_right.png","anim":false},
	{"name": "ship_tile_rust", "src":"img/ship/ship_tile_rust.png","anim":false},
	{"name": "ship_tile_normal", "src":"img/ship/ship_tile_normal.png","anim":false},
	{"name": "TILE_Floor_HeavyPlated_A_EWWW", "src":"img/ship/TILE_Floor_HeavyPlated_A_EWWW.png","anim":false},
	{"name": "TILE_Floor_Plated_D_WWEW", "src":"img/ship/TILE_Floor_Plated_D_WWEW.png","anim":false},
	{"name": "TILE_Floor_ScrapPlated_F", "src":"img/ship/TILE_Floor_ScrapPlated_F.png","anim":false},
	{"name": "TILE_Floor_Plated_D_WWEW", "src":"img/ship/TILE_Floor_Plated_D_WWEW.png","anim":false},
	{"name": "TILE_Floor_DarkPlated_B_EEWE", "src":"img/ship/TILE_Floor_DarkPlated_B_EEWE.png","anim":false},
	{"name": "TILE_Floor_HeavyPlated_D_EWWW", "src":"img/ship/TILE_Floor_HeavyPlated_D_EWWW.png","anim":false},
	{"name": "TILE_Floor_DarkPlated_A_EWWW", "src":"img/ship/TILE_Floor_DarkPlated_A_EWWW.png","anim":false},
	{"name": "TILE_Floor_Plain_H_WEWW", "src":"img/ship/TILE_Floor_Plain_H_WEWW.png","anim":false},
	{"name": "TILE_Floor_Plain_A_EWWE", "src":"img/ship/TILE_Floor_Plain_A_EWWE.png","anim":false},
	{"name": "TILE_Floor_Plain_G_EWWW", "src":"img/ship/TILE_Floor_Plain_G_EWWW.png","anim":false},
	{"name": "TILE_Floor_HeavyPlated_B_EEWE", "src":"img/ship/TILE_Floor_HeavyPlated_B_EEWE.png","anim":false},
	{"name": "TILE_Floor_Plain_D_EWWW", "src":"img/ship/TILE_Floor_Plain_D_EWWW.png","anim":false},
	{"name": "TILE_Floor_HeavyPlated_C_EEWW", "src":"img/ship/TILE_Floor_HeavyPlated_C_EEWW.png","anim":false},
	{"name": "TILE_Floor_Plain_E_EEWE", "src":"img/ship/TILE_Floor_Plain_E_EEWE.png","anim":false},
	{"name": "TILE_Floor_Plain_F_EEWE", "src":"img/ship/TILE_Floor_Plain_F_EEWE.png","anim":false},
	{"name": "TILE_Floor_Plain_C_EEWE", "src":"img/ship/TILE_Floor_Plain_C_EEWE.png","anim":false},
	{"name": "TILE_Floor_Plain_B_EWWE", "src":"img/ship/TILE_Floor_Plain_B_EWWE.png","anim":false},
	{"name": "ship_inner_wing_left", "src":"img/ship/ship_inner_wing_left.png","anim":false},
	{"name": "ship_middle_wing_left", "src":"img/ship/ship_middle_wing_left.png","anim":true, "numberOfFrames":4},
	{"name": "ship_middle_wing_right", "src":"img/ship/ship_middle_wing_right.png","anim":true, "numberOfFrames":4},
];

const STRUCTURES = [
{"name":"player_ship", "tiles":[
	["tile_debug","ship_tile","ship_tile","ship_tile","ship_tile","ship_tile","door_vertical"],
	["tile_debug","ship_tile","ship_tile","ship_tile","ship_tile","ship_tile","tile_debug"],
	["tile_debug","ship_tile","ship_tile","ship_tile","ship_tile","ship_tile","tile_debug"],
	["tile_debug","ship_middle_wing_left","ship_inner_wing_left","ship_front","ship_inner_wing_right","ship_middle_wing_right","tile_debug"]
	]}
];

const STRUCTURE_TILES = [
	{"name":"tile",			   "walkable":true,  "passesLight":true,   				  "tileImages":["TILE_Floor_Plain_A_EWWE", "TILE_Floor_Plain_B_EWWE", "TILE_Floor_Plain_C_EEWE", "TILE_Floor_Plain_D_EWWW", "TILE_Floor_Plain_E_EEWE", "TILE_Floor_Plain_F_EEWE", "TILE_Floor_Plain_G_EWWW", "TILE_Floor_Plain_H_WEWW"]},
	{"name":"tile_debug",	   "walkable":true,  "passesLight":true,   		          "tileImage":"tile_debug"},
	{"name":"wall_horizontal", "walkable":false, "passesLight":false,  "clazz":Wall,  "tileImage":"wall_horizontal"},
	{"name":"wall_vertical",   "walkable":false, "passesLight":false,  "clazz":Wall,  "tileImage":"wall_vertical"},
	{"name":"wall_cross",      "walkable":false, "passesLight":false,  "clazz":Wall,  "tileImage":"wall_cross"},
	{"name":"ship_tile", 	   "walkable":true,  "passesLight":true,   				  "tileImages":["ship_tile_normal", "ship_tile_rust"]},
	{"name":"door_vertical",   "walkable":true,  "passesLight":true,   "clazz": Door, "tileImage":"door_closed_vertical"},
	{"name":"door_horizontal",  "walkable":true, "passesLight":true,   "clazz": Door, "tileImage":"door_closed_horizontal"}
];

const LOADED_STRUCTURE_TILES = {};
const LOADED_IMAGES = {};
const LOADED_STRUCTURES = {};