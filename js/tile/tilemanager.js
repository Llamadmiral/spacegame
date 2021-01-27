const MATRIX_OFFSET = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

class Tilemap {
    constructor() {
        this.map = {};
        this.tileDescriptors = [];
        this.tileArray = [];
        this.subMaps = [];
    }

    addTileDescriptor(x, y, structureTile) {
        this.tileDescriptors.push(new TileDescriptor(x, y, structureTile));
    }

    getTileDescriptor(x, y) {
        let descriptor = null;
        for (let i = 0; i < this.tileDescriptors.length; i++) {
            let currentDescriptor = this.tileDescriptors[i];
            if (currentDescriptor.x === x && currentDescriptor.y === y) {
                descriptor = currentDescriptor;
                break;
            }
        }
        return descriptor;
    }

    getSurroundingTilesOfDescriptors() {
        let surroundingTiles = [];
        for (let i = 0; i < this.tileDescriptors.length; i++) {
            let currentDescriptor = this.tileDescriptors[i];
            for (let offset = 0; offset < MATRIX_OFFSET.length; offset++) {
                let neighbourX = currentDescriptor.x + MATRIX_OFFSET[offset][0] * TILE_SIZE;
                let neighbourY = currentDescriptor.y + MATRIX_OFFSET[offset][1] * TILE_SIZE;
                let neighbour = this.getTileDescriptor(neighbourX, neighbourY);
                if (!neighbour) {
                    let alreadyContains = false;
                    for (let j = 0; j < surroundingTiles.length; j++) {
                        if (surroundingTiles[j][0] === neighbourX && surroundingTiles[j][1] === neighbourY) {
                            alreadyContains = true;
                            break;
                        }
                    }
                    if (!alreadyContains) {
                        surroundingTiles.push([neighbourX, neighbourY]);
                    }
                }
            }
        }
        return surroundingTiles;
    }

    getMatrixStructure(x, y) {
        let matrixStructure = [];
        for (let offset = 0; offset < MATRIX_OFFSET.length; offset++) {
            let neighbourX = x + MATRIX_OFFSET[offset][0] * TILE_SIZE;
            let neighbourY = y + MATRIX_OFFSET[offset][1] * TILE_SIZE;
            let neighbour = this.getTileDescriptor(neighbourX, neighbourY);
            if (!neighbour) {
                matrixStructure.push(MATRIX_SPACE);
            } else if (neighbour.structureTile.walkable) {
                matrixStructure.push(MATRIX_TILE);
            } else {
                matrixStructure.push(MATRIX_WALL);
            }
        }
        return matrixStructure;
    }

    buildTiles() {
        for (let i = 0; i < this.tileDescriptors.length; i++) {
            let tileDescriptor = this.tileDescriptors[i];
            let newTile = tileDescriptor.structureTile.build(tileDescriptor.x, tileDescriptor.y);
            this.addTile(newTile);
        }
    }

    addTile(tile) {
        if (this.map[tile.x] === undefined) {
            this.map[tile.x] = {};
        }
        if (this.map[tile.x][tile.y]) {
            let oldTile = this.map[tile.x][tile.y];
            oldTile.destroy();
            this.tileArray.splice(this.tileArray.indexOf(oldTile), 1);
        }
        this.map[tile.x][tile.y] = tile;
        this.tileArray.push(tile);
    }

    getNeighboursOfTile(tile) {
        let neighbours = [];
        for (let i = 0; i < NEIGHBOUR_OFFSETS.length; i++) {
            let neighbour = this.getTile(tile.x + NEIGHBOUR_OFFSETS[i][0], tile.y + NEIGHBOUR_OFFSETS[i][1]);
            if (neighbour) {
                neighbours.push(neighbour);
            }
        }
        return neighbours;
    }

    getTile(x, y, deep = true) {
        let tile = undefined;
        if (this.map[x] !== undefined) {
            tile = this.map[x][y];
        }
        if (deep && tile === undefined) {
            for (let i = 0; i < this.subMaps.length; i++) {
                tile = this.subMaps[i].getTile(x, y, false);
                if (tile !== undefined) {
                    break;
                }
            }
        }
        return tile;
    }

    getTileByName(name) {
        let result = null;
        for (let i = 0; i < this.tileArray.length; i++) {
            if (this.tileArray[i].name === name) {
                result = this.tileArray[i];
                break;
            }
        }
        return result;
    }

    getTilesByName(name) {
        let result = [];
        for (let i = 0; i < this.tileArray.length; i++) {
            if (name === this.tileArray[i].name) {
                result.push(this.tileArray[i]);
            }
        }
        return result;
    }

    move(x, y, onDescriptor = false) {
        let arrayToUse = onDescriptor ? this.tileDescriptors : this.tileArray;
        for (let i = 0; i < arrayToUse.length; i++) {
            arrayToUse[i].x += x;
            arrayToUse[i].y += y;
        }
    }

    reassignKeys() {
        this.map = {};
        for (let i = 0; i < this.tileArray.length; i++) {
            let tile = this.tileArray[i];
            if (this.map[tile.x] === undefined) {
                this.map[tile.x] = {};
            }
            this.map[tile.x][tile.y] = tile;
        }
    }

    mergeMap(otherMap) {
        let newSubMaps = [];
        Array.prototype.push.apply(newSubMaps, otherMap.subMaps);
        Array.prototype.push.apply(newSubMaps, this.subMaps);
        newSubMaps.push(this);
        newSubMaps.push(otherMap);
        for (let i = 0; i < newSubMaps.length; i++) {
            let currentMap = newSubMaps[i];
            let newSubMapCopy = [...newSubMaps];
            newSubMapCopy.splice(newSubMapCopy.indexOf(currentMap), 1);
            currentMap.subMaps = newSubMapCopy;
        }
    }

    mergeDescriptors(otherMap) {
        Array.prototype.push.apply(this.tileDescriptors, otherMap.tileDescriptors);
    }

    showAllTiles() {
        this.tileArray.forEach(function (tile) {
            tile.visible = true;
            tile.discovered = true;
        });
        this.subMaps.forEach(function (map) {
            map.showAllTiles();
        });
    }

    getLeftmostTiles() {
        let tiles = [];
        let minX = this.tileArray[0].x;
        for (let i = 1; i < this.tileArray.length; i++) {
            let tile = this.tileArray[i];
            if (minX === tile.x) {
                tiles.push(tile);
            } else if (tile.x < minX) {
                tiles = [];
                minX = tile.x;
                tiles.push(tile);
            }
        }
        return tiles;
    }

    getWidthAndHeight(useDescriptors = false) {
        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;
        let arrayToUse = useDescriptors ? this.tileDescriptors : this.tileArray;
        for (let i = 0; i < arrayToUse.length; i++) {
            let tile = arrayToUse[i];
            if (minX > tile.x) {
                minX = tile.x;
            }
            if (minY > tile.y) {
                minY = tile.y;
            }
            if (maxX < tile.x) {
                maxX = tile.x;
            }
            if (maxY < tile.y) {
                maxY = tile.y;
            }
        }
        return [maxX - minX, maxY - minY];
    }

    getRandomTile() {
        return this.tileArray[rnd(0, this.tileArray.length)];
    }

    collectTiles() {
        let allTileArray = [];
        for (let i = 0; i < this.subMaps.length; i++) {
            Array.prototype.push.apply(allTileArray, this.subMaps[i].tileArray);
        }
        Array.prototype.push.apply(allTileArray, this.tileArray);
        return allTileArray;
    }

    removeTile(x, y, destroy) {
        let tile = this.getTile(x, y, false);
        if (tile !== undefined) {
            this.tileArray.splice(this.tileArray.indexOf(tile), 1);
            this.map[x][y] = undefined;
            if (destroy) {
                tile.destroy();
            }
        }
    }

}

class TileDescriptor {
    constructor(x, y, structureTile) {
        this.x = x;
        this.y = y;
        this.structureTile = LOADED_STRUCTURE_TILES[structureTile];
        if (!this.structureTile) {
            console.log("No structure tile found with this name", structureTile);
        }
    }
}

class Tile extends Drawable {
    constructor(x, y, name, img, walkable, passesLight) {
        super(x, y, img, 2);
        this.name = name;
        this.walkable = walkable;
        this.passesLight = passesLight;
        this.discovered = false;
        this.visible = false;
        this.fogOfWarEffect = undefined;
    }

    draw() {
        if (this.visible || this.discovered) {
            super.draw();
        }
        if (this.discovered && !this.visible) {
            if (!this.fogOfWarEffect) {
                this.fogOfWarEffect = new FogOfWarEffect(this);
            }
        }
        if (this.discovered && this.visible) {
            if (this.fogOfWarEffect) {
                this.fogOfWarEffect.destroy();
                this.fogOfWarEffect = undefined;
            }
        }
    }

    beforeStep(stepper) {
    }

    onStep(stepper) {
    }

    onLeave(stepper) {
    }

    destroy() {
        if (this.fogOfWarEffect !== undefined) {
            this.fogOfWarEffect.destroy();
        }
        super.destroy();
    }
}