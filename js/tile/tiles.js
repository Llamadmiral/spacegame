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
        this.tooltip = new UIToolTip(0, 0, 10, TILE_SIZE, "Find new derelict ship");
        this.statusObserver = new Observer(GameManager.instance.playerTransporter, this, 'playerTransporterStatusChange', this.updateTooltipText);
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
        if (!(GameManager.instance.player.x === this.x && GameManager.instance.player.y === this.y + TILE_SIZE)) {
            GameManager.instance.player.prepareMove(this.x, this.y + TILE_SIZE);
            GameManager.instance.player.lastStepTrigger = true;
            let target = this;
            let func = this.select;
            GameManager.instance.player.lastStepFunction = function () {
                func.call(target);
                GameManager.instance.player.lastStepTrigger = false;
                GameManager.instance.player.lastStepFunction = null;
            };
        } else {
            let status = GameManager.instance.playerTransporter.status;
            if (status === PlayerTransporter.STATUS_IN_SPACE) {
                let ship = generateShip();
                ship.move(GameManager.instance.playerTransporter.x + (TILE_SIZE), GameManager.instance.playerTransporter.y - (TILE_SIZE * 15), true);
                ship.build();
                GameManager.instance.playerTransporter.startArrivingAtDestination(ship);
            } else if (status === PlayerTransporter.STATUS_PARKED) {
                console.log('Here will come the code that will send the ship back to space');
            }
        }
    }

    unselect() {
    }

    updateTooltipText() {
        let status = GameManager.instance.playerTransporter.status;
        if (status === PlayerTransporter.STATUS_ARRIVING_AT_DESTINATION) {
            this.tooltip.changeText("Arriving at derelict ship...");
        } else if (status === PlayerTransporter.STATUS_PARKED) {
            this.tooltip.changeText("Leave derelict ship");
        } else if (status === PlayerTransporter.STATUS_IN_SPACE) {
            this.tooltip.changeText("Find new derelict ship");
        } else {
            this.tooltip.changeText("Navigation is unavailable at the moment");
        }
    }
}

class PlayerShipDockSwitch extends Tile {
    constructor(x, y, img) {
        super(x, y, img, img, false, false);
        this.visible = true;
        this.mouseInteractionWrapper = new MouseInteractionWrapper(this, TILE_SIZE, TILE_SIZE, true, true, 11);
        this.tooltip = new UIToolTip(0, 0, 10, TILE_SIZE, "Not available at the moment");
        this.statusObserver = new Observer(GameManager.instance.playerTransporter, this, "playerTransporterStatusChange", this.updateTooltipText);
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
        if (!(GameManager.instance.player.x === this.x && GameManager.instance.player.y === this.y + TILE_SIZE)) {
            GameManager.instance.player.prepareMove(this.x, this.y + TILE_SIZE);
            GameManager.instance.player.lastStepTrigger = true;
            let target = this;
            let func = this.select;
            GameManager.instance.player.lastStepFunction = function () {
                func.call(target);
                GameManager.instance.player.lastStepTrigger = false;
                GameManager.instance.player.lastStepFunction = null;
            };
        } else {
            if (GameManager.instance.playerTransporter.status === PlayerTransporter.STATUS_DOCKED) {
                GameManager.instance.playerTransporter.retractDockingTunnel();
                this.tooltip.changeText("Not available at the moment");
            } else if (GameManager.instance.playerTransporter.status === PlayerTransporter.STATUS_PARKED) {
                GameManager.instance.playerTransporter.extendDockingTunnel();
                this.tooltip.changeText("Not available at the moment");
            }
        }
    }

    unselect() {

    }

    updateTooltipText() {
        let status = GameManager.instance.playerTransporter.status;
        if (status === PlayerTransporter.STATUS_DOCKED) {
            this.tooltip.changeText('Retract docking tunnel');
        } else if (status === PlayerTransporter.STATUS_PARKED) {
            this.tooltip.changeText('Extend docking tunnel');
        } else {
            this.tooltip.changeText("Docking unavailable");
        }
    }

}