const FPS = 60;
const FRAMERATE = 1000 / FPS;
const UPDATABLE_OBJECTS = [];
const BACKGROUND_COLOR = 'black';
const TILE_SIZE = 32;
const WALK_SPEED = 2;
let DEBUG_MODE = false;

let canvas = null;
let context = null;
let nextCounterClearTime = null;
let fpsCounter = 0;
let currentFrame = 0;
let stopRefresh = false;
let camera = null;
let observerList = null;
let loadedImages = 0;

let lastMouseoverX = 0;
let lastMouseoverY = 0;
let objToUnselect = null;
let runSelectLogic = false;

let imageDirection = ['right', 'bottom', 'left', 'top'];


function stopGame() {
    stopRefresh = true;
}

function startGame() {
    stopRefresh = false;
    refresh();
}

function $(id) {
    return document.getElementById(id);
}

function init() {
    initCanvas();
    initCamera();
    initObserverList();
    loadImages();
}

function initUI() {
    GameManager.combatOrderIndicator = new UiCombatOrderIndicator(0, 0, 100);
}

function imagesLoaded() {
    loadStructureTiles();
    loadStructures();
    loadStructureMatrixes();
    addEventListeners();
    initUI();
    spawnPlayerTransporter();
    initBackgroundAnimation();
    nextCounterClearTime = Date.now() + 1000;
    refresh();
}

function spawnPlayerTransporter() {
    new PlayerTransporter();
}

function addEventListeners() {
    canvas.addEventListener('click', mouseClick);
    canvas.addEventListener('mousemove', mousemove);
}

function mousemove(evt) {
    runSelectLogic = evt;
}

function mouseClick(evt) {
    let x = normalizeToGrid(evt.clientX + camera.x);
    let y = normalizeToGrid(evt.clientY + camera.y);
    if (evt.ctrlKey) {
        console.log(GameManager.player.tilemap.getTile(x, y));
    } else if (evt.shiftKey) {
        let tile = GameManager.player.tilemap.getTile(x, y);
        if (tile) {
            GameManager.player.x = x;
            GameManager.player.y = y;
            GameManager.player.currentTile = tile;
        }
        //tile.switchImageTo("hologram_border_right_mirrored");
        /*let newTile = LOADED_STRUCTURE_TILES["hologram_border"].build(x, y);
        GameManager.player.tilemap.addTile(newTile);
        newTile.discovered = true;*/
    } else {
        GameManager.player.prepareMove(x, y);
    }
}

function loadStructureTiles() {
    STRUCTURE_TILES.forEach(
        function (tile) {
            LOADED_STRUCTURE_TILES[tile.name] = new StructureTile(tile.name, tile.walkable, tile.passesLight, tile.clazz ? tile.clazz : Tile, tile.tileImage, tile.tileImages);
        });
}

function loadStructures() {
    for (let i = 0; i < STRUCTURES.length; i++) {
        let blueprint = STRUCTURES[i];
        LOADED_STRUCTURES[blueprint.name] = new Structure(blueprint.name, blueprint.tiles);
    }
}

function loadStructureMatrixes() {
    for (let i = 0; i < STRUCTURE_MATRIX.length; i++) {
        let blueprint = STRUCTURE_MATRIX[i];
        LOADED_STRUCTURE_MATRIXES[blueprint.name] = new StructureMatrix(blueprint.name, blueprint.matrix);
    }
}

function initCanvas() {
    canvas = $('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.overflow = 'hidden';
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function initCamera() {
    camera = new Camera(0, 0);
}

function initObserverList() {
    observerList = new ObserverList();
}

function selectLogic(evt) {
    let x = normalizeToGrid(evt.clientX + camera.x);
    let y = normalizeToGrid(evt.clientY + camera.y);
    if (lastMouseoverX !== x || lastMouseoverY !== y) {
        if (objToUnselect) {
            objToUnselect.unselect();
            objToUnselect = null;
        }
        lastMouseoverX = x;
        lastMouseoverY = y;
        for (let i = UPDATABLE_OBJECTS.length - 1; i >= 0; i--) {
            let obj = UPDATABLE_OBJECTS[i];
            if (obj.hasOwnProperty('x') && obj.hasOwnProperty('y') && obj.x === x && obj.y === y) {
                console.log(obj);
                if (obj.select) {
                    obj.select();
                    objToUnselect = obj;
                }
                break;
            }
        }
    }
}

function refresh() {
    if (!stopRefresh) {
        let now = Date.now();
        if (nextCounterClearTime < now) {
            fpsCounter = 0;
            nextCounterClearTime = now + 1000;
        }
        currentFrame = (currentFrame + 1) % FPS;
        fpsCounter++;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (runSelectLogic) {
            selectLogic(runSelectLogic);
            runSelectLogic = false;
        }
        for (let i = 0; i < UPDATABLE_OBJECTS.length; i++) {
            let object = UPDATABLE_OBJECTS[i];
            object.update();
            if (object.toDraw()) {
                object.draw();
            }
        }
        window.setTimeout(refresh, FRAMERATE);
    }
}

function manhattanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function rnd(from, to) {
    if (to === undefined) {
        to = from;
        from = 0;
    }
    return Math.floor(Math.random() * (to - from)) + from;
}

function addToUpdatable(obj) {
    UPDATABLE_OBJECTS.push(obj);
    UPDATABLE_OBJECTS.sort(updatableComparaotr);
}

function updatableComparaotr(a, b) {
    return a.z - b.z;
}

window.addEventListener('load', init);