class Camera extends Updatable{
	constructor(x, y){
		super(0);
		this.x = x;
		this.y = y;
		this.width = canvas.width;
		this.height = canvas.height;
		this.centerX = 0;
		this.centerY = 0;
	}
	
	update(){
		this.x = player.x - (this.width / 2);
		this.y = player.y - (this.height / 2);
	}
	
	
}