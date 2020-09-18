const HALF_TILE = TILE_SIZE / 2;
const AMOUNT_OF_RAYS = 600;

class PathEffect extends Updatable {
    constructor(moveable) {
        super(11);
        this.moveable = moveable;
        this.dot = null;
    }

    draw() {
        if (this.moveable.movement.path.length > 0) {
            context.strokeStyle = 'cyan';
            context.beginPath();
            let x = this.moveable.x - camera.x;
            let y = this.moveable.y - camera.y;
            context.moveTo(x + HALF_TILE, y + HALF_TILE);
            for (let i = 0; i < this.moveable.movement.path.length; i++) {
                let step = this.moveable.movement.path[i];
                x = step[0] - camera.x;
                y = step[1] - camera.y;
                context.lineTo(x + HALF_TILE, y + HALF_TILE);
            }
            if (this.dot === undefined) {
                this.dot = new Dot(x + HALF_TILE, y + HALF_TILE, 3, 'cyan', 11);
            } else {
                this.dot.x = x + HALF_TILE;
                this.dot.y = y + HALF_TILE;
            }
            context.stroke();
        } else if (this.dot) {
            this.dot.destroy();
            this.dot = undefined;
        }
    }

    toDraw() {
        return true;
    }
}

class FogOfWarEffect extends Updatable {
    constructor(tile) {
        super(tile.z + 1);
        this.tile = tile;
    }

    draw() {
        context.fillStyle = 'black';
        context.globalAlpha = 0.5;
        context.fillRect(this.tile.x - camera.x, this.tile.y - camera.y, TILE_SIZE, TILE_SIZE);
        context.globalAlpha = 1;
    }

    toDraw() {
        return true;
    }
}

class PlayerLighting extends Updatable {
    constructor(player) {
        super(11);
        this.player = player;
        this.lastPlayerPosition = player.currentTile;
        this.visibleTiles = [player.currentTile];
        this.recalculateTiles();
    }

    update() {
        if (this.lastPlayerPosition !== this.player.currentTile) {
            this.recalculateTiles();
        }
    }

    hideTiles() {
        let tileArray = this.player.tilemap.tileArray;
        for (let i = 0; i < tileArray.length; i++) {
            tileArray[i].visible = false;
        }
    }

    recalculateTiles() {
        this.hideTiles();
        this.lastPlayerPosition = this.player.currentTile;
        this.visibleTiles = [];
        for (let i = 0; i < AMOUNT_OF_RAYS; i++) {
            let ray = new Ray(this.lastPlayerPosition, i * (2 * Math.PI / AMOUNT_OF_RAYS), this.player.tilemap);
            ray.cast();
            for (let i = 0; i < ray.traveledTiles.length; i++) {
                if (this.visibleTiles.indexOf(ray.traveledTiles[i]) === -1) {
                    this.visibleTiles.push(ray.traveledTiles[i]);
                }
            }
        }
        for (let i = 0; i < this.visibleTiles.length; i++) {
            this.visibleTiles[i].visible = true;
            this.visibleTiles[i].discovered = true;
        }
    }
}

class Ray {
    constructor(startTile, angle, tilemap) {
        this.startX = startTile.x + HALF_TILE;
        this.startY = startTile.y + HALF_TILE;
        this.x = startTile.x + HALF_TILE;
        this.y = startTile.y + HALF_TILE;
        this.angle = angle;
        this.tilemap = tilemap;
        this.traveledTiles = [];
    }

    cast() {
        let s = Math.sin(this.angle);
        let c = Math.cos(this.angle);
        let collision = false;
        let distance = 0;
        while (!collision && distance < 5 * TILE_SIZE) {
            this.x += c;
            this.y += s;
            distance = manhattanDistance(this.startX, this.startY, this.x, this.y);
            let tile = this.tilemap.getTile(normalizeToGrid(this.x), normalizeToGrid(this.y));
            if (tile === undefined) {
                collision = true;
            } else if (this.traveledTiles.indexOf(tile) === -1) {
                this.traveledTiles.push(tile);
                if (!tile.passesLight) {
                    collision = true;
                }
            }
        }
    }
}

class SimpleRay {
    constructor(startCoordinate, offset, tilemap) {
        this.x = startCoordinate[0];
        this.y = startCoordinate[1];
        this.offset = offset;
        this.tilemap = tilemap;
        this.traveledTiles = [];
    }

    cast() {
        let c = this.offset[0] * TILE_SIZE;
        let s = this.offset[1] * TILE_SIZE;
        let collision = false;
        while (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height && !collision) {
            this.x += c;
            this.y += s;
            let tile = this.tilemap.getTile(this.x, this.y);
            if (tile === undefined) {
                collision = true;
            } else {
                this.traveledTiles.push([tile.x, tile.y]);
                if (!tile.walkable) {
                    collision = true;
                }
            }
        }
    }
}

class Dot extends Updatable {
    constructor(x, y, r, color, z) {
        super(z);
        this.r = r;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
    }

    toDraw() {
        return true;
    }
}

class Star extends Dot {
    constructor(x, y, r) {
        super(x, y, r, 'white');
        this.v = r + rnd(0, 2);
    }

    update() {
        this.x -= this.v;
        if (this.x < 0) {
            this.destroy();
        }
    }
}

function normalizeToGrid(number) {
    return Math.floor(number / TILE_SIZE) * TILE_SIZE;
}

function initBackgroundAnimation() {
    new TimedEvent(rnd(10, 20), initBackgroundAnimation);
    spawnStars();
}

function spawnStars() {
    let spawnX = canvas.width;
    let spawnY = rnd(10, canvas.height);
    new Star(spawnX, spawnY, rnd(1, 4));
}

function paintTiles(tiles, color = 'red') {
    for (let i = 0; i < tiles.length; i++) {
        context.beginPath();
        context.arc(tiles[i].x + HALF_TILE - camera.x, tiles[i].y + HALF_TILE - camera.y, 5, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
    }
}

function drawLineBetweenTiles(tiles) {
    if (tiles.length > 1) {
        context.strokeStyle = 'cyan';
        context.moveTo(tiles[0].x, tiles[0].y);
        context.lineTo(tiles[tiles.length - 1].x, tiles[tiles.length - 1].y);
        context.stroke();
    }
}