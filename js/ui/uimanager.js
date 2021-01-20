const UI_HOVERABLE_LAYER = [];
const UI_CLICKABLE_LAYER = [];

const TOOLTIP_FONT = '20px spacefont';

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
        GameManager.instance.actionBar.selectedUiAbility = this;
    }

    unselect() {
        GameManager.instance.actionBar.selectedUiAbility = null;
    }

    destroy() {
        UI_CLICKABLE_LAYER.splice(UI_CLICKABLE_LAYER.indexOf(this), 1);
        super.destroy();
    }
}

class MouseInteractionWrapper {
    constructor(object, width, height, hoverable, clickable, z) {
        this.object = object;
        this.width = width;
        this.height = height;
        this.hoverable = hoverable;
        this.clickable = clickable;
        this.z = z;
        addToGameLayer(this);
    }

    isCoordinateIn(x, y) {
        return this.object.x <= x + camera.x && this.object.y <= y + camera.y && this.object.x + this.width >= x + camera.x && this.object.y + this.height >= y + camera.y;
    }

    select() {
        if (this.clickable) {
            this.object.select();
        }
    }

    unselect() {
        this.object.unselect();
    }

    hover() {
        if (this.hoverable) {
            this.object.hover();
        }
    }

    hoverLeave() {
        this.object.hoverLeave();
    }

    destroy() {
        GAME_LAYER.splice(GAME_LAYER.indexOf(this), 1);
    }

}