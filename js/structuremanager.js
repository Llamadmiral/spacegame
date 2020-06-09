const TILEMAP = {};
const NEIGHBOUR_OFFSETS = [
	[0, TILE_SIZE],
	[TILE_SIZE, 0],
	[0, -TILE_SIZE],
	[-TILE_SIZE, 0]
];
const TILEMAP_ARRAY = [];

function generateShip(){
	let shipHeight = rnd(7, 12);
	let shipWidth = Math.floor(shipHeight *  2);
	let ship = new Ship();
	
	let shipCenterX = (normalizeToGrid(canvas.width / 2) / TILE_SIZE);
	let shipCenterY = (normalizeToGrid(canvas.height / 2) / TILE_SIZE);
	
	let shipOffsetX = shipCenterX - Math.floor(shipWidth / 2);
	let shipOffsetY = shipCenterY - Math.floor(shipHeight / 2);
	
	let mainCorridor = generateRoom(shipWidth, shipHeight, shipOffsetX, shipOffsetY);
	
	ship.mergeDescriptors(mainCorridor);
	
	let numberOfRooms = 4;
	let roomOffsets = [
		[-1, -1, 0, 0], 
		[1, -1, -1, 0], 
		[1, 1, -1, -1],
		[-1, 1, 0, -1]
	];
	for(let i = 0; i < numberOfRooms; i++){
		let offset = roomOffsets.splice(rnd(0, roomOffsets.length), 1)[0];
		let roomWidth = rnd(5, 10);
		let roomHeight = rnd(5, 7);
		let roomCenterX = shipCenterX + (Math.floor(shipWidth / 2) * offset[0]);
		let roomCenterY = shipCenterY + (Math.floor(shipHeight / 2) * offset[1]);
		let room = generateRoom(roomWidth, roomHeight, roomCenterX + ((roomWidth * offset[2])) + offset[0], roomCenterY + ((roomHeight * offset[3])) + offset[1]);
		ship.mergeDescriptors(room);
	}
	addWalls(ship);
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
			console.log('Could not find matrix structure for matrix: ' + matrixStructure);
		}
	}
	ship.mergeDescriptors(walls);
}

function generateRoom(width, height, offsetX, offsetY, tileOverride = "tile"){
	let tilemap = new Tilemap();
	let passages = 3;
	for(let x = offsetX; x < width + offsetX; x++){
		for(let y = offsetY; y < height + offsetY; y++){
			tilemap.addTileDescriptor(x * TILE_SIZE, y *  TILE_SIZE, "tile");
		}
	}
	return tilemap;
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
	constructor(x, y){
		super();
		this.x = x;
		this.y = y;
		this.ship = LOADED_STRUCTURES["player_ship"].build(this.x, this.y);
		this.ship.showAllTiles();
		this.arrived = false;
		this.startedDocking = false;
		this.dockingTile = this.ship.getTile(this.x + TILE_SIZE * 6, 0);
		this.otherShip = generateShip();
		this.otherShip.build();
		this.otherShip.showAllTiles();
		player = new Player(this.x + 2 * TILE_SIZE, this.y, this.ship);
	}
	
	update(){
		let moveSpeed = TILE_SIZE;
		if(!this.arrived){
			if(this.dockingTile.y !== this.otherShip.dockingTile.y){
				this.y += moveSpeed;
				player.y += moveSpeed;
				this.ship.move(0, moveSpeed);
			}
			if(this.dockingTile.x !== this.otherShip.dockingTile.x - (6 * TILE_SIZE)){
				this.x += moveSpeed;
				player.x += moveSpeed;
				this.ship.move(moveSpeed, 0);
			}
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