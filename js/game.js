/**
 * Created by Tran Quang Khai on 8/14/2017.
 */
var CELL_SIZE = 10;
var FPS = 6;
var WIDTH = 400;
var HEIGHT = 400;
var MAX_PLAYER_LENGTH = 7;
var MAX_COM_LENGTH = 12;

function Game(canvas_id) {
    var _level = 1;
    var _score = 0;
    var _pressKey;
    var _cols = WIDTH/CELL_SIZE;    //40
    var _rows = HEIGHT/CELL_SIZE;   //40
    var _playerSnake = new Snake(_cols, _rows, "red", false);
    var _comSnake = new Snake(_cols, _rows, "blue", true);

    var _walls = [];
    var _canvas = document.getElementById(canvas_id);
    var _context = _canvas.getContext('2d');

    _context.fillStyle = "black";
    var _fps = FPS;

    var _food = {};     //Define object
    var _running = false;
    var _timer;
    var _bfs;
    
    this.init = function () {
        _canvas.width = WIDTH;
        _canvas.height = HEIGHT;

        _canvas.onkeydown = function (e) {
            e.preventDefault();
            if (e.keyCode == 13){      //Enter
                if(!_running)
                    startGame();
            }
            else if (_running){
                _pressKey = e.keyCode
            }

        };

        // Draw the Welcome Screen
        _context.textAlign = "center";
        _context.font = "36px Arial";
        _context.fillText("Snake v1.0", WIDTH/2, HEIGHT/3);
        _context.font = "16px Arial";
        _context.fillText("Press Enter to Start", WIDTH/2, HEIGHT/2);
    }

    function createMap() {
        for(var i = 0; i < _cols; i+=2){
            _walls[i]   = [];
            _walls[i+1] = [];

            for (var j = 0; j < _rows; j+=2){
                var val = (j > 4 && Math.floor(Math.random()*20) < 2) ? 1 : 0;
                _walls[i][j] = val;
                _walls[i][j+1] = val;
                _walls[i+1][j] = val;
                _walls[i+1][j+1] = val;
            }
        }
    }

    function startGame() {
        _pressKey = null;
        clearInterval(_timer);
        _fps = FPS + _level * 2;
        _playerSnake.init();
        _comSnake.init();
        createMap();

        //This object is used to find the path between 2 points
        _bfs = new BreadthFirstSearch(_walls, _cols, _rows);

        createFood();
        _running = true;
        _timer = setInterval(update, 1000/_fps);
    }

    function createFood() {
        var x = Math.floor(Math.random() * _cols);
        var y;
        do {
            y = Math.floor(Math.random() * _rows);
        } while (_walls[x][y] || _comSnake.contain(x, y) || _playerSnake.contain(x, y));

        _food = {x: x, y: y};
        //Find new path for the com player
        _comSnake.setPath(_bfs.findPath(_comSnake.data, _comSnake.getHead(), _food));
    }

    function update() {
        if (!_running){
            return;
        }

        _playerSnake.handKey(_pressKey);
        // Player has priority to eat
        var ret = _playerSnake.update(_walls, _food);

        if (ret == 1){  //Player eat food
            _score += _level * 2;
            createFood();
        }
        else if (ret == 2){ //Player collided with something
            if  (_score >= 0){
                _score -= _level*2;
                if (_score < 0)
                    _score = 0;
            }
            endGame();
            return;
        }
        else  {
            if (!_comSnake.path)
                _comSnake.setPath(_bfs.findPath(_comSnake.data, _comSnake.getHead(), _food), _food);

            ret = _comSnake.update(_walls, _food);
            if (ret == 1)   // Com player eat food
                createFood();
        }
        draw();

        //Player's snake reached the maximum length
        // so the game will start the next level
        if (_playerSnake.data.length == MAX_PLAYER_LENGTH){
            //Go to the next level
            _level ++;
            _score += _level*100;
            _running = false;

            _context.save();
            _context.fillStyle = "rgba (0, 0, 0, 0.2)";
            _context.fillRect(0, 0, WIDTH, HEIGHT);
            _context.restore();
            _context.fillStyle = "red";
            _context.textAlign = "center";
            _context.fillText("Press Enter to start the next level", WIDTH/2, HEIGHT/2);
            
        }
        else if (_comSnake.data.length == MAX_COM_LENGTH){
            endGame();
            return;
        }
    }
    
    function draw() {
        _context.beginPath();
        _context.clearRect(0, 0, WIDTH, HEIGHT);
        _context.fill();
        _context.lineWidth = CELL_SIZE;
        _context.lineCap = "round";
        _context.lineJoin = "round";

        _playerSnake.draw(_context);
        _comSnake.draw(_context);

        //Draw food
        _context.fillStyle = "green";
        _context.beginPath();
        _context.arc((_food.x*CELL_SIZE) + CELL_SIZE/2, (_food.y*CELL_SIZE) + CELL_SIZE/2, CELL_SIZE/2, 0, Math.PI*2, false);
        _context.fill();

        // Draw wall
        _context.fillStyle = "black";
        for (var i = 0; i < _cols; i++){
            for (var j = 0; j < _rows; j++){
                if (_walls[i][j]){
                    _context.fillRect(i*CELL_SIZE, j*CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        _context.textAlign = "left";
        _context.fillText("Level: " + _level, 10, 20);
        _context.fillText("Score: " + _score, 10, 40);
    }

    function endGame() {
        _running = false;
        _context.save();
        _context.fillStyle = "rgba (0, 0, 0, 0.2)";
        _context.fillRect(0, 0, WIDTH, HEIGHT);
        _context.restore();
        _context.fillStyle = "red";
        _context.textAlign = "center";
        _context.fillText("You lose! Press Enter to restart.", WIDTH/2, HEIGHT/2);
    }



}