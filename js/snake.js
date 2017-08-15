/**
 * Created by Tran Quang Khai on 8/14/2017.
 */

/**--   SNAKE   --**/
function Snake(mapCols, mapRows, color, autoMoving) {

    //Directions
    var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

    this.direction;    //moving this.direction
    this.data;         //snake's body
    this.path;
    this.stepIndex;

    this.getHead = function () {
        return this.data[0];
    };

    //Prototypes
    this.init = function () {
        /**
         *  If is user =>> init at 3
         *  If is computer =>> init at mapCols - 4
         */
        var x = autoMoving ? mapCols-4 : 3;
        var y = 0;
        this.data = [
            {x: x,   y: y},
            {x: x-1, y: y},
            {x: x-2, y: y}
        ];

        this.direction = RIGHT;
    };

    this.handKey = function (key) {
        // 37: left, 38: up, 39: right, 40: down
        if(key >= 37 && key <= 40){
            var newDir = key - 37;
            if(Math.abs(this.direction - newDir) != 2)      //Can not turn to the opposite this.direction
               this.direction = newDir;

        }
    };

    this.setPath = function (path) {
        this.path = path;
        if(this.path) {
            this.stepIndex = path.length - 1;
        }
        else {
            this.stepIndex = 0;
        }

    };

    this.move = function () {
        if (this.stepIndex > 0){
            this.stepIndex--;
            var newPos = this.path[this.stepIndex];

            if (newPos.x < this.data[0].x)
                this.direction = LEFT;
            else if (newPos.x > this.data[0].x)
                this.direction = RIGHT;
            else if (newPos.y < this.data[0].y)
                this.direction = UP;
            else if (newPos.y > this.data[0].y)
                this.direction = DOWN;
        }
    };
    
    this.draw = function (ctx) {
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.moveTo(this.data[0].x*CELL_SIZE + CELL_SIZE/2, this.data[0].y*CELL_SIZE + CELL_SIZE/2);

        for (var i = 1; i < this.data.length; i++){
            ctx.lineTo((this.data[i].x * CELL_SIZE) + CELL_SIZE/2, (this.data[i].y * CELL_SIZE) + CELL_SIZE/2);
        }

        ctx.stroke();

    };

    this.update = function (wall, food) {
        if (autoMoving){
            this.move();
        }
        var x = this.data[0].x;
        var y = this.data[0].y;

        switch (this.direction){
            case LEFT:
                x--; break;
            case UP:
                y--; break;
            case RIGHT:
                x++; break;
            case DOWN:
                y++; break;
        }

        // Eat food: return 1
        if (x == food.x && y == food.y){
            this.data.unshift(food);
            return 1;
        }

        // Collide: return 2
        if (this.collide(x, y) || wall[x][y] == 1)
            return 2;

        // Snake move by adding the head
        this.data.unshift({x: x, y: y});
        // And cutting the tail
        this.data.pop();

        //Default: return 0;
        return 0;
    };

    this.collide = function (x, y) {
        if (x < 0 || x > mapCols - 1){
            return true;
        }
        if (y < 0 || y > mapRows - 1){
            return true;
        }

        return this.contain(x, y);
    };

    this.contain = function (x, y) {
        for (var i = 0; i < this.data.length; i++){
            if (x == this.data[i].x && y ==this.data[i].y)
                return true;
        }
        return false;
    };
}