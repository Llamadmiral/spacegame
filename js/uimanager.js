class UiElement extends Updatable {
    constructor(x, y, z) {
        super(z);
        this.x = x;
        this.y = y;
    }

    toDraw() {
        return true;
    }
}

class UiCombatOrderIndicator extends UiElement {
    constructor(x, y, z) {
        super(x, y, z);
        this.borderRight = LOADED_IMAGES["hologram_border_left"];
        this.borderRightPillar = LOADED_IMAGES["hologram_border_pillar"];
        this.borderLeftPillar = LOADED_IMAGES["hologram_border_pillar"];
        this.borderLeft = LOADED_IMAGES["hologram_border_left_mirrored"];
        this.width = TILE_SIZE;
        this.direction = 0;
        this.steps = 0;
        this.targetWidth = 0;
    }

    draw() {
        let middle = normalizeToGrid(canvas.width / 2);
        let diff = Math.ceil(this.width / 2);
        context.fillStyle = 'rgb(44 232 226 / 0.50)';
        context.fillRect(middle - (diff) + TILE_SIZE, 0, this.width - TILE_SIZE, 2 * TILE_SIZE);
        context.drawImage(this.borderLeft.img, middle - (diff), TILE_SIZE);
        context.drawImage(this.borderLeftPillar.img, middle - (diff), 0);
        context.drawImage(this.borderRightPillar.img, middle + (diff), 0);
        context.drawImage(this.borderRight.img, middle + (diff), TILE_SIZE);
    }

    update() {
        if (this.steps !== 0) {
            this.width += this.direction;
            this.steps--;
            if (this.steps === 0) {
                this.width = this.targetWidth;
            }
        }
    }

    open(newSize) {
        this.direction = (newSize - this.width) / FPS;
        this.steps = Math.ceil((newSize - this.width) / this.direction);
        this.targetWidth = newSize;
    }

    close(newSize = TILE_SIZE) {
        this.direction = -(this.width - newSize) / FPS;
        this.steps = Math.abs(Math.ceil((this.width - newSize) / this.direction));
        this.targetWidth = newSize;
    }
}