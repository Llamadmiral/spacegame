class Door extends Tile {
    constructor(x, y, name, img) {
        super(x, y, name, img, true, false);
        this.blocking = true;
        this.triggerDoorEnter = new Trigger(this, "onDoorEnter");
        this.triggerDoorLeave = new Trigger(this, "onDoorLeave");
        this.openLength = this.descriptor.animationLength;
    }

    beforeStep(stepper) {
        if (this.blocking) {
            this.triggerDoorEnter.trigger();
            this.blocking = false;
            stepper.canMove = false;
            new TimedEvent(this.openLength,
                function (params) {
                    params[0].canMove = true;
                },
                [stepper, this]
            );
        }
    }

    onStep(stepper) {
        this.passesLight = true;
    }

    onLeave(stepper) {
        this.blocking = true;
        this.triggerDoorLeave.trigger();
        new TimedEvent(this.openLength,
            function (params) {
                params.passesLight = false;
                GameManager.instance.player.playerLighting.recalculateTiles();
            },
            this
        );
    }
}

class Wall extends Tile {
    constructor(x, y, img) {
        super(x, y, img, false, false);
    }
}

class Floor extends Tile {
    constructor(x, y, img = "tile") {
        super(x, y, img, true, true);
    }
}

class DecorTile extends Tile {
    constructor(x, y, img) {
        super(x, y, img, img, false, false);
        this.visible = true;
    }
}

class PlayerShipNavigation extends Tile {
    constructor(x, y, img) {
        super(x, y, img, img, false, false);
        this.visible = true;
        this.mouseInteractionWrapper = new MouseInteractionWrapper(this, TILE_SIZE, TILE_SIZE, true, true, 11);
        this.tooltip = new UIToolTip(0, 0, 10, TILE_SIZE, "Click me!");
    }

    hover() {
        this.tooltip.x = this.x - camera.x;
        this.tooltip.y = this.y - (TILE_SIZE * 2) - camera.y;
        this.tooltip.showTooltip = true;
    }

    hoverLeave() {
        this.tooltip.showTooltip = false;
    }

    select() {
        if (GameManager.instance.playerTransporter.status === "inSpace") {
            let ship = generateShip();
            ship.move(GameManager.instance.playerTransporter.x + (TILE_SIZE), GameManager.instance.playerTransporter.y - (TILE_SIZE * 15), true);
            ship.build();
            GameManager.instance.playerTransporter.startArrivingAtDestination(ship);
        }
    }

    unselect() {
    }
}

class PlayerShipDockSwitch extends Tile {
    constructor(x, y, img) {
        super(x, y, img, img, false, false);
        this.visible = true;
        this.mouseInteractionWrapper = new MouseInteractionWrapper(this, TILE_SIZE, TILE_SIZE, true, true, 11);
        this.tooltip = new UIToolTip(0, 0, 10, TILE_SIZE, "Not available at the moment");
    }

    hover() {
        this.tooltip.x = this.x - camera.x;
        this.tooltip.y = this.y - (TILE_SIZE * 2) - camera.y;
        let status = GameManager.instance.playerTransporter.status;
        if (status === 'docked') {
            this.tooltip.changeText('Retract docking tunnel');
        } else if (status === 'parked') {
            this.tooltip.changeText('Extend docking tunnel');
        } else {
            this.tooltip.changeText("Not available at the moment");
        }
        this.tooltip.showTooltip = true;
    }

    hoverLeave() {
        this.tooltip.showTooltip = false;
    }

    select() {
        if (GameManager.instance.playerTransporter.status === 'docked') {
            GameManager.instance.playerTransporter.retractDockingTunnel();
            this.tooltip.changeText("Not available at the moment");
        } else if (GameManager.instance.playerTransporter.status === 'parked') {
            GameManager.instance.playerTransporter.extendDockingTunnel();
            this.tooltip.changeText("Not available at the moment");
        }
    }

    unselect() {

    }

}