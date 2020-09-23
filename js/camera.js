class Camera extends Updatable {
    constructor(x, y) {
        super(0);
        this.x = x;
        this.y = y;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    update() {
        this.x = GameManager.cameraTarget.x - (this.width / 2);
        this.y = GameManager.cameraTarget.y - (this.height / 2);
    }


}