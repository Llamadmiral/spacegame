const TILEMAP = {};
const NEIGHBOUR_OFFSETS = [
	[0, TILE_SIZE],
	[TILE_SIZE, 0],
	[0, -TILE_SIZE],
	[-TILE_SIZE, 0]
];
const TILEMAP_ARRAY = [];

function generateRoom(width, height, offsetX, offsetY){
	let tilemap = new Tilemap();
	let passages = 3;
	let wallX = rnd(4 + offsetX, height - 4 + offsetX);
	let wallY = rnd(4 + offsetX, width - 4 + offsetY);
	for(let x = offsetX; x < width + offsetX; x++){
		for(let y = offsetY; y < height + offsetY; y++){
			let xIsWall = x === wallX;
			let yIsWall = y === wallY;
			if(xIsWall && yIsWall){
				tilemap.addTileDescriptor(x * TILE_SIZE, y * TILE_SIZE, "wall_cross");
			} else if(xIsWall){
				tilemap.addTileDescriptor(x * TILE_SIZE, y * TILE_SIZE, "wall_vertical");
			} else if(yIsWall){
				tilemap.addTileDescriptor(x * TILE_SIZE, y * TILE_SIZE, "wall_horizontal");
			} else {
				tilemap.addTileDescriptor(x * TILE_SIZE, y * TILE_SIZE, "tile");
			}
		}
	}
	let walls = [ 
		[1 + offsetX, wallX - 1, wallY, wallY, "door_horizontal"],
		[wallX + 1 + offsetX, width, wallY, wallY, "door_horizontal"],
		[wallX, wallX, 1 + offsetY, wallY - 1, "door_vertical"],
		[wallX, wallX, wallY + 1 + offsetY, height, "door_vertical"]
	];
	for(let i = 0; i < passages; i++){
		let wallSection = walls.splice(rnd(walls.length), 1)[0];
		tilemap.addTileDescriptor(rnd(wallSection[0], wallSection[1]) * TILE_SIZE, rnd(wallSection[2], wallSection[3]) * TILE_SIZE, wallSection[4]);
	}
	tilemap.buildTiles();
	return tilemap;
}

class Tilemap {
	constructor(){
		this.map = {};
		this.tileDescriptors = [];
		this.tileArray = [];
	}
	
	addTileDescriptor(x, y, structureTile){
		this.tileDescriptors.push(new TileDescriptor(x, y, structureTile));
	}
	
	buildTiles(){
		for(let i = 0; i < this.tileDescriptors.length;i++){
			let tileDescriptor = this.tileDescriptors[i];
			this.addTile(tileDescriptor.structureTile.build(tileDescriptor.x, tileDescriptor.y));
		}
	}
	
	addTile(tile){
		if(this.map[tile.x] === undefined){
			this.map[tile.x] = {};
		}
		if(this.map[tile.x][tile.y]){
			let oldTile = this.map[tile.x][tile.y];
			this.tileArray.splice(this.tileArray.indexOf(oldTile), 1);
		}
		this.map[tile.x][tile.y] = tile;
		this.tileArray.push(tile);
	}
	
	getNeighboursOfTile(tile){
		let neighbours = [];
		for(let i = 0; i < NEIGHBOUR_OFFSETS.length; i++){
			let neighbour = this.getTile(tile.x + NEIGHBOUR_OFFSETS[i][0], tile.y + NEIGHBOUR_OFFSETS[i][1]);
			if(neighbour){
				neighbours.push(neighbour);
			}
		}
		return neighbours;
	}
	
	getTile(x, y){
		let tile = undefined;
		if(this.map[x] !== undefined){
			tile = this.map[x][y];
		}
		return tile;
	}
	
	move(x, y){
		for(let i = 0; i < this.tileArray.length; i++){
			this.tileArray[i].x += x;
			this.tileArray[i].y += y;
		}
	}
	
	reassignKeys(){
		this.map = {};
		let tileArray = this.tileArray;
		this.tileArray = [];
		for(let i = 0; i < tileArray.length; i++){
			this.addTile(tileArray[i]);
		}
	}
	
	mergeMap(otherMap){
		let otherArray = otherMap.tileArray;
		for(let i = 0; i < otherArray.length; i++){
			this.addTile(otherArray[i]);
		}
	}
}

class TileDescriptor{
	constructor(x, y, structureTile){
		this.x = x;
		this.y = y;
		this.structureTile = LOADED_STRUCTURE_TILES[structureTile];
		if(!this.structureTile){
			console.log("No structure tile found with this name", structureTile);
		}
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