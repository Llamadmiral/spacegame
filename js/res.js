const IMAGES = [
	{"name": "tile", "src": "img/tile.png", "anim": false},
	{"name": "wall_horizontal", "src": "img/wall_horizontal.png", "anim": false},
	{"name": "wall_vertical", "src": "img/wall_vertical.png", "anim": false},
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
	{"name": "ship_inner_wing_left", "src":"img/ship/ship_inner_wing_left.png","anim":false},
	{"name": "ship_middle_wing_left", "src":"img/ship/ship_middle_wing_left.png","anim":true, "numberOfFrames":4},
	{"name": "ship_middle_wing_right", "src":"img/ship/ship_middle_wing_right.png","anim":true, "numberOfFrames":4},
	{"name": "wall_cross", "src": "img/wall_cross.png", "anim": false}
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
	{"name":"tile",			   "walkable":true,  "passesLight":true,   				  "tileImage":"tile"},
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