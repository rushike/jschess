
var board;

var sho = [];

var mvs = [];

var et;

function preload(){
    var i = 0, j = 0 , k = 0;
    var imf = createImage(100, 100);
    while(i < 6){
        sho[i] = loadImage('img/' + i + ".png");
        sho[i + 8] = loadImage('img/' + (i + 8) + ".png");
        i++;
    }
    while(i < 8){
        sho[i] = imf;
        sho[i + 8] = imf;
        i++;
    }
}

function draw(){
    clear();
    board.show();
    board.dragon();
    board.promotion_box(board.promote_to);
}

function setup(){
    createCanvas(900, 800);
    board = new Board(800, 800);
    frameRate(5);
    noLoop();
    et = new PRI_ENGINE(Board.__CLASSIC());

    // var i = 0;
    // while(i < 64){
    //     mvs[i] = i;
    //     i++;
    // }
    // console.log("MVS: " + mvs);
}

function mouseMoved(){
    loop();
    var offset = 0;
    // console.log("mouseMoved : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
}

function mousePressed(){
    loop();
    var offset = 0;
    // console.log("mousePressed : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    board.mousePressed(mouseX, mouseY);
}

function mouseClicked(){
    loop();
    var offset = 0;
    // console.log("mouseClicked : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    board.mouseClicked(mouseX, mouseY);
    board.release(mouseX , mouseY);
    noLoop();
}

function touchStarted(){
    loop();
    var offset = 0;
    // console.log("touchStarted : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    board.ondragstart(mouseX, mouseY);
}

function touchMoved(){
    loop();
    var offset = 0;
    // console.log("touchMoved : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    board.drag(mouseX, mouseY);
}

function touchEnd(){
    noLoop();
    var offset = 0;
    // console.log("touchEnd : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    board.release(mouseX, mouseY);
}

// function mouseDragged(){
//     loop();
// }

function mouseReleased(){
    noLoop(); 
    var offset = 0;   
    // console.log("mouseReleased : Event Triggered. ... .. . .... ..");
    // console.log("Board.ondrag : " + board.ondrag);
    board.release(mouseX, mouseY);
    
}

class Board{
    static __CLASSIC(){
         return ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR',
                'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
                'X',  'X',  'X',  'X',  'X',  'X',  'X',  'X',
                'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' ,
                'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' ,
                'X',  'X',  'X',  'X',  'X',  'X',  'X',  'X',
                'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
                'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
                ];
    }

    static __STANDARD(){ 
        return ["A", "B", "C", "D", "E", "F", "G", "H",
                "1", "2", "3", "4", "5", "6", "7", "8"
                ] ;
    }

    constructor(width, height, center = createVector(0, 0), board = []){
        this.height = height;
        this.width = width;
        this.center = center;
        this.board_s = board;
        if(board.length != 64) this.ini();
        this.curr = new Square();
        this.bxen = 0;
        this.ondrag = false;
        this.released = true;
        this.promote = false;
        this.promote_to = 0; // also checks which player wants to promote
        this.promotion = [-1, -1];
        this.turn = 0
    }

    ini(){
        var i = 0;
        var classic = []; 
        classic = Board.__CLASSIC();
        while(i < 64){
            this.board_s[i] = new Square(i, new Piece(classic[i]));
            i++;
        }
    }

    /*
        TO display content on board.
    */
    show(){
        var i = 0;
        //console.log("Board:show - _curr : " + this.curr.toString());
        for(i = 0; i < 64; i++){
            this.board_s[i].draw();
        }
    }

    /**
     * Piece on square X is moved to square Y, incase replace if any.
     * @param {Square | Number} onX 
     * @param {Square | Number} onY 
     */
    move(onX, onY){

        //this.board_s[3].set_piece(this.board_s[59].piece);

        console.log("move called ............onX : " + onX + " to OnY :" + onY);
        //this.promote_to > 0 && this.promote_to < 5) || (this.promote_to > 8 && this.promote_to < 13

        if(typeof onX === 'object' && typeof onY === 'object'){
            onY.piece.set(onX.piece);
            onX.piece = new Piece();
            return true;
        }else if(typeof onX === 'number' && typeof onY === 'number'){
            console.log("NO_PIECE :  " + this.NO_PIECE(this.board_s[onX].piece) +  "SAME_PLAYER_PIECE : " + this.SAME_PLAYER_PIECE(onX, onY) );
            if((this.promote_to > 0 && this.promote_to < 5) || (this.promote_to > 8 && this.promote_to < 13)) {
                var piec = Piece.__PIECES();
                if(this.promote_to < 5)
                    this.board_s[onY].set_piece(new Piece(piec[this.promote_to], "WHITE"));
                else this.board_s[onY].set_piece(new Piece(piec[this.promote_to], "BLACK"));
                console.log("Piece set ............... ----------------- ...................  : " + this.board_s[onX]);
                console.log(">>>>>>>>>>>>>>> piec + " + piec[this.promote_to] + " <<<<<<<<< promote to :" + this.promote_to);
                this.promote = false;
                this.promote_to = 0;
                console.log("Change piece .................. > -------- - " + this.board_s[onY]);
            }

            if(this._rank(onY, this.board_s[onX].piece.no) == 7 && !this.promote){
                if( this.board_s[onX].piece.no == 5 || this.board_s[onX].piece.no == 13){
                    this.promote = true;
                    console.log("PROMOTION BOX L RANK KKK K......................................... .. " + this.board_s[onX].piece.no);
                    this.promotion_box(this.board_s[onX].piece.no);
                }
            }
            
            if(!this.NO_PIECE(this.board_s[onX].piece) && !this.SAME_PLAYER_PIECE(onX, onY)){
                this.board_s[onY].set_piece(this.board_s[onX].piece);
                this.board_s[onX].set_piece(new Piece());
                return true;
            }
        }else{
            console.log("Need to think ... ");
        }   
        return false;
    }

    /**
     * returns rank of piece, relative black_piece_rank = | 7 - white_piece_rank |
     * @param {number} sq_n 
     */
    _rank(sq_n, pi_no){
        if(pi_no < 8) return (sq_n >>> 3);
        else return Math.abs((sq_n >>> 3) - 7 );
    }

    /**
     * 
     * @param {number} curr 
     * @param {Array} arr 
     */
    can_move(curr, arr){
        var i;
        for(i = 0; i < arr.length; i++){
            if(arr[i] == curr) return true;
        }return false;
    }
    /**
     * Checks if squares on board has same pieces. 
     * @param {number} pie1 
     * @param {number} pie2 
     */
    SAME_PLAYER_PIECE(pie1, pie2){
        return this.board_s[pie1].same_player(this.board_s[pie2]);
    }

    /**
     * return boolean value true if 'piece' is NO_PIECE or ANY_THING
     * @param {Piece} piece 
     */
    NO_PIECE(piece){
        return piece.name === "X" || piece.name ==="bX" || piece.name ==="wX";
    }



    /*
    GUI dependent don't rely much
    */

    SQUARE(x, y){
        var _x = (int)(x * 8 / this.width);
        var _y = (int)(y * 8 / this.height);
        return (int)((_y - 7) * -8 + _x);
    }


    /*
        Events ...  
    */
    dragon(){
        image(board.curr.piece.img, mouseX - 50, mouseY - 50, 112, 112);
    }
    mousePressed(x, y){
        // console.log("Board:mousePressed --- Event  ... .. . .... .. _ondrag : " + this.ondrag + " ___x :" + x + "  ___y : " + y);
        // console.log("MouseX : " + mouseX + " , MouseY : " + mouseY);
        if(x > 0 && y > 0 && x < this.width && y < this.height && !this.ondrag && !this.promote){
            //console.log("Board:mousePressed ---> Event Triggered. ... .. . .... ..");
            //console.log("Board:mousePressed= $mvs : " + mvs);
            // console.log("MouseX : " + mouseX + " , MouseY : " + mouseY);
            var square = this.SQUARE(x, y);
            //console.log("Square no : " + square);
            if(this.board_s[square].piece.no < 8){
                if(this.turn == 0)
                    this.curr.set(this.board_s[square]);
                else this.curr.set(new Square());
            }else {
                if(this.turn == 8)
                    this.curr.set(this.board_s[square]);
                else this.curr.set(new Square());
            } 
            
            //console.log("Board:mousePressed - _curr : " + this.curr);
            this.bxen = square;
            this.board_s[square].outline(true);
            this.ondrag = false;
            this.highlight_for(false);
            mvs = [];
            this.released = false;  
        }else if(mouseX > 800 && mouseY > 0 && mouseX < 900 && mouseY < 400){
            var pe = (int)(mouseY / 100 + 1 + this.promote_to);
            this.promote_to = pe;
            // console.log("Board:mousePressed ..  setting : promotre_to : " + pe);
        }
    }
    mouseClicked(x, y){
        if(x > 0 && y > 0 && x < this.width && y < this.height && !mouseIsPressed && !this.ondrag && !this.promote){
            this.mousePressed(x, y);
            this.release(x, y);
        }
    }
    ondragstart(x, y){
        if(!this.ondrag){
            //console.log("Board:ondragstart ---> Event Triggered. ... .. . .... ..");
            this.mousePressed(x, y);
            this.ondrag = true;
        }
    }
    drag(x, y){
        this.ondragstart(x, y);
        if(x > 0 && y > 0 && x < this.width && y < this.height && !this.promote){
            //console.log("Board:drag --> Event Triggered. ... .. . .... ..");
            var square = this.SQUARE(x, y);
            this.bxen = square;
            image(this.curr.piece.img, x - 50, y - 50, 112, 112); 
            this.ondrag = true;
        }else console.log("Out Of bound ... won't effect on board");
    }
    release(x, y){
        if(x > 0 && y > 0 && x < this.width && y < this.height && !this.released && !this.promote){
            //console.log("Board:release --> Event Triggered. ... .. . .... ..");
            var square = this.SQUARE(x, y);
            this.ondrag = false;
            this.board_s[square].outline(false);
            var bs = this.curr.no;
            et.set(this.toarray());
            mvs = et._valid_moves(this.curr.no, this.curr.piece.name);
            // console.log("mvs board : " + mvs);
            // console.log("square "+ square+ "   bs " + bs);
            // console.log("can_move : " + this.can_move(square, mvs));
            this.highlight_for(true);
            this.promotion = [bs, square];
            if(this.can_move(square, mvs)){
                if(this.move(bs, square)) {
                    this.highlight_for(false);
                } this.turn = (this.turn + 8 ) & 0xf;
            }
            this.released = true;
            this.curr = new Square();
            //console.log("Board:release= $mvs : " + mvs);
        }else if(this.promote){
            if((this.promote_to > 0 && this.promote_to < 5) || (this.promote_to > 8 && this.promote_to < 13)){
                this.move(this.promotion[0], this.promotion[1]);
                this.ondrag = false;
            }
        }
        else console.log("Out Of bound ... won't effect on board");
    }

    toarray(){
        var arr = [], i;
        for(i = 0; i < this.board_s.length; i++){
            arr[i] = this.board_s[i].piece.name;
        }return arr;
    }

    /**
     * return promotion piece value
     * @param {number} player 0 for white and 8 for Black 
     */
    promotion_box(player){
        if(this.promote){
            //draw rectangle 100 * 400 width
            // push();
            // fill("#FFFFCA");
            // stroke(0);
            // strokeWeight(3);
            // rect(this.width, 0, 100, 400);
            // pop();
            console.log("INSIDES PROMOTION BOX::::::::::::::::::::::::::::::::::::::::::::");
            if(player >= 8) player = 8;
            else player = 0;

            this.promote_to = player;

            for(var i = 0; i < 4; i++){
                //draw small square;
                push();
                fill("#9FFFB3");
                stroke(0);
                strokeWeight(4);
                rect(this.width, i * 100, 100, 100);
                pop();

                push();
                image(sho[i + player + 1], this.width + 20, i * 100 + 20, 70, 70);
                pop();
            }
        }
        
    }

    /**
     * 
     * @param {boolean} bool 
     */
    highlight_for(bool){
        //console.log("Board:highlight_for  $mvs : " + mvs);
        for(var j = 0; j < mvs.length; j++){
            this.board_s[mvs[j]].isHighlighted = bool;
            //else this.board_s[i].isHighlighted = !bool;
        }
    }
}

class Piece{
    static __PIECES(){
        return  ["wK", "wQ", "wR", "wB", "wN", "wP", "wX", "WRE", "bK", "bQ", "bR", "bB", "bN", "bP", "bX", "BRE"];
    }

    static __UNICODE_PIECES(){
        return["\u265a", "\u265b", "\u265c", "\u265d", "\u265e", "\u265f", "\u0020", "\u090b", "\u2654", "\u2655",  "\u2656",  "\u2657",  "\u2658",  "\u2659",  "\u0020",  "\u090b"];
    }

    constructor(name = "X", type = "T:X"){
        this.name = name;
        this.type = type;
        this.PLAYER();
        this.no = this.NO(name);
        this.img = sho[this.no];
    }

    /**
     * return player INFO BLACK or WHITE piece belong to
     */
    PLAYER(){
        if(this.name.charAt(0) === "b"){
            this.PLAYER = "BLACK";
        }else if(this.name.charAt(0) === "w"){
            this.player = "WHITE";
        }else this.player = "P:X";
    }

    /**
     * return ini_ position of piece on classic board 
     */
    NO(nam){
        var i = 0;
        var pieces = Piece.__PIECES();
        var unicode_pieces = Piece.__UNICODE_PIECES();
        if(nam === "X" || nam === "bX" || nam === "wX"){
            this.uni = unicode_pieces[6];
            return 6;
        } else {
            while(i < 14){
                if(nam === pieces[i]){
                    this.uni = unicode_pieces[i];
                    return i;
                }i++;
                if(i == 6) i = 8;
            }return 6;
        }
    }

    set(pie){
        if(typeof pie === 'object' && pie instanceof Piece){
            this.name = pie.name;
            this.player = pie.player;
            this.no = pie.no;
            this.img = pie.img;
            this.type = pie.type;
            this.uni = pie.uni;
        }else console.log("Else in Piece : not a object or Piece objject");
    }

    /**
     * 
     * @param {number} x X-axis co-ordinate 
     * @param {number} y Y-axis co-ordinate
     * @param {number} width 
     * @param {number} height 
     * @param {Array} options settings 
     */
    draw(x, y, width, height, options){
        image(this.img, x, y, width - 30, height - 30);
    }

    ini_piece(ce){
        var pie = Piece.__UNICODE_PIECES();
        textSize(33);
        text(pie[this.no],ce.x + 30, ce.y + 30);
    }

    set_type(type){
        if(typeof type == "number"){
            if((type & 1) == 0) this.type = "T:BLACK";
            else this.type = "T:WHITE";
        }else this.type = type;
    }

    set_player(ini_n){
        if(ini_n < 16) this.player = "WHITE";
        else if(ini_n < 48) this.player = "X";
        else this.player = "BLACK";
    }

    set_piece(te){
        this.type = te;
    }
    
    /**
     * return true if pieces of same player
     * @param {Piece} piece_ 
     */
    same_player(piece_){
        return this.player === piece_.player;
    }

}

class Square{


    constructor(no = 64, piece = new Piece(), width = 100, height = 100){
        this.no = no;
        this.piece = piece;
        this.piece.set_type(this.TYPE(no));
        this.width = width;
        this.height = height;
        this.center = this.POSITION(no);
        this.name = this.NAME();
        this.isHighlighted = false;
        this.isOutlined = false;
        this.WHITE = "#F8ECEC";
        this.BLACK = "#FFA500";
        this.highlight_color = "#FFF787";
    }

    draw(){
        //First Draw rectangle.
        push();
        if(((this.X() + this.Y()) & 1) == 1)fill(248, 236, 236);
        else fill(255, 165, 0); 
        if(this.isOutlined) this.outline();
        else rect(this.center.x, this.center.y, this.width, this.height);
        pop();

        //Draw SquareName:
        push();
        fill(0);
        text(this.NAME(), this.center.x + 10, this.center.y + this.height - 10);
        pop();

        //Draw PieceImage 
        this.piece.draw(this.center.x, this.center.y, this.width, this.height);
        
        //Draw Highligh On Piece
        this.highlight();
    }
    
    POSITION(){
        return createVector(this.X() * this.width, ((this.Y() - 7) * -1) * this.height);
    }

    /**
     * Name of square in standard format: a8, g6, h5, etc
     */
    NAME(){
        var std = Board.__STANDARD();
        return std[this.X()] +  std[this.Y() + 8];
    }

    TYPE(no){
        if((no & 1) == 1) return "WHITE";
        else return "BLACK";
    }

    /**
     * Returns X co-ordinate of piece on virtual board
     */
    X(){
        return this.no & 7;
    }
    /**
     * Returns Y co-ordiates of piece on virtual board
     */
    Y(){
        return this.no >>> 3;
    }

    outline(bool){
        if(bool){
            push();
            strokeWeight(3);
            stroke(15);
            noFill();
            tint(255, 127);
            //rect(this.center.x, this.center.y, this.width, this.height);
            pop();
        }
        // else {
        //     strokeWeight(1);
        //     stroke(1);
        //     this.draw();
        // }
    }

    highlight(){
        //console.log("HighLighted : " + this.isHighlighted);
        if(this.isHighlighted) {
            //console.log("SQ : " + this.no);
            push();
            fill(color(this.highlight_color));
            strokeWeight(2);
            stroke(0);
            ellipse(this.center.x + 50, this.center.y + 50, 30, 30);
            tint(255, 70);
            pop();
        }
    }

    /**
     * 
     * @param {Square} curr 
     */
    set(curr){
        this.no = curr.no;
        this.piece.set(curr.piece);
        this.width = curr.width;
        this.height = curr.height;
        this.center.set(curr.center);
        this.name = curr.NAME(); 
    }
    
    /**
     * 
     * @param {Square} pie 
     */
    set_piece_of(pie){
        this.piece.set(pie.piece);
    }

    /**
     * 
     * @param {Piece} piece 
     */
    set_piece(piece){
        this.piece.set(piece);
    }
    set_type(te){
        this.piece.type = te;
    }

    /**
     * 
     * @param {Square} sqr 
     */
    same_player(sqr){
        return this.piece.same_player(sqr.piece);
    }
}

class Center{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
    set(x = 0, y = 0){
        if(typeof x === 'object' && x instanceof Center){
            this.x = x.x;
            this.y = x.y;
            if(typeof y ==='number'){
                this.x = this.x + y;
                this.y = this.y + y;
            }
        }else{
            this.x = x;
            this.y = y;
        }
    }
    
}


Board.prototype.toString = function toString(){
    var arr = [], i;
    for(i = 0; i < this.board_s.length; i++){
        arr[i] = this.board_s[i].piece.name;
    }return arr;
}

Square.prototype.toString = function toString(){
    return "Name : " + this.name + ", No : " + this.no + ",\n Piece : " + this.piece +"\n" ; 
}

Piece.prototype.toString = function toString(){
    return "Name : " + this.name + ", No. " + this.no + ", Player : " + this.player + "\n";
}