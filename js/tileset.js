class Tile extends Drawable{
	constructor(x, y, img, walkable, passesLight){
		super(x, y, img, 2);
		this.walkable = walkable;
		this.passesLight = passesLight;
		this.discovered = false;
		this.visible = false;
	}
	
	draw(){
		if(this.visible || this.discovered){
			super.draw();
		}
		if(this.discovered && !this.visible){
			context.fillStyle = 'black';
			context.globalAlpha = 0.5;
			context.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
			context.globalAlpha = 1;
		}
	}
	
	beforeStep(stepper){}
	
	onStep(stepper){}
	
	onLeave(stepper){}
}

class Door extends Tile{
	constructor(x, y, img){
		super(x, y, img, true, false);
		this.closedImage = img;
		if(this.closedImage === "door_closed_horizontal"){
			this.closingImage = "door_closing_horizontal";
			this.openingImage = "door_opening_horizontal";
			this.openImage = "door_open_horizontal";
		} else {
			this.closingImage = "door_closing_vertical";
			this.openingImage = "door_opening_vertical";
			this.openImage = "door_open_vertical";
		}
		this.blocking = true;
	}
	
	beforeStep(stepper){
		if(this.blocking){
			this.blocking = false;
			stepper.canMove = false;
			new TimedEvent(FPS, 
				function(params){
					params[0].canMove = true;
					params[1].switchImageTo(params[2]);
				},
				[stepper, this, this.openImage]
			);
			this.switchImageTo(this.openingImage);
		}
	}
	
	onStep(stepper){
		this.passesLight = true;
	}
	
	onLeave(stepper){
		this.blocking = true;
		this.switchImageTo(this.closingImage);
		new TimedEvent(FPS, 
			function(params){
				params[0].switchImageTo(params[1]);
				params[0].passesLight = false;
				player.playerLighting.recalculateTiles();
			}, 
			[this, this.closedImage]
		);
	}
}

class Wall extends Tile{
	constructor(x, y, img){
		super(x, y, img, false, false);
	}
}

class Floor extends Tile{
	constructor(x, y){
		super(x, y, "tile", true, true);
	}
}

class DecorTile extends Tile{
	constructor(x, y, img){
		super(x, y, img, false, false);
		this.visible = true;
	}
}

class ShipTileRust extends Tile{
	constructor(x, y){
		super(x, y, "ship_tile_rust", true, true);
	}
}