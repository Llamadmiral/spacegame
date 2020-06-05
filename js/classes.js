class Updatable{
	constructor(z){
		if(z === undefined){
			z = 0;
		}
		this.z = z;
		addToUpdatable(this);
	}
	
	update(){}
	
	draw(){}
	
	destroy(){
		UPDATABLE_OBJECTS.splice(UPDATABLE_OBJECTS.indexOf(this), 1);
	}
	
}

class Drawable extends Updatable{
	constructor(x, y, imageName, z){
		super(z);
		this.x = x;
		this.y = y;
		let descriptor = LOADED_IMAGES[imageName];
		if(!descriptor){
			console.log("Image is without Image descriptor!", imageName);
		}
		this.imageObject = new ImageObject(descriptor);
	}
	
	draw(){
		this.imageObject.animate();
		context.drawImage(this.imageObject.descriptor.img, this.imageObject.currentFrame * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, this.x, this.y, TILE_SIZE, TILE_SIZE);
	}
	
	switchImageTo(imageName){
		this.imageObject = new ImageObject(LOADED_IMAGES[imageName]);
	}
}

class ImageDescriptor{
	constructor(name, img, animated, numberOfFrames){
		this.name = name;
		this.img = img;
		this.animated = animated;
		this.numberOfFrames = numberOfFrames;
	}
}

class ImageObject{
	constructor(descriptor){
		this.descriptor = descriptor;
		this.currentFrame = 0;
		this.counter = 0;
		this.framerate = FPS / this.descriptor.numberOfFrames;
	}
	
	animate(){
		if(this.descriptor.animated){
			this.counter = (this.counter + 1) % FPS;
			this.currentFrame = Math.floor(this.counter / this.framerate);
		}
	}
}

class Moveable extends Drawable{
	constructor(x, y, tilemap, src, z){
		super(x, y, src, z);
		this.movement = new Movement();
		this.tilemap = tilemap;
		this.currentTile = this.tilemap.getTile(x, y);
		this.pathEffect = new PathEffect(this);
		this.canMove = true;
	}
	
	update(){
		super.update();
		if(currentFrame % 10 === 0){
			this.move();
		}
	}
	
	prepareMove(x, y){
		let diffX = x - this.x;
		let diffY = y - this.y;
		if(diffX !== 0 || diffY !== 0){
			let endTile = this.tilemap.getTile(x, y);
			if(this.tilemap.tileArray.indexOf(endTile) !== -1){
				let routeCreator = new RouteCreator(this.tilemap.tileArray, this.currentTile, endTile);
				let route = routeCreator.createRoute();
				this.movement.path = flattenRoute(route, this.tilemap);
			} else {
				console.log('Unreachable tile!', endTile);
			}
		}
	}
	
	move(){
		if(this.canMove){
			let nextStep = this.movement.getNextStep();
			if(nextStep){
				let newX = nextStep[0];
				let newY = nextStep[1];
				let tile = this.tilemap.getTile(newX, newY);
				if(tile.walkable){
					tile.beforeStep(this);
					if(this.canMove){
						this.currentTile.onLeave(this);
						tile.onStep(this);
						this.currentTile = tile;
						this.x = newX;
						this.y = newY;
						this.movement.step();
					}
				}
			}
		}
	}
}

class Player extends Moveable{
	constructor(x, y, tilemap){
		super(x, y, tilemap, "player", 10);
		this.playerLighting = new PlayerLighting(this);
	}
	
	update(){
		super.update();
	}
}

class Movement{
	constructor(){
		this.path = [];
	}
	
	getNextStep(){
		let nextStep = false;
		if(this.path.length > 0){
			nextStep = this.path[0];
		}
		return nextStep;
	}
	
	step(){
		this.path.splice(0, 1);
	}
}

class TimedEvent extends Updatable{
	constructor(frames, callback, params){
		super();
		this.frames = frames;
		this.currentFrame = 0;
		this.callback = callback;
		this.params = params;
	}
	
	update(){
		this.currentFrame++;
		if(this.currentFrame === this.frames){
			this.callback(this.params);
			this.destroy();
		}
	}
}
