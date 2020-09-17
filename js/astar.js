const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

class Node {
    constructor(otherObject) {
        this.x = otherObject.x;
        this.y = otherObject.y;
        this.parent = null;
        this.g = 0;
        this.h = 0;
        this._f = 0;
        this.walkable = otherObject.walkable;
    }

    get f() {
        return this.g + this.h;
    }
}

class RouteCreator {
    constructor(nodes, start, end) {
        this.nodes = [];
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] === end) {
                this.end = new Node(nodes[i]);
                this.nodes.push(this.end);
            } else {
                this.nodes.push(new Node(nodes[i]));
            }
        }
        this.start = new Node(start);
        this.start.parent = this.start;
        this.closedList = [];
        this.openList = [];
        this.openList.push(this.start);
    }

    getMinScoreNode() {
        let lowest = null;
        for (let i = 0; i < this.openList.length; i++) {
            if (lowest == null || this.openList[lowest].f > this.openList[i].f) {
                lowest = i;
            }
        }
        return lowest;
    }

    createRoute() {
        let current = this.openList.splice(this.getMinScoreNode(), 1)[0];
        this.closedList.push(current);
        for (let i = 0; i < 4; i++) {
            let offsetX = DIRECTIONS[i][0];
            let offsetY = DIRECTIONS[i][1];
            let neighbourX = current.x + offsetX * TILE_SIZE;
            let neighbourY = current.y + offsetY * TILE_SIZE;
            let neighbourNode = this.getNode(neighbourX, neighbourY);
            if (neighbourNode !== null && this.closedList.indexOf(neighbourNode) === -1 && neighbourNode.walkable) {
                if (this.openList.indexOf(neighbourNode) === -1) {
                    neighbourNode.parent = current;
                    this.openList.push(neighbourNode);
                    this.calculateScore(neighbourNode);
                } else {
                    if (current.g + TILE_SIZE < neighbourNode.g) {
                        neighbourNode.g = current.g + TILE_SIZE;
                    }
                }
            }
        }

        if (this.openList.length != 0) {
            if (this.closedList.indexOf(this.end) === -1) {
                return this.createRoute();
            } else {
                return this.getRouteCoordinates().reverse();
            }
        } else {
            return [];
        }
    }

    getNode(x, y) {
        let node = null;
        for (let i = 0; i < this.nodes.length; i++) {
            if (x == this.nodes[i].x && y == this.nodes[i].y) {
                node = this.nodes[i];
                break;
            }
        }
        return node;
    }

    getRouteCoordinates() {
        let currentNode = this.end;
        let coordinates = [];
        while (currentNode.parent !== currentNode) {
            coordinates.push([currentNode.x, currentNode.y]);
            currentNode = currentNode.parent;
        }
        return coordinates;
    }

    calculateScore(node) {
        node.g = node.parent.g + TILE_SIZE;
        node.h = Math.pow(this.end.x - node.x, 2) + Math.pow(this.end.y - node.y, 2);
    }
}

class RouteSection {
    constructor(section, direction) {
        this.section = section;
        this.forwardExtension = [];
        this.backwardExtension = [];
        this.direction = direction;
    }

    getLastTile() {
        return this.section[this.section.length - 1];
    }

    push(tile) {
        this.section.push(tile);
    }

    isColliding(otherSection) {
        //they are not parallel
        let collide = false;
        if (Math.abs(this.direction[0]) === Math.abs(otherSection.direction[1]) && Math.abs(this.direction[1]) === Math.abs(otherSection.direction[0])) {
            for (let i = 0; i < this.forwardExtension.length; i++) {
                for (let j = 0; j < otherSection.backwardExtension.length; j++) {
                    if (this.forwardExtension[i][0] === otherSection.backwardExtension[j][0] && this.forwardExtension[i][1] === otherSection.backwardExtension[j][1]) {
                        collide = [i, j];
                    }
                }
            }
        }
        return collide;
    }
}

function flattenRoute(route, tilemap) {
    let finalRoute = [];
    if (route.length < 3) {
        finalRoute = route;
    } else {
        let sections = [];
        for (let i = 1; i < route.length; i++) {
            if (sections.length === 0) {
                sections.push(new RouteSection([route[0], route[1]], getNormalizedDirection(route[0], route[1])));
            } else {
                let currentTile = route[i];
                let currentSection = sections[sections.length - 1];
                let sectionDirection = currentSection.direction;
                let sectionTile = currentSection.getLastTile();
                let normalizedDirection = getNormalizedDirection(sectionTile, currentTile);
                let sameDirection = normalizedDirection[0] === sectionDirection[0] && normalizedDirection[1] === sectionDirection[1];
                if (sameDirection) {
                    currentSection.push(currentTile);
                } else {
                    sections.push(new RouteSection([currentTile], normalizedDirection));
                }
            }
        }
        if (sections.length < 3) {
            finalRoute = route;
        } else {
            extendSections(sections, tilemap);
            crossSections(sections);
            finalRoute = mergeSections(sections);
        }
    }
    return finalRoute;
}

function mergeSections(sections) {
    let finalRoute = [];
    for (let i = 0; i < sections.length; i++) {
        let currentSection = sections[i];
        finalRoute = finalRoute.concat(currentSection.section);
    }
    return finalRoute;
}

function getNormalizedDirection(coordinateA, coordinateB) {
    return [Math.sign(coordinateB[0] - coordinateA[0]), Math.sign(coordinateB[1] - coordinateA[1])];
}

function crossSections(sections) {
    let cutStart = 0;
    let cutEnd = 0;
    let collide = false;
    for (let front = 0; front < sections.length; front++) {
        for (let rear = sections.length - 1; rear > 0; rear--) {
            collide = sections[front].isColliding(sections[rear]);
            if (collide) {
                cutStart = front;
                cutEnd = rear;
                break;
            }
        }
        if (collide) {
            break;
        }
    }
    if (collide) {
        sections[cutStart].section = sections[cutStart].section.concat(sections[cutStart].forwardExtension.slice(0, collide[0] + 1));
        sections[cutEnd].section = sections[cutEnd].backwardExtension.slice(0, collide[1]).reverse().concat(sections[cutEnd].section);
        //paintSections([sections[cutStart], sections[cutEnd]]);
        sections.splice(cutStart + 1, cutEnd - cutStart - 1);
    }
}

function extendSections(sections, tilemap) {
    for (let i = 0; i < sections.length; i++) {
        let currentSection = sections[i];
        let reverseDirection = [currentSection.direction[0] * (-1), currentSection.direction[1] * (-1)];
        let backwardRay = new SimpleRay(currentSection.section[0], reverseDirection, tilemap);
        backwardRay.cast();
        for (let j = 0; j < backwardRay.traveledTiles.length; j++) {
            let path = backwardRay.traveledTiles[j];
            currentSection.backwardExtension.push(path);
        }
        let forwardRay = new SimpleRay(currentSection.getLastTile(), currentSection.direction, tilemap);
        forwardRay.cast();
        for (let j = 0; j < forwardRay.traveledTiles.length; j++) {
            let path = forwardRay.traveledTiles[j];
            currentSection.forwardExtension.push(path);
        }
    }
}

function paintSections(sections) {
    for (let i = 0; i < sections.length; i++) {
        let color = getRandomColor();
        let currentSection = sections[i];
        context.fillStyle = color;
        for (let j = 0; j < currentSection.section.length; j++) {
            context.fillRect(currentSection.section[j][0], currentSection.section[j][1], TILE_SIZE, TILE_SIZE);
        }
        context.globalAlpha = 0.5;
        for (let j = 0; j < currentSection.forwardExtension.length; j++) {
            context.fillRect(currentSection.forwardExtension[j][0], currentSection.forwardExtension[j][1], TILE_SIZE, TILE_SIZE);
        }
        for (let j = 0; j < currentSection.backwardExtension.length; j++) {
            context.fillRect(currentSection.backwardExtension[j][0], currentSection.backwardExtension[j][1], TILE_SIZE, TILE_SIZE);
        }
        context.globalAlpha = 1;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
