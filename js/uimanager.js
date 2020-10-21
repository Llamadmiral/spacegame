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
        if (this.battle && this.battle.started) {
            let fullLength = this.battle.participants.length * (TILE_SIZE + QUARTER_TILE);
            for (let i = 0; i < this.battle.participants.length; i++) {
                let participant = this.battle.participants[i].participant;
                let maxHealthRatio = (participant.health / participant.maxHealth);
                let img = participant.descriptor.img;
                let startX = middle + i * (TILE_SIZE + QUARTER_TILE) + (HALF_TILE) - (fullLength / 2);
                context.drawImage(img, startX, HALF_TILE);
                context.fillStyle = 'red';
                context.fillRect(startX, HALF_TILE + TILE_SIZE, TILE_SIZE * maxHealthRatio, HALF_TILE);
            }
        }
    }

    init(battle) {
        this.battle = battle;
        let newSize = (1 + battle.participants.length) * (TILE_SIZE + QUARTER_TILE);
        this.open(newSize);
    }
}

class UIAbilityBar extends UiOpenable {
    constructor(z) {
        super(normalizeToGrid(canvas.width / 2), canvas.height - (2 * TILE_SIZE), z,
            LOADED_IMAGES["hologram_border_right"],
            LOADED_IMAGES["hologram_border_right_mirrored"],
            LOADED_IMAGES["hologram_border_pillar"],
            LOADED_IMAGES["hologram_border_pillar"]
        );
        this.abilities = [];
        this.numberOfSlots = 9;
        this.width = (this.numberOfSlots + (this.numberOfSlots - 2)) * TILE_SIZE;
        this.selectedUiAbility = null;
    }

    addAbility(abilityType) {
        let action = new UiAbility(this.x - (this.width - (4 * TILE_SIZE)) / 2, canvas.height - 2 * (TILE_SIZE) + HALF_TILE, 110, ABILITIIES[abilityType]);
        this.abilities.push(action);
    }

    press(number) {
        let abiNumber = number - 1;
        if (this.selectedUiAbility === null || this.selectedUiAbility !== this.abilities[abiNumber]) {
            if (this.abilities[abiNumber]) {
                this.abilities[abiNumber].select();
                this.selectedUiAbility = this.abilities[abiNumber];
            }
        } else {
            this.abilities[abiNumber].unselect();
            this.selectedUiAbility = null;
        }
    }

    deselectAll() {
        if (this.selectedUiAbility !== null) {
            this.selectedUiAbility.unselect();
            this.selectedUiAbility = null;
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

class UiAbility extends UiClickable {
    constructor(x, y, z, ability) {
        super(x, y, z, TILE_SIZE, TILE_SIZE);
        this.descriptor = LOADED_IMAGES[ability.type];
        this.color = 'black';
        this.selected = false;
        this.ability = ability;
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
        GAME_LAYER.splice(UPDATABLE_OBJECTS.indexOf(this), 1);
    }

}