const ABILITIIES = {};

class Player extends Moveable {
    constructor(x, y, tilemap) {
        super(x, y, tilemap, "player", 10, 20);
        super.stepTrigger = new Trigger(this, "playerStep");
        this.playerLighting = new PlayerLighting(this);
        this.health = 100;
        this.isInBattle = false;
        this.selectedAction = null;
    }

    battleLogic() {
        this.canMove = true;
        this.lastStepFunction = function () {
            GameManager.battle.next();
        };
    }

    prepareMove(x, y) {
        if (this.isInBattle) {
            this.lastStepTrigger = true;
        }
        super.prepareMove(x, y);
    }

}

class Ability {
    constructor(type, aoe, targeted) {
        this.type = type;
        this.aoe = aoe;
        this.targeted = targeted;
        ABILITIIES[type] = this;
    }

    cast(caster, target) {
        console.log('Not implemented!', this, type);
    }
}

class AbilityPew extends Ability {
    constructor() {
        super("pew", false, true);
    }

    cast(caster, target) {
        target.damage(20);
    }
}