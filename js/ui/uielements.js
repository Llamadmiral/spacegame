class UiAbility extends UiClickable {
    constructor(x, y, z, ability) {
        super(x, y, z, TILE_SIZE, TILE_SIZE);
        this.descriptor = LOADED_IMAGES[ability.type];
        this.color = 'black';
        this.selected = false;
        this.ability = ability;
        this.tooltip = new UIToolTip(this.x, this.y - (TILE_SIZE * 2), 10, TILE_SIZE, this.ability.getDescription());
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
        this.tooltip.showTooltip = true;
    }

    hoverLeave() {
        if (!this.selected) {
            this.color = 'black';
        }
        this.tooltip.showTooltip = false;
    }

    select() {
        super.select();
        if (this.selected) {
            this.unselect();
        } else {
            this.selected = true;
            this.color = 'blue';
        }
    }

    unselect() {
        super.unselect();
        this.selected = false;
        this.color = 'black';
    }
}

class UIToolTip extends UiElement {
    constructor(x, y, z, height, text) {
        super(x, y, z);
        this.height = 20;
        this.text = text;
        context.font = TOOLTIP_FONT;
        //context.fillText("0", -10, -10);
        this.measurement = context.measureText(this.text).width;
        this.showTooltip = false;
    }

    draw() {
        if (this.showTooltip) {
            let width = this.measurement;//context.measureText(this.text).width;
            let widthPadding = width / 20;
            let heightPadding = this.height / 10;
            context.fillStyle = 'rgb(44 232 226 / 0.50)';
            context.fillRect(this.x - (width / 2), this.y, width + widthPadding, this.height + heightPadding);
            context.font = TOOLTIP_FONT;
            context.fillText(this.text, this.x - (width / 2) + (widthPadding / 2), this.y + this.height - heightPadding);
        }
    }

    changeText(newText) {
        this.text = newText;
        this.measurement = context.measureText(this.text).width;
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
