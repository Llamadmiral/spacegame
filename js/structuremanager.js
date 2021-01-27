const TILEMAP = {};
const NEIGHBOUR_OFFSETS = [
    [0, TILE_SIZE],
    [TILE_SIZE, 0],
    [0, -TILE_SIZE],
    [-TILE_SIZE, 0]
];

const MAX_ROOM_DIMENSION = 11 + 1;
const MIN_ROOM_DIMENSION = 5;
const MAX_ROOM_OFFSET = 6 + 1;
const MIN_ROOM_OFFSET = 0 + 1;

const TILEMAP_ARRAY = [];

function generateShip() {
    let ship = new Ship();
    let numberOfRooms = rnd(4, 8);
    let rooms = [];

    for (let i = 0; i < numberOfRooms; i++) {
        let roomWidth = rnd(MIN_ROOM_DIMENSION, MAX_ROOM_DIMENSION);
        if (roomWidth % 2 === 0) {
            roomWidth += 1;
        }
        let roomHeight = rnd(MIN_ROOM_DIMENSION, MAX_ROOM_DIMENSION);
        let roomX = MAX_ROOM_OFFSET - Math.floor(roomWidth / 2)
        let roomY = rnd(MIN_ROOM_OFFSET, MAX_ROOM_OFFSET);
        let room = new Box(roomX, roomY, roomWidth, roomHeight);
        if (rooms.length === 0) {
            rooms.push(room);
        } else {
            let collidesWithOthers = room.doCollideMultiple(rooms);
            if (!collidesWithOthers) {
                rooms.push(room);
            } else {
                let offset = DIRECTIONS[Math.random() < 0.5 ? 0 : 2]; // so that our ship is a LONG BOYE vertically
                while (collidesWithOthers) {
                    room.move(offset[0], offset[1]);
                    collidesWithOthers = room.doCollideMultiple(rooms);
                }
                rooms.push(room);
            }
        }
    }
    for (let i = 0; i < rooms.length; i++) {
        let room = generateRoom(rooms[i]);
        ship.mergeDescriptors(room);
    }
    let offsetX = GameManager.instance.player.x + (TILE_SIZE * 32);
    let offsetY = GameManager.instance.player.y - (TILE_SIZE * 32);
    addWalls(ship);
    ship.move(offsetX, offsetY, true);
    console.log(offsetX, offsetY);
    return ship;
}

function addWalls(ship) {
    let surroundingTiles = ship.getSurroundingTilesOfDescriptors();
    let walls = new Tilemap();
    for (let i = 0; i < surroundingTiles.length; i++) {
        let matrixStructure = ship.getMatrixStructure(surroundingTiles[i][0], surroundingTiles[i][1]);
        let structure = null;
        for (let key in LOADED_STRUCTURE_MATRIXES) {
            if (LOADED_STRUCTURE_MATRIXES.hasOwnProperty(key)) {
                let matches = LOADED_STRUCTURE_MATRIXES[key].matches(matrixStructure);
                if (matches) {
                    structure = key;
                    break;
                }
            }
        }
        if (structure) {
            walls.addTileDescriptor(surroundingTiles[i][0], surroundingTiles[i][1], structure);
        } else {
            console.log('Could not find matrix structure for matrix: ' + matrixStructure);
        }
    }
    ship.mergeDescriptors(walls);
}

function generateRoom(box) {
    let tilemap = new Tilemap();
    for (let x = box.x; x < box.width + box.x; x++) {
        for (let y = box.y; y < box.height + box.y; y++) {
            tilemap.addTileDescriptor(x * TILE_SIZE, y * TILE_SIZE, "tile");
        }
    }
    return tilemap;
}

class Box {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    doCollide(otherBox) {
        return this.x < otherBox.x + otherBox.width &&
            this.x + this.width > otherBox.x &&
            this.y < otherBox.y + otherBox.height &&
            this.y + this.height > otherBox.y;
    }

    doCollideMultiple(otherBoxes) {
        let collides = false;
        for (let i = 0; i < otherBoxes.length; i++) {
            collides = this.doCollide(otherBoxes[i]);
            if (collides) {
                break;
            }
        }
        return collides;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}

class Structure {
    constructor(name, tiles) {
        this.name = name;
        this.tiles = tiles;
    }

    build(startX, startY) {
        let tilemap = new Tilemap();
        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                let tile = this.tiles[y][x];
                if (tile !== "empty") {
                    let structureTile = LOADED_STRUCTURE_TILES[tile];
                    let newX = startX + (x * TILE_SIZE);
                    let newY = startY + (y * TILE_SIZE);
                    if (structureTile) {
                        tilemap.addTile(structureTile.build(newX, newY));
                    } else {
                        tilemap.addTile(new DecorTile(newX, newY, tile));
                    }
                }
            }
        }
        return tilemap;
    }
}

class StructureTile {
    constructor(name, walkable, passesLight, clazz, tileImage, tileImages) {
        this.name = name;
        this.walkable = walkable;
        this.passesLight = passesLight;
        this.clazz = clazz;
        this.tileImage = tileImage;
        this.tileImages = tileImages;
    }

    build(x, y) {
        let image;
        if (this.tileImages) {
            image = this.tileImages[rnd(0, this.tileImages.length)];
        } else {
            image = this.tileImage;
        }
        return new this.clazz(x, y, this.name, image, this.walkable, this.passesLight);
    }
}

class StructureMatrix {
    constructor(name, matrix) {
        this.name = name;
        this.matrix = matrix;
    }

    matches(otherMatrix) {
        let matches = true;
        for (let i = 0; i < this.matrix.length; i++) {
            if (this.matrix[i] !== -1 && this.matrix[i] !== otherMatrix[i]) {
                matches = false;
                break;
            }
        }
        return matches;
    }
}

class Ship extends Tilemap {
    constructor() {
        super();
        this.dockingTile = null;
        this.observers = [];
    }

    build() {
        this.buildTiles();
        let possibleDockingTiles = this.getLeftmostTiles();
        let foundDockingTile = false;
        for (let i = 0; i < possibleDockingTiles.length; i++) {
            let matrixStructure = this.getMatrixStructure(possibleDockingTiles[i].x, possibleDockingTiles[i].y);
            let matches = LOADED_STRUCTURE_MATRIXES["docking_door_vertical"].matches(matrixStructure);
            if (matches) {
                foundDockingTile = true;
                this.dockingTile = LOADED_STRUCTURE_TILES["docking_door_vertical_left"].build(possibleDockingTiles[i].x, possibleDockingTiles[i].y);
                let dockingTopTile = LOADED_STRUCTURE_TILES["docking_door_vertical_top_left"].build(this.dockingTile.x, this.dockingTile.y - TILE_SIZE);
                let dockingBottomTile = LOADED_STRUCTURE_TILES["docking_door_vertical_bottom_left"].build(this.dockingTile.x, this.dockingTile.y + TILE_SIZE);
                this.addTile(this.dockingTile);
                this.addTile(dockingTopTile);
                this.addTile(dockingBottomTile);
                let dockingAnimationGroup = new DockingDoorAnimation([this.dockingTile, dockingTopTile, dockingBottomTile]);
                this.observers = [
                    new Observer(this.dockingTile, dockingAnimationGroup, "onDoorEnter", dockingAnimationGroup.open),
                    new Observer(this.dockingTile, dockingAnimationGroup, "onDoorLeave", dockingAnimationGroup.close)
                ];
                break;
            }
        }
        if (!foundDockingTile) {
            console.log('Could not find docking tile...');
        }
        this.showAllTiles();
    }

    destroy() {
        this.dockingTile = null;
        this.observers.forEach(function (observer) {
            observer.destroy();
        });
        this.observers = undefined;
    }
}

class PlayerTransporter extends Updatable {

    static STATUS_IN_SPACE = 'inSpace';
    static STATUS_ARRIVING_AT_DESTINATION = 'arrivingAtDestination';
    static STATUS_PARKED = 'parked';
    static STATUS_DOCKING = 'docking';
    static STATUS_DOCKED = 'docked';
    static STATUS_UNDOCKING = 'startedUndocking';
    static STATUS_GOING_TO_SPACE = 'goingToSpace';

    constructor() {
        super();
        this.dockingTunnel = new Tilemap();
        this.status = PlayerTransporter.STATUS_IN_SPACE;
        this.quickMode = false;
        this.x = 0;
        this.y = 0;
        this.ship = LOADED_STRUCTURES["player_ship"].build(this.x, this.y);
        this.dockingTile = this.ship.getTileByName("docking_door_vertical_right");
        this.otherShip = null;
        let spawnPoint = this.ship.getTileByName("spawn_point");
        GameManager.instance.player = new Player(spawnPoint.x, spawnPoint.y, this.ship);
        GameManager.instance.cameraTarget = GameManager.instance.player;
        this.statusTrigger = new Trigger(this, 'playerTransporterStatusChange');
        this.ship.showAllTiles();
        this.initDockingDoorAnimationGroup();
    }

    initDockingDoorAnimationGroup() {
        let dockingTop = this.ship.getTileByName("docking_door_vertical_top_right");
        let dockingBottom = this.ship.getTileByName("docking_door_vertical_bottom_right");
        let dockingAnimationGroup = new DockingDoorAnimation([dockingTop, this.dockingTile, dockingBottom]);
        new Observer(this.dockingTile, dockingAnimationGroup, "onDoorEnter", dockingAnimationGroup.open);
        new Observer(this.dockingTile, dockingAnimationGroup, "onDoorLeave", dockingAnimationGroup.close);
    }

    update() {
        if (this.status === PlayerTransporter.STATUS_ARRIVING_AT_DESTINATION) {
            this.arriveAtDestination();
        } else if (this.status === PlayerTransporter.STATUS_GOING_TO_SPACE) {
            this.goToSpace();
        }
    }

    startArrivingAtDestination(otherShip) {
        if (otherShip.dockingTile !== null) {
            this.otherShip = otherShip;
            this.changeStatus(PlayerTransporter.STATUS_ARRIVING_AT_DESTINATION);
            GameManager.instance.monsterManager = new MonsterManager(3, this.otherShip);
            GameManager.instance.monsterManager.spawnMonsters();
        } else {
            console.log('Will not dock to ship with not-existing dock!');
        }
    }

    arriveAtDestination() {
        let quickMode = this.quickMode;
        let offsetX = 0;
        let offsetY = 0;
        let moveSpeed = TILE_SIZE / 4;
        if (this.dockingTile.x !== this.otherShip.dockingTile.x - (6 * TILE_SIZE)) {
            offsetX = quickMode ? TILE_SIZE : moveSpeed;
        }
        if (this.dockingTile.y !== this.otherShip.dockingTile.y) {
            offsetY = quickMode ? TILE_SIZE : moveSpeed;
        }
        if (offsetX === 0 && offsetY === 0) {
            this.changeStatus(PlayerTransporter.STATUS_PARKED);
            this.ship.reassignKeys();
        } else {
            this.ship.move(offsetX, -offsetY);
            GameManager.instance.player.x += offsetX;
            GameManager.instance.player.y -= offsetY;
        }
    }

    startGoingToSpace() {
        this.changeStatus(PlayerTransporter.STATUS_GOING_TO_SPACE);
    }

    goToSpace() {
        let quickMode = this.quickMode;
        let offsetX = 0;
        let offsetY = 0;
        let moveSpeed = TILE_SIZE / 4;
        if (this.dockingTile.x !== this.otherShip.dockingTile.x - (32 * TILE_SIZE)) {
            offsetX = quickMode ? TILE_SIZE : moveSpeed;
        }
        if (this.dockingTile.y !== this.otherShip.dockingTile.y - (32 * TILE_SIZE)) {
            offsetY = quickMode ? TILE_SIZE : moveSpeed;
        }
        if (offsetX === 0 && offsetY === 0) {
            this.changeStatus(PlayerTransporter.STATUS_IN_SPACE);
            this.ship.reassignKeys();
            this.otherShip.destroy();
        } else {
            this.ship.move(-offsetX, -offsetY);
            GameManager.instance.player.x -= offsetX;
            GameManager.instance.player.y -= offsetY;
        }
    }

    extendDockingTunnel() {
        this.changeStatus(PlayerTransporter.STATUS_DOCKING);
        let quickMode = this.quickMode;
        let dockPartAddingTimeOffset = FPS / 4;
        for (let i = 1; i < 6; i++) {
            let timeout = quickMode ? i : dockPartAddingTimeOffset * i;
            new TimedEvent(timeout,
                function (params) {
                    let bridgeTop = LOADED_STRUCTURE_TILES["ship_bridge_top_c"].build(params[1].x + TILE_SIZE * params[2], params[1].y - TILE_SIZE, "TILE_Floor_Bridge_C");
                    let bridgeFloor = LOADED_STRUCTURE_TILES["ship_bridge_floor_c"].build(params[1].x + TILE_SIZE * params[2], params[1].y, "TILE_Floor_Bridge_C");
                    let bridgeBottom = LOADED_STRUCTURE_TILES["ship_bridge_bottom_c"].build(params[1].x + TILE_SIZE * params[2], params[1].y + TILE_SIZE, "TILE_Floor_Bridge_C");
                    bridgeFloor.discovered = true;
                    bridgeTop.discovered = true;
                    bridgeBottom.discovered = true;
                    params[0].dockingTunnel.addTile(bridgeTop);
                    params[0].dockingTunnel.addTile(bridgeFloor);
                    params[0].dockingTunnel.addTile(bridgeBottom);
                },
                [this, this.dockingTile, i]);
        }
        new TimedEvent(quickMode ? 10 : dockPartAddingTimeOffset * 6,
            function (param) {
                param.ship.mergeMap(param.otherShip);
                param.dockingTunnel.mergeMap(param.ship);
                param.changeStatus(PlayerTransporter.STATUS_DOCKED);
            },
            this
        );
    }

    retractDockingTunnel() {
        let quickMode = this.quickMode;
        this.changeStatus(PlayerTransporter.STATUS_UNDOCKING);
        let dockPartAddingTimeOffset = FPS / 4;
        for (let i = 5; i > 0; i--) {
            let timeout = quickMode ? i : dockPartAddingTimeOffset * (5 - i + 1);
            new TimedEvent(timeout,
                function (params) {
                    params[0].dockingTunnel.removeTile(params[1].x + TILE_SIZE * params[2], params[1].y - TILE_SIZE, true);
                    params[0].dockingTunnel.removeTile(params[1].x + TILE_SIZE * params[2], params[1].y, true);
                    params[0].dockingTunnel.removeTile(params[1].x + TILE_SIZE * params[2], params[1].y + TILE_SIZE, true);
                },
                [this, this.dockingTile, i]);
        }
        new TimedEvent(quickMode ? 10 : dockPartAddingTimeOffset * 6, function (param) {
                param.changeStatus(PlayerTransporter.STATUS_PARKED);
            },
            this);
    }

    changeStatus(newStatus) {
        this.status = newStatus;
        this.statusTrigger.trigger();
    }
}