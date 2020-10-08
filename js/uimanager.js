const UI_HOVERABLE_LAYER = [];
const UI_CLICKABLE_LAYER = [];

function searchForUI(x, y, array) {
    let obj = null;
    for (let i = 0; i < array.length; i++) {
        let ui = array[i];
        if (typeof ui.isCoordinateIn === 'function' && ui.isCoordinateIn(x, y)) {
            obj = ui;
            break;
        }
    }
    return obj;
}

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

class UiOpenable extends UiElement {
    constructor(x, y, z, topLeft, topRight, bottomLeft, bottomRight, vertical) {
        super(x, y, z);
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
        this.verticalDirection = 0;
        this.steps = 0;
        this.targetWidth = 0;
        this.width = TILE_SIZE;
        this.vertical = vertical;
    }

    draw() {
        let diff = Math.ceil(this.width / 2);
        context.fillStyle = 'rgb(44 232 226 / 0.50)';
        context.fillRect(this.x - (diff) + TILE_SIZE, this.y, this.width - TILE_SIZE, 2 * TILE_SIZE);
        context.drawImage(this.topLeft.img, this.x - (diff), this.y);
        context.drawImage(this.topRight.img, this.x + (diff), this.y);
        context.drawImage(this.bottomLeft.img, this.x - (diff), this.y + TILE_SIZE);
        context.drawImage(this.bottomRight.img, this.x + (diff), this.y + TILE_SIZE);
    }

    update() {
        if (this.steps !== 0) {
            this.width += this.verticalDirection;
            this.steps--;
            if (this.steps === 0) {
                this.width = this.targetWidth;
            }
        }
    }

    open(newSize) {
        this.verticalDirection = (newSize - this.width) / FPS;
        this.steps = Math.ceil((newSize - this.width) / this.verticalDirection);
        this.targetWidth = newSize;
    }

    close(newSize = TILE_SIZE) {
        this.verticalDirection = -(this.width - newSize) / FPS;
        this.steps = Math.abs(Math.ceil((this.width - newSize) / this.verticalDirection));
        this.targetWidth = newSize;
    }

}

class UiCombatOrderIndicator extends UiOpenable {
    constructor(z) {
        super(normalizeToGrid(canvas.width / 2), 0, z,
            LOADED_IMAGES["hologram_border_pillar"],
            LOADED_IMAGES["hologram_border_pillar"],
            LOADED_IMAGES["hologram_border_left_mirrored"],
            LOADED_IMAGES["hologram_border_left"]
        );
        this.battle = null;
    }

    draw() {
        super.draw();
        let middle = normalizeToGrid(canvas.width / 2);
        let diff = Math.ceil(this.width / 2);
        context.fillStyle = 'rgb(44 232 226 / 0.50)';
        context.fillRect(middle - (diff) + TILE_SIZE, 0, this.width - TILE_SIZE, 2 * TILE_SIZE);
        if (this.battle) {
            let fullLength = this.battle.participants.length * TILE_SIZE;
            for (let i = 0; i < this.battle.participants.length; i++) {
                let participant = this.battle.participants[i].participant;
                let img = participant.descriptor.img;
                let startX = middle + i * TILE_SIZE + (HALF_TILE) - (fullLength / 2);
                context.drawImage(img, startX, HALF_TILE);
            }
        }
    }

    init(battle) {
        this.battle = battle;
        let newSize = (1 + battle.participants.length) * TILE_SIZE;
        this.open(newSize);
    }
}

class UIActionBar extends UiOpenable {
    constructor(z) {
        super(normalizeToGrid(canvas.width / 2), canvas.height - (2 * TILE_SIZE), z,
            LOADED_IMAGES["hologram_border_right"],
            LOADED_IMAGES["hologram_border_right_mirrored"],
            LOADED_IMAGES["hologram_border_pillar"],
            LOADED_IMAGES["hologram_border_pillar"]
        );
        this.actions = [];
        this.numberOfBars = 9;
        this.width = (this.numberOfBars + (this.numberOfBars - 2)) * TILE_SIZE;
    }

    addAction(actionType) {
        let action = new UiAction(this.x - (this.width - (4 * TILE_SIZE)) / 2, canvas.height - 2 * (TILE_SIZE) + HALF_TILE, 110, actionType);
        this.actions.push(action);
    }

    press(number) {
        if (this.actions[number - 1]) {
            this.actions[number - 1].select(number);
        }
    }
}

class UiHoverable extends UiElement {
    constructor(x, y, z, width, height) {
        super(x, y, z, width, height);
        this.width = width;
        this.height = height;
        UI_HOVERABLE_LAYER.push(this);
    }

    isCoordinateIn(x, y) {
        return this.x <= x && this.y <= y && this.x + this.width >= x && this.y + this.height >= y;
    }

    hover() {
    };

    hoverLeave() {
    };

    destroy() {
        UI_HOVERABLE_LAYER.splice(UI_HOVERABLE_LAYER.indexOf(this), 1);
        super.destroy();
    }

}

class UiClickable extends UiHoverable {
    constructor(x, y, z, width, height) {
        super(x, y, z, width, height);
        UI_CLICKABLE_LAYER.push(this);
    }

    select() {
    }

    unselect() {
    }

    destroy() {
        UI_CLICKABLE_LAYER.splice(UI_CLICKABLE_LAYER.indexOf(this), 1);
        super.destroy();
    }
}

class UiAction extends UiClickable {
    constructor(x, y, z, img) {
        super(x, y, z, TILE_SIZE, TILE_SIZE);
        this.descriptor = LOADED_IMAGES[img];
        this.color = 'black';
        this.selected = false;
    }

    draw() {
        context.beginPath();
        context.strokeStyle = this.color;
        context.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
        context.stroke();
        context.drawImage(this.descriptor.img, this.x, this.y);
    }

    hover() {
        if (!this.selected) {
            this.color = 'red';
        }
    }

    hoverLeave() {
        if (!this.selected) {
            this.color = 'black';
        }
    }

    select() {
        if (this.selected) {
            this.selected = false;
            this.color = "black";
        } else {
            this.selected = true;
            this.color = 'blue';
        }
    }

    unselect() {
        this.selected = false;
        this.color = 'black';
    }
}