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
        super(tile.x, tile.y, manager.tileset, img, 9);
        this.currentTile.walkable = false;
        this.manager = manager;
        new Observer(player, this, "playerStep", this.checkPlayerProximity);
    }

    checkPlayerProximity() {
        let distance = manhattanDistance(this.currentTile.x, this.currentTile.y, player.currentTile.x, player.currentTile.y);
        if (distance <= 6 * TILE_SIZE) {
            let deltaX = player.currentTile.x - this.x;
            let deltaY = this.y - player.currentTile.y;
            let angle = -Math.atan2(deltaY, deltaX);
            let ray = new Ray(this.currentTile, angle, this.manager.tileset);
            ray.cast();
            if (ray.traveledTiles.indexOf(player.currentTile) !== -1) {
                console.log("Can see the player!");
                this.startMovementToPlayer();
            }
        }
    }

    startMovementToPlayer() {
        let neighboursOfTile = this.manager.tileset.getNeighboursOfTile(player.currentTile);
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
        console.log(closestTile);
        this.prepareMove(closestTile.x, closestTile.y);
    }

}