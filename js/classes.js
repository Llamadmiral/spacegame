class Updatable{
	constructor(z = 0){
		this.z = z;
		addToUpdatable(this);
	}
	
	update(){}
	
	draw(){}
	
	destroy(){
		UPDATABLE_OBJECTS.splice(UPDATABLE_OBJECTS.indexOf(this), 1);
	}
	
	toDraw(){
		return false;
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
		this.descriptor = descriptor;
		this.currentFrame = 0;
		this.counter = 0;
		this.inAnimation = true;
	}
	
	draw(){
		if(this.descriptor.animated && this.inAnimation){
			this.animate();
		}
		context.drawImage(this.descriptor.img, this.currentFrame * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, this.x - camera.x, this.y - camera.y, TILE_SIZE, TILE_SIZE);
	}
	
	switchImageTo(imageName){
		this.descriptor = LOADED_IMAGES[imageName];
		this.currentFrame = 0;
		this.counter = 0;
	}
	
	toDraw(){
		return this.x >= camera.x && this.x < camera.x + camera.width && this.y >= camera.y && this.y < camera.y + camera.height;
	}
	
	animate(direction = 1){
		this.counter = (this.counter + direction) % this.descriptor.animationLength;
		this.currentFrame = Math.floor(this.counter / this.descriptor.framerate);
	}
}

class ImageDescriptor{
	constructor(name, img, animated, numberOfFrames, animationLength){
		this.name = name;
		this.img = img;
		this.animated = animated;
		this.numberOfFrames = numberOfFrames;
		this.animationLength = animationLength;
		this.framerate = this.animationLength / this.numberOfFrames;
	}
}

class AnimationGroup extends Updatable{
	constructor(tiles, inAnimation = false, loop = false, direction = 1){
		super();
		this.tiles = tiles;
		this.inAnimation = inAnimation;
		this.loop = loop;
		this.direction = direction;
	}
	
	switchDirection(){
		this.direction *= -1;
	}
	
	stopAnimation(){
		this.changeAnimation(false);
	}
	
	startAnimation(){
		this.changeAnimation(true);
	}
	
	changeAnimation(animate){
		this.inAnimation = animate;
	}
	
	update(){
			if(this.inAnimation){
				let direction = this.direction;
				this.tiles.forEach(function(tile){
				tile.animate(direction);
			});
		}
	}
}

class DockingDoorAnimation extends AnimationGroup{
	constructor(tiles){
		super(tiles);
		this.initTiles(this.tiles);
	}
	
	initTiles(){
		this.tiles.forEach(function(tile){
			tile.inAnimation = false;
			tile.currentFrame = tile.descriptor.numberOfFrames - 1;
			tile.counter = tile.descriptor.animationLength;
		});
	}
	
	open(){
		this.switchDirection();
		this.startAnimation();
		new TimedEvent(FPS * 2 - 1, function(param){param.stopAnimation()}, this);
	}
	
	close(){
		this.switchDirection();
		this.startAnimation();
		new TimedEvent(FPS * 2 - 1, function(param){
			param.stopAnimation();
			param.initTiles();
		}, this);
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
		this.stepCooldown = 0;
	}
	
	update(){
		this.stepCooldown = this.stepCooldown === 0 ? 0 : this.stepCooldown - 1;
		super.update();
		if(this.stepCooldown === 0){
			this.move();
			this.stepCooldown = 10;
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
