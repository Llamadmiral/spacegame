class MonsterManager {
    constructor(numberOfMonsters, tileset) {
        this.numberOfMonsters = numberOfMonsters;
        this.tileset = tileset;
    }

    spawnMonsters() {
        let tile = this.tileset.getRandomTile();
        while (!tile.walkable) {
            tile = this.tileset.getRandomTile();
            console.log("Trying to get a new tile...");
        }
        let monster = new Monster(this, tile, "monster_blob");
    }
}

class Monster extends Moveable {
    constructor(manager, tile, img) {
        super(tile.x, tile.y, manager.tileset, img, 11);
        this.manager = manager;
        this.seenPlayer = false;
        new Observer(GameManager.player, this, "playerStep", this.checkPlayerProximity);
    }

    checkPlayerProximity() {
        let distance = manhattanDistance(this.currentTile.x, this.currentTile.y, GameManager.player.currentTile.x, GameManager.player.currentTile.y);
        if (distance <= 6 * TILE_SIZE) {
            if (!this.seenPlayer) {
                let deltaX = GameManager.player.currentTile.x - this.x;
                let deltaY = this.y - GameManager.player.currentTile.y;
                let angle = -Math.atan2(deltaY, deltaX);
                let ray = new Ray(this.currentTile, angle, this.manager.tileset);
                ray.cast();
                if (ray.traveledTiles.indexOf(GameManager.player.currentTile) !== -1) {
                    GameManager.player.path = [];
                    GameManager.player.canMove = false;
                    GameManager.player.isInBattle = true;
                    GameManager.battle = new Battle();
                    GameManager.battle.participants.push(new BattleParticipant(this, this.startMovementToPlayer, 10));
                    GameManager.battle.participants.push(new BattleParticipant(GameManager.player, GameManager.player.battleLogic, 5));
                    GameManager.battle.start();
                    this.seenPlayer = true;
                }
            }
        } else {
            this.seenPlayer = false;
        }
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