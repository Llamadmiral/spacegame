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
        return coordinates;
    }
    
    calculateScore(node) {
        node.g = node.parent.g + TILE_SIZE;
        node.h = Math.pow(this.end.x - node.x, 2) + Math.pow(this.end.y - node.y, 2);
    }
    
}