const DIRECTIONS = [
	[0,1],
	[1,0],
	[0,-1],
	[-1,0]
];

class Node{
    constructor(otherObject){
        this.x = otherObject.x;
        this.y = otherObject.y;
        this.parent = null;
        this.g = 0;
        this.h = 0;
        this._f = 0;
		this.walkable = otherObject.walkable;
    }
    
    get f(){
        return this.g + this.h;
    }
}

class RouteCreator{
    constructor(nodes, start, end){
        this.nodes = [];
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i] === end){
               this.end = new Node(nodes[i]);
               this.nodes.push(this.end);
            }else {
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
    
    createRoute(){
        let current = this.openList.splice(this.getMinScoreNode(), 1)[0];
        this.closedList.push(current);
		for(let i = 0; i < 4; i++){
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
        
        if(this.openList.length != 0){
            if(this.closedList.indexOf(this.end) === -1){
                return this.createRoute();
            } else {
               return this.getRouteCoordinates().reverse();
            }
        } else {
            return [];
        }
    }
    
    getNode(x, y){
        let node = null;
        for(let i = 0; i < this.nodes.length; i++){
            if(x == this.nodes[i].x && y == this.nodes[i].y){
                node = this.nodes[i];
                break;
            }
        }
        return node;
    }
    
    getRouteCoordinates(){
        let currentNode = this.end;
        let coordinates = [];
        while(currentNode.parent !== currentNode){
            coordinates.push([currentNode.x, currentNode.y]);
            currentNode = currentNode.parent;
        }
		coordinates.push([this.start.x, this.start.y]);
        return coordinates;
    }
    
    calculateScore(node) {
        node.g = node.parent.g + TILE_SIZE;
        node.h = Math.pow(this.end.x - node.x, 2) + Math.pow(this.end.y - node.y, 2);
    }
}

class RouteSection{
	constructor(section, direction){
		this.section = section;
		this.extendedSection = [];
		this.direction = direction;
	}
	
	getLastTile(){
		return this.section[this.section.length - 1];
	}
	
	push(tile){
		this.section.push(tile);
	}
	
	pushExtended(tile){
		this.extendedSection.push(tile);
	}
}

function flattenRoute(route, tilemap){
	let finalRoute = [];
	if(route.length < 3){
		finalRoute = route;
	} else {
		let sections = [];
		for(let i = 1; i < route.length; i++){
			if(sections.length === 0){
				sections.push(new RouteSection([route[0], route[1]], getNormalizedDirection(route[0], route[1])));
			} else {
				let currentTile = route[i];
				let currentSection = sections[sections.length - 1];
				let sectionDirection = currentSection.direction;
				let sectionTile = currentSection.getLastTile();
				let normalizedDirection = getNormalizedDirection(sectionTile, currentTile);
				let sameDirection = normalizedDirection[0] === sectionDirection[0] && normalizedDirection[1] === sectionDirection[1];
				if(sameDirection){
					currentSection.push(currentTile);
				} else {
					sections.push(new RouteSection([currentTile], normalizedDirection));
				}
			}
		}
		extendSections(sections, tilemap);
		crossSections(sections);
		console.log(sections);
		paintSections(sections);
		stopGame();
	}
	return route;
}

function getNormalizedDirection(coordinateA, coordinateB){
	return [Math.sign(coordinateB[0] - coordinateA[0]), Math.sign(coordinateB[1] - coordinateA[1])];
}

function crossSections(sections){
	let sectionStart = 0;
	let sectionEnd = 0;
	let sectionStartCutoff = 0;
	let sectionEndCutoff = 0;
	for(let rear = sections.length - 1; rear >= 0; rear--){
		for(let front = 0; front < rear; front++){
			if(rear !== front){
				for(let i = 0; i < sections[rear].extendedSection.length; i++){
					for(let j = 0; j < sections[front].extendedSection.length; j++){
						
					}
				}
			}
		}			
	}
}

function extendSections(sections, tilemap){
	for(let i = 0; i < sections.length; i++){
		let currentSection = sections[i];
		let reverseDirection = [currentSection.direction[0] * (-1), currentSection.direction[1] * (-1)];
		let reverseRay = new SimpleRay(currentSection.section[0], reverseDirection, tilemap);
		reverseRay.cast();
		for(let j = 0; j < reverseRay.traveledTiles.length; j++){
			let path = reverseRay.traveledTiles[j];
			currentSection.pushExtended(path);
		}
		let ray = new SimpleRay(currentSection.getLastTile(), currentSection.direction, tilemap);
		ray.cast();
		for(let j = 0; j < ray.traveledTiles.length; j++){
			let path = ray.traveledTiles[j];
			currentSection.pushExtended(path);
		}
	}
}

function paintSections(sections){
	for(let i = 0; i < sections.length; i++){
		let color = getRandomColor();
		let currentSection = sections[i];
		context.fillStyle = color;
		for(let j = 0; j < currentSection.section.length; j++){
			context.fillRect(currentSection.section[j][0], currentSection.section[j][1], TILE_SIZE, TILE_SIZE);
		}
		context.globalAlpha = 0.5;
		for(let j = 0; j < currentSection.extendedSection.length; j++){
			context.fillRect(currentSection.extendedSection[j][0], currentSection.extendedSection[j][1], TILE_SIZE, TILE_SIZE);
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
