class MonsterManager {
    constructor(numberOfMonsters, tileset) {
        this.numberOfMonsters = numberOfMonsters;
        this.tileset = tileset;
        this.monsters = [];
    }

    spawnMonsters() {
        let takenTiles = [];
        for (let i = 0; i < this.numberOfMonsters; i++) {
            let tile = this.tileset.getRandomTile();
            while (!tile.walkable && takenTiles.indexOf(tile) === -1) {
                tile = this.tileset.getRandomTile();
                console.log("Trying to get a new tile...");
            }
            takenTiles.push(tile);
            let monster = new Blob(this, tile);
            this.monsters.push(monster);
        }
    }

    initiateBattle(originalParticipant, playerPresent) {
        if (playerPresent) {
            GameManager.instance.player.path = [];
            GameManager.instance.player.canMove = false;
            GameManager.instance.player.isInBattle = true;
        }
        let participants = this.gatherParticipants(originalParticipant);
        for (let i = 0; i < participants.length; i++) {
            let participant = participants[i];
            participant.isInBattle = true;
            GameManager.instance.battle.addParticipant(new BattleParticipant(participant, participant.getBattleLogic(), 10));
        }
        if (playerPresent && !GameManager.instance.battle.hasPlayer()) {
            let participant = new BattleParticipant(GameManager.instance.player, GameManager.instance.player.battleLogic, 5);
            participant.isPlayer = true;
            participant.isInBattle = true;
            GameManager.instance.battle.addParticipant(participant);
        }
        GameManager.instance.battle.start();
    }

    gatherParticipants(originalParticipant) {
        let participants = [originalParticipant];
        let originalSize = 0;
        while (originalSize !== participants.length) {
            originalSize = participants.length;
            for (let i = 0; i < participants.length; i++) {
                let participant = participants[i];
                for (let j = 0; j < this.monsters.length; j++) {
                    let monster = this.monsters[j];
                    if (participant !== monster && participants.indexOf(monster) === -1) {
                        let canSee = canASeeB(participant, monster, 6);
                        if (canSee) {
                            participants.push(monster);
                        }
                    }
                }
            }
        }
        return participants;
    }

    getMonster(x, y) {
        let monster = null;
        for (let i = 0; i < this.monsters.length; i++) {
            let possibleMonster = this.monsters[i];
            if (possibleMonster.x === x && possibleMonster.y === y) {
                monster = possibleMonster;
                break;
            }
        }
        return monster;
    }

    removeMonster(monster) {
        GameManager.instance.battle.removeParticipant(monster);
        this.monsters.splice(this.monsters.indexOf(monster), 1);
    }

    destroy() {
        this.monsters.forEach(function (monster) {
            monster.destroy();
        });
        this.monsters = [];
        this.tileset = [];
    }

}

function canASeeB(a, b, range) {
    let canSee = false;
    let distance = manhattanDistance(a.currentTile.x, a.currentTile.y, b.currentTile.x, b.currentTile.y);
    if (distance <= range * TILE_SIZE) {
        let deltaX = b.currentTile.x - a.x;
        let deltaY = a.y - b.currentTile.y;
        let angle = -Math.atan2(deltaY, deltaX);
        let ray = new Ray(a.currentTile, angle, GameManager.instance.monsterManager.tileset);
        ray.cast();
        if (ray.traveledTiles.indexOf(b.currentTile) !== -1) {
            canSee = true;
        }
    }
    return canSee;
}

class Monster extends Moveable {
    constructor(manager, tile, img, health) {
        super(tile.x, tile.y, GameManager.instance.monsterManager.tileset, img, 11, health);
        this.technicalName = img;
        this.maxHealth = health;
        this.health = health;
        this.isInBattle = false;
        this.mouseInteraction = new MouseInteractionWrapper(this, TILE_SIZE, TILE_SIZE, true, false, 11);
        new Observer(GameManager.instance.player, this, "playerStep", this.checkPlayerProximity);
    }

    checkPlayerProximity() {
        if (!this.isInBattle) {
            let canSee = canASeeB(this, GameManager.instance.player, 6);
            if (canSee) {
                GameManager.instance.monsterManager.initiateBattle(this, true);
            }
        }
    }

    getBattleLogic() {
    }

    startMovementToPlayer() {
        let neighboursOfTile = GameManager.instance.monsterManager.tileset.getNeighboursOfTile(GameManager.instance.player.currentTile);
        let closestTile = undefined;
        let minDist = null;
        for (let i = 0; i < neighboursOfTile.length; i++) {
            if (neighboursOfTile[i].walkable) {
                let dist = manhattanDistance(this.currentTile.x, this.currentTile.y, neighboursOfTile[i].x, neighboursOfTile[i].y);
                if (minDist === null || minDist > dist) {
                    closestTile = neighboursOfTile[i];
                    minDist = dist;
                }
            }
        }
        new TimedEvent(FPS / 2, function (params) {
            params[0].prepareMove(params[1], params[2]);
            if (params[0].path.length > params[0].movespeed) {
                params[0].path = params[0].path.slice(0, params[0].movespeed);
            }
            params[0].lastStepTrigger = true;
            params[0].lastStepFunction = function () {
                GameManager.instance.battle.next();
            };
        }, [this, closestTile.x, closestTile.y]);
    }

    hover() {
        this.switchImageTo(this.descriptor.name + '_selected');
    }

    hoverLeave() {
        this.switchImageTo(this.technicalName);
    }

    destroy() {
        this.mouseInteraction.destroy();
        GameManager.instance.monsterManager.removeMonster(this);
        super.destroy();
    }
}

class Blob extends Monster {
    constructor(manager, tile) {
        super(manager, tile, "monster_blob", 20);
        this.movespeed = 2;
    }

    getBattleLogic() {
        return super.startMovementToPlayer;
    }

}