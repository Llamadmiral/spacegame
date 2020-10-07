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
        GameManager.battle = new Battle();
        let participants = this.gatherParticipants(originalParticipant);
        for (let i = 0; i < participants.length; i++) {
            let participant = participants[i];
            participant.isInBattle = true;
            GameManager.battle.participants.push(new BattleParticipant(participant, participant.getBattleLogic(), 10));
        }
        if (playerPresent) {
            GameManager.player.path = [];
            GameManager.player.canMove = false;
            GameManager.player.isInBattle = true;
            GameManager.battle.participants.push(new BattleParticipant(GameManager.player, GameManager.player.battleLogic, 5));
        }
        GameManager.battle.start();
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
                    if (participant !== monster && participants.indexOf(monster) === -1 && canAseeB(participant, monster, 6)) {
                        participants.push(monster);
                    }
                }
            }
        }
        return participants;
    }
}

function canAseeB(a, b, range) {
    let canSee = false;
    let distance = manhattanDistance(a.currentTile.x, a.currentTile.y, b.currentTile.x, b.currentTile.y);
    if (distance <= range * TILE_SIZE) {
        let deltaX = b.currentTile.x - a.x;
        let deltaY = a.y - b.currentTile.y;
        let angle = -Math.atan2(deltaY, deltaX);
        let ray = new Ray(a.currentTile, angle, a.manager.tileset);
        ray.cast();
        if (ray.traveledTiles.indexOf(GameManager.player.currentTile) !== -1) {
            canSee = true;
        }
    }
    return canSee;
}

class Monster extends Moveable {
    constructor(manager, tile, img) {
        super(tile.x, tile.y, manager.tileset, img, 11);
        this.manager = manager;
        this.isInBattle = false;
        new Observer(GameManager.player, this, "playerStep", this.checkPlayerProximity);
    }

    checkPlayerProximity() {
        if (!this.isInBattle) {
            let canSee = canAseeB(this, GameManager.player, 6);
            if (canSee) {
                this.manager.initiateBattle(this, true);
            }
        }
    }

    getBattleLogic() {
    }

    startMovementToPlayer() {
        let neighboursOfTile = this.manager.tileset.getNeighboursOfTile(GameManager.player.currentTile);
        let closestTile = undefined;
        let minDist = TILE_SIZE * 7;
        for (let i = 0; i < neighboursOfTile.length; i++) {
            if (neighboursOfTile[i].walkable) {
                let dist = manhattanDistance(this.currentTile.x, this.currentTile.y, neighboursOfTile[i].x, neighboursOfTile[i].y);
                if (minDist > dist) {
                    closestTile = neighboursOfTile[i];
                    minDist = dist;
                }
            }
        }
        new TimedEvent(FPS / 2, function (params) {
            params[0].prepareMove(params[1], params[2]);
            params[0].lastStepTrigger = true;
            params[0].lastStepFunction = function () {
                GameManager.battle.next();
            };
        }, [this, closestTile.x, closestTile.y]);
    }
}

class Blob extends Monster {
    constructor(manager, tile) {
        super(manager, tile, "monster_blob");
    }

    getBattleLogic() {
        return super.startMovementToPlayer;
    }

}