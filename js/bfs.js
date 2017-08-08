/**
 * Created by Tran Quang Khai on 8/9/2017.
 */
var BLANK = 0;
var WALL = 1;
var SNAKE = 2;
var VISITED = 3;

function Node(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
}

function BreadthFirstSearch(walls, cols, rows) {
    var open = new Queue();

    var nodes = [];
    // Convert the integer array (walls) to node array
    for (var i = 0; i < cols; i++){
        nodes[i] = [];
        for(var j = 0; j < rows; j++){
            nodes[i][j] = new Node(i, j, walls[i][j]);
        }
    }

    this.findPath = function (snakeData, start, goal) {
        var node;
        if(open) {
            open.clear();
            // Reset all visited nodes
            for(var i = 0; i < cols; i++){
                for(var j = 0; j < rows; j++){
                    node = nodes[i][j];
                    if(node.value == SNAKE || node.value == VISITED){
                        node.previous = undefined;
                        node.value = BLANK;
                    }
                }
            }
        }
        else{
            open = new Queue();
        }

        // Consider the snake body as wall
        for(var i = 0; i < snakeData.length; i++){
            var x = snakeData[i].x;
            var y = snakeData[i].y;
            node[x][y].value = SNAKE;
        }

        // Add the start node to queue
        open.enqueue(start);

        //Main loop
        while(!open.isEmpty()) {
            node = open.dequeue();

            if(node) {
                //If goal
                if(node.x == goal.x && node.y == goal.y){
                    return getSolution(node);
                }
                genMove(node);
            }
            else{
                break;
            }
        }
        return null;
    }

    // Generate next states by adding neighbour node
    function genMove(node){
        // if the current node can move to right => add the "right-node" to open[] (queue)
        if(node.x < cols - 1) addToOpen(node.x + 1, node.y, node);

        // if the current node can move to up => add the "up-node" to open[]
        if(node.y < rows - 1) addToOpen(node.x, node.y + 1, node);

        // if the current node can move to left => add the "left-node" to open[]
        if(node.x > 0) addToOpen(node.x - 1, node.y, node);

        // if the current node can move to down => add the "down-node" to open[]
        if(node.y > 0) addToOpen(node.x, node.y - 1, node);
    }

    function addToOpen(x, y, previous) {
        var node = nodes[x][y];

        if (node.value == BLANK) {
            // Mark this node as visited to avoid adding it multiple times
            node.value =VISITED;
            // Store the previous node
            // So that we can backtrack to find the optimum path
            // (by using getSolution() method)
            node.previous = previous;
            open.enqueue(node);
        }
    }

    // Return solution
    function getSolution(p) {
        var nodes = [];
        nodes.push(p);

        while (p.previous){
            nodes.push(p.previous);
            p = p.previous;
        }
        return nodes;
    }
}