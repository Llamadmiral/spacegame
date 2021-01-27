const ABILITIIES = {};

class Player extends Moveable {
    constructor(x, y, tilemap) {
        super(x, y, tilemap, "player", 10, 20);
        super.stepTrigger = new Trigger(this, "playerStep");
        this.playerLighting = new PlayerLighting(this);
        this.health = 100;
        this.maxHealth = 100;
        this.isInBattle = false;
    }

    battleLogic() {
        this.canMove = true;
        this.lastStepFunction = function () {
            GameManager.instance.battle.next();
        };
    }

    prepareMove(x, y) {
        if (this.isInBattle) {
            this.lastStepTrigger = true;
        }
        super.prepareMove(x, y);
    }

    leaveBattle() {
        this.canMove = true;
        this.lastStepFunction = null;
        this.lastStepTrigger = false;
        this.isInBattle = false;
    }

}

class Ability {
    constructor(type, aoe, targeted, damage) {
        this.type = type;
        this.aoe = aoe;
        this.targeted = targeted;
        this.damage = damage;
        ABILITIIES[type] = this;
    }

    cast(caster, target) {
        console.log('Not implemented!', this, type);
    }

    getDescription() {
        return null;
    }
}

class AbilityPew extends Ability {
    constructor() {
        super("pew", false, true, 10);
    }

    cast(caster, target) {
        console.log('Cast spell ' + this.type + ' on ' + target.constructor.name);
        target.damage(this.damage);
    }

    getDescription() {
        return 'Deals ' + this.damage + ' damage to a single target';
    }
}