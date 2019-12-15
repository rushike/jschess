
var sho = []

var drawer = null;

var WIDTH = 800
var COLOR = ["#F8ECEC", "#FFA500"];
var HEIGHT = 800

function set_height(y){
    HEIGHT = y;
}

function set_width(x){
    HEIGHT = x;
}

function set_dimen(i, j){
    WIDTH = i;
    HEIGHT = j;
}

function set_color(black, white){
    COLOR = [white, black];
    if(!drawer) drawer = new Drawer();
    drawer.init_feature();
}

cntrl_imges = []

function preload(){
    var i = 0, j = 0 , k = 0;
    var imf = createImage(100, 100);
    while(i < 6){
        sho[i] = loadImage('./img/' + i + ".png");
        sho[i + 8] = loadImage('./img/' + (i + 8) + ".png");
        // sho[i] = __PIECE_FN_SVG[i]
        i++;
    }
    while(i < 8){
        sho[i] = imf;
        sho[i + 8] = imf;
        i++;
    }
    
    cntrl_imges['undo'] = loadImage('./img/undo.png')
    cntrl_imges['redo'] = loadImage('./img/redo.png')
    cntrl_imges['undoone'] = loadImage('./img/undoone.png')

    if(!drawer) drawer = new Drawer();
}

function setup(){
    createCanvas(900, 800);
    if(!drawer) drawer = new Drawer()
    drawer.draw()
}

function draw(){

}




function mouseMoved(){
    // console.log("mouseMoved : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    // drawer.hold(mouseX, mouseY);
}

function mousePressed(){
    // console.log("mousePressed : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    drawer.clicked(mouseX, mouseY)
    drawer.draw()
}

function mouseClicked(){
    // console.log("mouseClicked : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
}

function touchStarted(){
    // loop();

    drawer.clicked(mouseX, mouseY)
    drawer.draw()
    // console.log("touchStarted : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
}

function touchMoved(){
    // console.log("touchMoved : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    
}

function touchEnd(){
    // console.log("touchEnd : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    
    // drawer.clicked(mouseX, mouseY)
    // drawer.draw()
}

// function mouseDragged(){
//     loop();
// }

function mouseReleased(){
    
    // drawer.clicked(mouseX, mouseY)
    // drawer.draw()
    // console.log("mouseReleased : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
}



class Drawer{
    constructor(){
        this.board = new Board();
        this.board_dimen = [WIDTH, HEIGHT]; // width;  height
        this.square_dimen = [this.board_dimen[0] >> 3, this.board_dimen[1] >> 3]
        this.color = COLOR //0 -- White;  1 -- Black
        this.highlight_color = "#FFF787" // Highlight color, It will be a circular spot in middle of square
        this.outline_squares = [] // It stores square(with x & y co - ordinates) to be highlight
        this.outline = 2 // It stores outline width in pixels
        this.c_sq_n = {x : 0, y : 0} //It will store the current square no clicked , in x, y 2D form 
        this.hold_flag = false;
    }

    init_feature(){ // Will not reint the board
        this.board_dimen = [WIDTH, HEIGHT]; // width;  height
        this.square_dimen = [this.board_dimen[0] >> 3, this.board_dimen[1] >> 3]
        this.color = COLOR //0 -- White;  1 -- Black
        this.highlight_color = "#FFF787" // Highlight color, It will be a circular spot in middle of square
    }
    set_c_sq_n(x, y){
        this.c_sq_n.x = x; this.c_sq_n.y = y;
    }
    set_highlight_color(hex_str){
        this.highlight_color = hex_str;
    }
    set_color(white, black){
        this.color[0] = white; this.color[1] = black;
    }
    set_board_dimen(width, height){
        this.board_dimen[0] = width;
        this.board_dimen[1] = height;
    }

    /**
     * Finds the position on canvas from , index on board, top - left coner origin
     * @param {number} i < 8
     * @param {number} j < 8
     */
    position(i, j){
        return {x : i * this.square_dimen[0], y : this.invert(j) * this.square_dimen[1] }
    }
    
    /**
     * Finds the index of square on board
     * @param {number} X 
     * @param {number} Y 
     */
    board_index(X, Y){
        return {x : Math.floor(X / this.square_dimen[0]), y : this.invert(Math.floor(Y / this.square_dimen[1])) }
    }

    invert(num, bits = 0){
        if(bits){
            var MASK = 1 << bits - 1
            return  ~num & MASK
        }else return ~num & 7
    }
    /**
     * Finds the position on canvas from , index on board, top - left coner origin
     * @param {number} i = 8
     * @param {number} 8 >= j >= 0
     */
    cntrl_area(i, j){
        return i == 8 && j <= 8 && j >= 0
    }

    /**
     * update the board on clicking on square
     * @param {number} i 
     * @param {number} j 
     */
    clicked(i, j){
        var c = this.board_index(i, j)
        i = c.x; j = c.y
        // console.log("clicked : i : ", i, ",  j : ", j)
        if(this.cntrl_area(i, j)) return this.register_cntrl_action(i, j)
        this.board.move(i, j, this.board.engine.turn)
        // console.log("calling valid moves .. . ")
        this.hold_flag = !this.hold_flag;
        // console.log("calling valid moves .. . ")
        this.board.valid_moves(i, j)
        // var e = new Engine(this.board.engine.EB)
        // var sc = e.()
        // console.log("EB : ", e.EB)
        // console.log("Score of board = ", sc)
        // var moves = e.get_all_moves(0)
        // console.log("all moves of white are : ", moves)
    }

    register_cntrl_action(i, j){
        if(i == 8 && j == 0)  return this.board.cntrl('undo')
        if(i == 8 && j == 1)  return this.board.cntrl('redo')
        if(i == 8 && j == 2)  return this.board.cntrl('undoone')
    }

    // hold(i, j){
    //     if(this){    
    //         var c = this.board_index(i, j)
    //         var piece_id = this.board.get_piece(c.x, c.y);
    //         image(sho[piece_id], i, j, this.square_dimen[0]- 30, this.square_dimen[1] - 30);
    //     }
    // }

    /**Drawer*/

    /**
     * 
     * @param {Square} sq 
     */
    draw_square(sq){
        var sq_pos = this.position(sq.sq.x, sq.sq.y);
        // console.log(sq.sq.x + " , " + sq.sq.y + " --> " + sq.sq_color())
        // console.log(sq.sq.x + " , " + sq.sq.y + " --> "); console.log(sq_pos)

        // Draw the square
        push();
        if(sq.sq_color() == 0) fill(this.color[0])// fill(248, 236, 236); //White
        else fill(this.color[1]);// fill(255, 165, 0);                     //Black
        if(this.outline_squares.includes({x: sq.sq.x, y: sq.sq.y})) this.outline();
        else rect(sq_pos.x, sq_pos.y, this.square_dimen[0], this.square_dimen[1]);
        pop();
        
        // Draw SquareName:
        this.texti(sq, sq_pos)

        // Draw Piece
        // console.log(ssq.sq.x + " , " + sq.sq.y + " --> " + sq.piece.piece_id); //console.log(sq_pos)
        image(sho[sq.piece.piece_id], sq_pos.x, sq_pos.y, this.square_dimen[0]- 30, this.square_dimen[1] - 30);


        
        //Draw Highligh On Piece
        // console.log("Attack flas : " + this.board.board[sq.sq.x][sq.sq.y].attack_flag )
        if(this.board.board[sq.sq.x][sq.sq.y].attack_flag) this.highlight(sq_pos);

    }

    draw_undo_redo_buttons(){
        var sq_pos = this.position(8, 8);
        // Draw the square
        push();
        // if(sq.sq_color() == 0) fill(this.color[0])// fill(248, 236, 236); //White
        fill(0);// fill(255, 165, 0);                    
        // if(this.outline_squares.includes({x: sq.sq.x, y: sq.sq.y})) this.outline();
        rect(sq_pos.x, sq_pos.y, this.square_dimen[0], this.square_dimen[1]);
        image(cntrl_imges['undo'], sq_pos.x, sq_pos.y, this.square_dimen[0]- 30, this.square_dimen[1] - 30);
        pop();

        var sq_pos = this.position(8, 9);
        // Draw the square
        push();
        // if(sq.sq_color() == 0) fill(this.color[0])// fill(248, 236, 236); //White
        fill(0);// fill(255, 165, 0);                    
        // if(this.outline_squares.includes({x: sq.sq.x, y: sq.sq.y})) this.outline();
        rect(sq_pos.x, sq_pos.y, this.square_dimen[0], this.square_dimen[1]);
        image(cntrl_imges['redo'], sq_pos.x, sq_pos.y, this.square_dimen[0]- 30, this.square_dimen[1] - 30);
        pop();

        var sq_pos = this.position(8, 10);
        // Draw the square
        push();
        // if(sq.sq_color() == 0) fill(this.color[0])// fill(248, 236, 236); //White
        fill(0);// fill(255, 165, 0);                    
        // if(this.outline_squares.includes({x: sq.sq.x, y: sq.sq.y})) this.outline();
        rect(sq_pos.x, sq_pos.y, this.square_dimen[0], this.square_dimen[1]);
        image(cntrl_imges['undoone'], sq_pos.x, sq_pos.y, this.square_dimen[0]- 30, this.square_dimen[1] - 30);
        pop();
    }

    draw_board(){
        clear();
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                this.draw_square(this.board.board[i][j])
            }
        }
    }

    draw_controller(){
        
        this.draw_undo_redo_buttons()
    }

    draw(){
        this.draw_board()
        this.draw_controller()
    }


    outline(bool = true){
        if(bool){
            push();
            strokeWeight(3);
            stroke(15);
            noFill();
            tint(255, 127);
            //rect(this.center.x, this.center.y, this.width, this.height);
            pop();
        }
    }

    texti(sq, sq_pos){

        push();
        // console.log("square name : "+ sq.name, sq_pos.x, sq_pos.y)
        var textit = createGraphics(this.square_dimen[0]- 30, this.square_dimen[1] - 30)
        // textit.background(0, 0, 0)
        textit.rect(0, 0, 25, 25)
        textit.textSize(25)
        textit.fill(64);
        textit.text(sq.name, 0 , 0);
        image(textit, sq_pos.x, sq_pos.y, this.square_dimen[0]- 30, this.square_dimen[1] - 30);
        pop();
    }

    highlight(sq, mark = true){
        if(mark) {
            // console.log("HHHHHHOOOOOOOOIIIIIIII : "); console.log(sq);
            
            push();
            // fill(color(this.highlight_color));
            strokeWeight(2);
            stroke(0);
            ellipse(sq.x + 50, sq.y + 50, 30, 30);
            tint(255, 70);
            pop();
        }
    }

}