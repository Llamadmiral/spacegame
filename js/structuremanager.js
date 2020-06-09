const TILEMAP = {};
const NEIGHBOUR_OFFSETS = [
	[0, TILE_SIZE],
	[TILE_SIZE, 0],
	[0, -TILE_SIZE],
	[-TILE_SIZE, 0]
];

const MAX_ROOM_DIMENSION = 11 + 1;
const MIN_ROOM_DIMENSION = 3;
const MAX_ROOM_OFFSET = 6 + 1;
const MIN_ROOM_OFFSET = 0 + 1;

const TILEMAP_ARRAY = [];

function generateShip(){
	let ship = new Ship();
	let numberOfRooms = rnd(10, 12);
	let rooms = [];
	
	for(let i = 0; i < numberOfRooms; i++){
		let roomX = rnd(MIN_ROOM_OFFSET, MAX_ROOM_OFFSET);
		let roomY = rnd(MIN_ROOM_OFFSET, MAX_ROOM_OFFSET);
		let roomWidth = rnd(MIN_ROOM_DIMENSION, MAX_ROOM_DIMENSION);
		let roomHeight = rnd(MIN_ROOM_DIMENSION, MAX_ROOM_DIMENSION);
		let room = new Box(roomX, roomY, roomWidth, roomHeight);
		if(rooms.length === 0){
			rooms.push(room);
		} else {
			let directionToStickTo = rnd(0, 4);
			let collidesWithOthers = room.doCollideMultiple(rooms);
			if(!collidesWithOthers){
				rooms.push(room);
			} else {
				let offset = DIRECTIONS[directionToStickTo];
				while(collidesWithOthers){
					room.move(offset[0], offset[1]);
					collidesWithOthers = room.doCollideMultiple(rooms);
				}
				rooms.push(room);
			}
		}
	}
	for(let i = 0; i < rooms.length; i++){
		let room = generateRoom(rooms[i]);
		ship.mergeDescriptors(room);
	}
	let widthAndHeight = ship.getWidthAndHeight(true);
	let offsetX = normalizeToGrid((canvas.width / 1.2) - (widthAndHeight[0] / 2));
	let offsetY = normalizeToGrid((canvas.height / 2) - (widthAndHeight[1] / 2));
	addWalls(ship);
	ship.move(offsetX, offsetY, true);
	return ship;
}

function addWalls(ship){
	let surroundingTiles = ship.getSurroundingTilesOfDescriptors();
	let walls = new Tilemap();
	for(let i = 0; i < surroundingTiles.length; i++){
		let matrixStructure = ship.getMatrixStructure(surroundingTiles[i][0], surroundingTiles[i][1]);
		let structure = null;
		for(let key in LOADED_STRUCTURE_MATRIXES){
			if(LOADED_STRUCTURE_MATRIXES.hasOwnProperty(key)){
				let matches = LOADED_STRUCTURE_MATRIXES[key].matches(matrixStructure);
				if(matches){
					structure = key;
					break;
				}
			}
		}
		if(structure){
			walls.addTileDescriptor(surroundingTiles[i][0], surroundingTiles[i][1], structure);
		} else {
			//console.log('Could not find matrix structure for matrix: ' + matrixStructure);
		}
	}
	ship.mergeDescriptors(walls);
}

function generateRoom(box){
	let tilemap = new Tilemap();
	for(let x = box.x; x < box.width + box.x; x++){
		for(let y = box.y; y < box.height + box.y; y++){
			tilemap.addTileDescriptor(x * TILE_SIZE, y *  TILE_SIZE, "tile");
		}
	}
	return tilemap;
}

class Box {
	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	doCollide(otherBox){
		return this.x < otherBox.x + otherBox.width &&
			   this.x + this.width > otherBox.x &&
			   this.y < otherBox.y + otherBox.height &&
			   this.y + this.height > otherBox.y;
	}
	
	doCollideMultiple(otherBoxes){
		let collides = false;
		for(let i = 0; i < otherBoxes.length; i++){
			collides = this.doCollide(otherBoxes[i]);
			if(collides){
				break;
			}
		}
		return collides;
	}
	
	move(x, y){
		this.x += x;
		this.y += y;
	}
}

class Structure {
	constructor(name, tiles){
		this.name = name;
		this.tiles = tiles;
	}
	
	build(startX, startY){
		let tilemap = new Tilemap();
		for(let y = 0; y < this.tiles.length; y++){
			for(let x = 0; x < this.tiles[y].length; x++){
				let tile = this.tiles[y][x];
				if(tile !== "empty"){
					let structureTile = LOADED_STRUCTURE_TILES[tile];
					let newX = startX + (x * TILE_SIZE);
					let newY = startY + (y * TILE_SIZE);
					if(structureTile){
						tilemap.addTile(structureTile.build(newX, newY));
					} else {
						tilemap.addTile(new DecorTile(newX, newY, tile));
					}
				}
			}
		}
		return tilemap;
	}
}

class StructureTile{
	constructor(name, walkable, passesLight, clazz, tileImage, tileImages){
		this.name = name;
		this.walkable = walkable;
		this.passesLight = passesLight;
		this.clazz = clazz;
		this.tileImage = tileImage;
		this.tileImages = tileImages;
	}
	
	build(x, y){
		let image;
		if(this.tileImages){
			image = this.tileImages[rnd(0, this.tileImages.length)];
		} else {
			image = this.tileImage;
		}
		return new this.clazz(x, y, image, this.walkable, this.passesLight);
	}
}

class StructureMatrix{
	constructor(name, matrix){
		this.name = name;
		this.matrix = matrix;
	}
	
	matches(otherMatrix){
		let matches = true;
		for(let i = 0; i < this.matrix.length; i++){
			if(this.matrix[i] !== -1 && this.matrix[i] !== otherMatrix[i]){
				matches = false;
				break;
			}
		}
		return matches;
	}
}

class Ship extends Tilemap{
	constructor(){
		super();
		this.dockingTile = null;
	}
	
	build(){
		this.buildTiles();
		let possibleDockingTiles = this.getLeftmostTiles();
		let dockingTile = possibleDockingTiles.splice(rnd(0, possibleDockingTiles.length),1)[0];
		this.dockingTile = LOADED_STRUCTURE_TILES["door_vertical"].build(dockingTile.x, dockingTile.y);
		this.addTile(this.dockingTile);
	}
	
}

class PlayerTransporter extends Updatable{
	constructor(){
		super();
		this.arrived = false;
		this.startedDocking = false;
		this.otherShip = generateShip();
		this.otherShip.build();
		this.otherShip.showAllTiles();
		this.x = this.otherShip.dockingTile.x - (TILE_SIZE * 15) - (TILE_SIZE * 6);
		this.y = this.otherShip.dockingTile.y - (TILE_SIZE * 15);
		this.ship = LOADED_STRUCTURES["player_ship"].build(this.x, this.y);
		this.dockingTile = this.ship.getTile(this.x + TILE_SIZE * 6, this.y);
		player = new Player(this.x + 2 * TILE_SIZE, this.y, this.ship);
		this.ship.showAllTiles();
	}
	
	update(){
		let moveSpeed = 1;
		if(!this.arrived){
			let offsetX = 0;
			let offsetY = 0;
			if(this.dockingTile.x !== this.otherShip.dockingTile.x - (6 * TILE_SIZE)){
				offsetX = 1;
			}
			if(this.dockingTile.y !== this.otherShip.dockingTile.y){
				offsetY = 1;
			}
			this.ship.move(offsetX, offsetY);
			player.x += offsetX;
			player.y += offsetY;
			if(this.dockingTile.y === this.otherShip.dockingTile.y && this.dockingTile.x === this.otherShip.dockingTile.x - (6 * TILE_SIZE)) {
				this.arrived = true;
			}
		} else if(!this.startedDocking){
			this.ship.reassignKeys();
			this.startedDocking = true;
			for(let i = 1; i < 6; i++){
				new TimedEvent((FPS * (i + 1)) / 2, 
				function(params){
					let newTile = new Floor(params[1].x + TILE_SIZE * params[2], params[1].y);
					newTile.discovered = true;
					params[0].addTile(newTile);
				},
				[this.ship, this.dockingTile, i]);
			}
			new TimedEvent(FPS * 3, 
				function(param){
					param.ship.mergeMap(param.otherShip)
				}, 
				this
			);
		}
	}
}