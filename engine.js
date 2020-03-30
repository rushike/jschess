
const version = "0.1.0";

/**
 *  Vertical  Representation used x88
 *  wR wP -- -- -- -- bP bR
 *  wN wP -- -- -- -- bP bN
 *  wB wP -- -- -- -- bP bB
 *  wK wP -- -- -- -- bP bK
 *  wQ wP -- -- -- -- bP bQ
 *  wB wP -- -- -- -- bP bB
 *  wN wP -- -- -- -- bP bN
 *  wR wP -- -- -- -- bP bR
 *  ....
 *  ...
 *  .
 *  8
 *  .
 *  .
 *  ..
 *  ...
 * 
 *  Board class translates it to horizontal one, by replacing : x <--> y
 * 
 * @ignore_above
 * 
 *  Y
 *  ^
 *  |
 *  |
 *  |
 *  |__________________> X
 * 
 *  x --> coloums ==> files
 *  y --> rows    ==> ranks
 *  
 * 
 * 
 * 
 */


/**
* Length : 64
* Contains INT value of which only 10 used for now
* First 6 from LSB for representation of square, so th E can place any where on board
* Second 4  [6, 10) for piece representation.
* Instruction Format
* |sign_bit|  [ EMPTY_INVALID_BITS]  | influence_int | |   file    | | peices_info[0-16] |
*    31            30  ... 17           17 ... 7          7 ... 4          4 ... 0 
* @file
* 3 bits to identify the file on board
*  
* @EMPTY_INVALID_BITS 
* 14 bits not assign anything [17, 31);
* 
* @influence_int
* 10 bit number forming sign int [-511 , 0 , 511] 1023 nums
* negative for black influence and vice versa
* 
* @piecesinfo
* Piece def 
* 0000 0  white_king
* 0001 1  white_queen
* 0010 2  white_rook
* 0011 3  white_bishop
* 0100 4  white_knight
* 0101 5  white_pawn
* 0110 6  _no_piece
* 0111 7  _invalid
* 1000 8  black_king
* 1001 9  black_queen
* 1010 10 black_rook
* 1011 11 black_bishop
* 1100 12 black_knight
* 1101 13 black_pawn
* 1110 14 __no_piece
* 1111 15 __invalid 
*
* @direction_info
*    6      4      2
*     \  5__|__3  /
*      \    |   /
*    7   \  |  /  1
* 8__|____ \|/____|__ 0 
*    |     /|\    |
*    9    / |  \  15
*       /11_|_13 \
*     /     |      \
*   10     12       14
* Total 16 direction considered
*
*
*
* @player_info
* pl_type  =   0 ..... 1 .....  3   .......   4 
* string     white   black    Empty        Invalid
*/

const __PIECES_STD = [];
__PIECES_STD["wK"] = 0; __PIECES_STD["wQ"] = 1; __PIECES_STD["wR"] = 2; __PIECES_STD["wB"] = 3; __PIECES_STD["wN"] = 4; __PIECES_STD["wP"] = 5; __PIECES_STD["X"] = 6;
__PIECES_STD["bK"] = 8; __PIECES_STD["bQ"] = 9; __PIECES_STD["bR"] = 10; __PIECES_STD["bB"] = 11; __PIECES_STD["bN"] = 12; __PIECES_STD["bP"] = 13;

const __PIECES_ID = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const BOARD_MASK = 0x8

const PIECE_MASK = 0xF

const PIECE_INFO_MASK = 0x7F

const PIECE_INFO_BITS = 7

const PIECE_BITS = 4

const x88_MASK = 0x7F

const x88_MOVE_BITS = 14

const x88_MOVE_MASK = 0x3FFF

const x88_BITS = 7

const DEAD = 0x8 // Square number 8 represents DEAD piece

const DIR_OFF_INV = 0

const EMPTY_SQ_TYPE = 2

const EMPTY_SQ = 6

const INVALID_SQ = 7

/**
* store number value for piece, max it can go in any one direction
*/
const __RANGE = {
KING : 1,
QUEEN : 8,
ROOK : 8,
BISHOP : 8,
HORSE : 1,
PAWN : 1, 
DEFAULT : 8,
};

const __BORANK = [ [0b000, 0b001], //WHITE
                    [0b111, 0b110] ] //BLACK

const __RANGE_ARR = [1, 8, 8, 8, 1, 1, 8, 0, 1, 8, 8, 8, 1, 1, 8, 0];

const __DIRECTION = {
    KING : [0, 2, 4, 6 ,8 ,10 ,12, 14],
    QUEEN : [0, 2, 4, 6 ,8 ,10 ,12, 14],
    ROOK : [0, 4, 8, 12],
    BISHOP : [2, 6, 10, 14],
    HORSE : [1, 3, 5, 7, 9, 11, 13, 15],
    PAWN : [2, 4, 6],
    DEFAULT : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
};



const __DIR_LENGTH = {
    KING : 8,
    QUEEN : 8,
    ROOK : 4,
    BISHOP : 4,
    HORSE : 8,
    PAWN : 3,
    DEFAULT : 16,
}

const __HORSE_MOVES_OFFSET = [0x12, 0x21, 0x1F, 0x0E, -0x12, -0x21, -0x1F, -0x0E]

const __DIR_OFFFSET_M = {
    KING : [0x01, 0,  0x11, 0, 0x10, 0, 0x0F, 0, -0x01, 0, -0x11, 0,  -0x10, 0, -0x0F, 0],
    QUEEN : [0x01, 0, 0x11, 0, 0x10, 0, 0x0F, 0, -0x01, 0, -0x11, 0, -0x10, 0, -0x0F, 0],
    ROOK : [0x01, 0,  0, 0, 0x10, 0, 0, 0, -0x01, 0, 0, 0, -0x10, 0, 0, 0],
    BISHOP : [0, 0, 0x11, 0, 0, 0,  0x0F, 0, 0, 0,  -0x11, 0, 0, 0, -0x0F, 0],
    HORSE : [0, 0x12, 0, 0x21, 0, 0x1F, 0, 0x0E, 0, -0x12, 0, -0x21, 0, -0x1F, 0, -0x0E],
    PAWN : [0, 0, 0x11, 0, 0x10, 0, 0x0F, 0, 0, 0, 0, 0, 0, 0, 0, ],
    DEFAULT : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
}


const __DIR_OFFFSET = {
    KING : [0x01, 0x11, 0x10, 0x0F, -0x01, -0x11, -0x10, -0x0F],
    QUEEN : [0x01, 0x11, 0x10, 0x0F, -0x01, -0x11, -0x10, -0x0F],
    ROOK : [0x01, 0x10, -0x01, -0x10],
    BISHOP : [0x11, 0x0F, -0x11, -0x0F],
    HORSE : [0x12, 0x21, 0x1F, 0x0E, -0x12, -0x21, -0x1F, -0x0E],
    PAWN : [0, 0x11, 0x10, 0x0F],
    DEFAULT : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
}

const __DIR_OFFFSET_ARR = [__DIR_OFFFSET.KING, __DIR_OFFFSET.QUEEN, __DIR_OFFFSET.ROOK, __DIR_OFFFSET.BISHOP, __DIR_OFFFSET.HORSE, __DIR_OFFFSET.PAWN, __DIR_OFFFSET.DEFAULT, [], 
                           __DIR_OFFFSET.KING, __DIR_OFFFSET.QUEEN, __DIR_OFFFSET.ROOK, __DIR_OFFFSET.BISHOP, __DIR_OFFFSET.HORSE, __DIR_OFFFSET.PAWN, __DIR_OFFFSET.DEFAULT, []]

const __P_RANK = [0x1, 0x6]

const __DIRECTION_ARR = [__DIRECTION.KING, __DIRECTION.QUEEN, __DIRECTION.ROOK, __DIRECTION.BISHOP, __DIRECTION.HORSE, __DIRECTION.PAWN, __DIRECTION.DEFAULT, [],
                        __DIRECTION.KING, __DIRECTION.QUEEN, __DIRECTION.ROOK, __DIRECTION.BISHOP, __DIRECTION.HORSE, __DIRECTION.PAWN, __DIRECTION.DEFAULT, []];

// const __PIECE_VALUE = [255, 9, 5, 3, 3, 1, 0, 0, 767, 521, 517, 515, 515, 513, 0, 0];
const __PIECE_VALUE = [1048756, 127, 64, 47, 47, 23, 0, 0, -1048756, -127, -64, -47, -47, -23, 0, 0];
// const __CAPIECE_VALUE = [1, 2, 5, 3, 3, 1, 0, 0, -255, -9, -5, -3, -3, -1, 0, 0];


const PIECE_VALUE_MASK = 0x1ff

const __PIECE_SQ = null

const __PIECE_INFL = [1, 3, 5, 7, 7, 9, 0, 0, 513, 515, 517, 519, 519, 521, 0, 0];

const __PIECE = ["wK", "wQ", "wR", "wB", "wN", "wP", "X", "RE", "bK", "bQ", "bR", "bB", "bN", "bP", "X", "RE"];

const __CLASSIC = [['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
            ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
            ['X',  'X',  'X',  'X',  'X',  'X',  'X',  'X'],
            ['X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X'],
            ['X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X'] ,
            ['X',  'X',  'X',  'X',  'X',  'X',  'X',  'X'],
            ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
            ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR']
            ];

const __x88 = [/* Piece Info */ 2, 4, 3, 1, 0, 3, 4, 2, /* Sq Info */ 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, // |  | |__| | ""|"" |_"_" 
             /* Piece Info */ 5, 5, 5, 5, 5, 5, 5, 5, /* Sq Info */ 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,   // |/\| |  | |   |   |__ 

             /* Piece Info */ 6, 6, 6, 6, 6, 6, 6, 6, /* Sq Info */ 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08,
             /* Piece Info */ 6, 6, 6, 6, 6, 6, 6, 6, /* Sq Info */ 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08,
             /* Piece Info */ 6, 6, 6, 6, 6, 6, 6, 6, /* Sq Info */ 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08,
             /* Piece Info */ 6, 6, 6, 6, 6, 6, 6, 6, /* Sq Info */ 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08,

             /* Piece Info */ 13, 13, 13, 13, 13, 13, 13, 13, /* Sq Info */ 0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, // |__\ |    /\  |"" |/
             /* Piece Info */ 10, 12, 11,  9,  8, 11, 12, 10, /* Sq Info */ 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, // |__/ |__ /  \ |__ |\  
             ]

const __STANDARD =  [["A", "B", "C", "D", "E", "F", "G", "H"],
                        ["1", "2", "3", "4", "5", "6", "7", "8"]
                     ];
const __BTYPE_MOD = []
__BTYPE_MOD['x88'] = 16; __BTYPE_MOD['NORMAL'] = 8; 

const __STYLE = []
__STYLE["CLASSIC"] = __CLASSIC


const FUNCTION_START = "__________________________________________________\nProcess Start\n__________________________________________________";
const FUNCTION_END = "__________________________________________________\nProcess End\n__________________________________________________";



class Piece{
    constructor(piece){
        if(typeof(piece) == 'string'){
            if(!__PIECE.includes(piece)) return
            this.piece_id = __PIECES_STD[piece]
            this.name = piece
        }else if(typeof(piece) == 'number'){
            if(!__PIECES_ID.includes(piece)) return
            this.piece_id = piece
            this.name = __PIECE[piece]
        }
    }

    update_piece_id(piece){
        if(typeof(piece) == 'number'){
            piece &= 0xF // Piece is only stores in LSB 4 digit 
            if(!__PIECES_ID.includes(piece)) return
            // console.log("UUUUUUUUUUUUUU : "  + piece)
            this.piece_id = piece
            this.name = __PIECE[piece]
        }
    }
}

class Square{

    /**
     * 
     * @param {number} i row 
     * @param {number} j column
     * @param {number} num returns index value of square in 0x88 format
     */
    static x88sqno(i, j){
        return ((i << 4) + j) & 0x7F
    }

    static x88_v40sqno(sq_n){
        var c = {x : sq_n % 16, y :Math.floor(sq_n / 16) }
        if(c.y > 7) throw ErrorEvent("Invalid Parameters")
        return c
    }

    /**
     * 
     * @param {number} i 
     * @param {number} j 
     * @returns string representation of square
     */
    static sq_name(i, j = null, type = 'NORMAL'){
        if(j == null){
            var MOD = __BTYPE_MOD[type]
            j = i % MOD;
            i = Math.floor(i / MOD);
        }
        return __STANDARD[0][j] + __STANDARD[1][i]
    }
    constructor(i, j, piece, attack_flag = 0){
        this.sq = {x : j, y : i}
        this.name = this.sq_name(i, j)
        this.piece = piece
        this.attack_flag = attack_flag
    }

    /**
     * 
     * @param {number} i 
     * @param {number} j 
     * @returns string representation of square
     */
    sq_name(i, j = null, type = 'NORMAL'){
        if(j == null){
            var MOD = __BTYPE_MOD[type]
            i = i % MOD;
            j = Math.floor(j / MOD);
        }
        return __STANDARD[0][j] + __STANDARD[1][i]
    }

    set_piece_id(piece_id){
        
    }

    /**
     * returns the square color, White --> 0;   Black --> 1
     * @param {string} type 
     */
    static sq_color(i, j, type = 'NORMAL'){
        return ~((i & 1) ^ (j & 1))
    }

    sq_color(type = 'NORMAL'){
        return ~((this.sq.x & 1) ^ (this.sq.y & 1)) & 1
    }



}

class Board{
    constructor(style = 'CLASSIC'){
        this.board = array2D(8, 8)
        this.style = style
        this.init()
        this.v_moves = []
        this.engine = new Engine()
        this.computer = 0 // Black
    }

    init(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                this.board[i][j] = new Square(i, j, new Piece(__STYLE[this.style][i][j]))
            }   
        }
    }

    get_piece(j, i){
        return this.board[i][j].piece_id;
    }

    get_square(j, i){
        return this.board[i][j];
    }

    clear_flag(array = null){
        if(array){
            this.v_moves.forEach(c =>{
                this.board[c.x][c.y].attack_flag = 0
            });
        }
    }

    valid_moves(j, i){ // i : x  ; j : y
        this.clear_flag(this.v_moves)
        var moves = this.engine.valid_moves(Square.x88sqno(i, j), null, this.engine.turn, true)
        this.v_moves = this.to_visual_array(moves)
        this.v_moves.forEach(c =>{
            this.board[c.x][c.y].attack_flag = 1
        });
        return this.v_moves;
    }


    move_black(){
        var black_engine = new Engine(this.engine.EB, 1);
        var sq = black_engine.next_move(null, null, 2);
        console.log("sq : ", sq)
        return sq;
    }

    move(n_j, n_i, turn = 0){
        // console.log("turn now : ", this.engine.turn);
        // console.log("val_moves : ", this.val_moves)
        var moved = this.engine.move(Square.x88sqno(n_i, n_j), null, this.val_moves)
        // console.log("white moved : ", this.engine.turn);
        this.update()
        return  moved;

        // if(moved) {
        //     var mv = this.move_black();
        //     console.log("Engine Board : ", this.engine.EB)
        //     var moved =  this.engine.move(mv.sq_n, mv.n_sq_n, null, true)
        //     console.log("moved : ", moved);
        //     console.log("black moved : ", this.engine.turn);
        //     // this.engine.turn = this.engine.turn;//this.engine.invert(this.engine.turn, 1); // Updating outside the engine 
        //     this.update();
        // }

    }

    next_move(n_j, n_i){
        var mv = this.engine.next_move(Square.x88sqno(n_i, n_j), null, 1, this.engine.turn);
        // console.log("next move is : ", mv);
        this.engine.sq_n = mv.sq_n;
        // this.engine.valid_moves(mv.sq_n, null, this.engine.turn, true, false)
        this.engine.move(mv.n_sq_n, null, null, true);
        // move
        return mv
    }
    update(){
        for(var i = 0; i < 128; i++){
            var c = Square.x88_v40sqno(i);
            if(c.x < 8){
                // console.log("/c : " + c.x + " , " + c.y)
                // console.log(this.engine.EB[i])
                this.board[c.y][c.x].piece.update_piece_id(this.engine.EB[i]) //Vertical Representation ; so this.board[c.y][c.x]
            }
            
        }
        // console.log("EB : ", this.engine.EB.map(a=> a&15))
    }

    cntrl(action){
        // console.log("ACTION  : ", action)
        if(action == 'undo'){
            this.engine.undo()
        }else if(action == 'redo'){
            this.engine.redo()
        }else if(action == 'undoone'){
            this.engine.undo_one()
        }else {
            //Do nothing
        }this.update()
        // console.log("cntrl : EB ", this.engine.EB)
    }


    /**
     * 
     * @param {Array} board1D 
     */
    to_visual_array(board1D){
        var squares = [];
        for(var i = 0; i < board1D.length; i++){
            squares.push(Square.x88_v40sqno(board1D[i]));
        }return squares;
    }

    /**
     * To x88 Chess Board Representation
     */
    to_engine_board(){
        var enboard = array2D(8, 16 , 0)
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                enboard[Square.x88sqno(i, j)] = j << 4 | this.board[i][j].piece.piece_id
            }
        }
        return enboard
    }
}


class Engine{
    constructor(EB, turn = 0){
        if(EB != null) this.EB = [...EB]     //  Electronic Board x88 format
        else this.init()
        
        
        this.p_sq_n = null     //  This is for undo  and redo      
        this.n_p_sq_n = null   //  operation one move only
        
        this.sq_n = null

        this.val_moves = []

        this.hist_move = []

        this.future_move = []

        this.computer = 1

        this.turn = turn
    }

    init(){
        this.EB = Array(128).fill(0)
        for(var i = 0; i < 128; i++){
            var file = i & 0xF;
            if(file < 8) this.EB[i] = file << 4 | __x88[i] // Setting File info along with piece_id on main board 
            else this.EB[i] = __x88[i]
        }
        this.turn = 0 // White turn
    }

    init_pieces(){
        for(var i = 0; i < 128; i++){
            var file = i & 0xF;
            if(this.piece_area(i)){
                this.EB[i] = file << 4 | __x88[i]
            }
        }
        this.turn = 0 // White turn
    }

    init_sq(){
        for(var i = 0; i < 128; i++){
            if(!this.piece_area(i)){
                this.EB[i] = __x88[i]
            }
        }
        this.turn = 0 // White turn
    }

    set(board){
        this.EB = board.to_engine_board();
    }

    /**
     * returns rank of piece, relative black_piece_rank = | 7 - white_piece_rank |
     * @param {number} sq_n encoded in Int32
     */
    rank(sq_n){
        if(!isFinite(sq_n)) return null
        if(!this.piece_area(sq_n)) return null
        else return sq_n >> 4;
    }

    /**
     * 
     * @param {number} num 
     * @param {number} bits 
     */
    invert(num, bits = 0){
        if(bits){
            var MASK = 1 << bits - 1
            return  ~num & MASK
        }else return ~num & 7
    }


    /**
     * returns if piece info is present in that part of board
     * @param {number} sq_n
     */
    piece_area(sq_n){
        return (sq_n & BOARD_MASK) == 0
    }

    on_board(sq_n){
        return sq_n >= 0 && sq_n < 128
    }


    /**
     * return x co-ordinate of square
     * @param {number} sq 
     */
    _x(sq_n){
        if(!isFinite(sq_n)) return -1;
        if(this.piece_area(sq_n)) return sq_n & 7;
        return -1;
    }

    /**
     * returns y co-ordinate of square
     * @param {number} sq 
     */
    _y(sq_n){
        if(!isFinite(sq_n)) return -1;
        if(this.piece_area(sq_n)) return sq_n >>> 4;
        return -1;
    }

    /**
     * 
     * @param {number} sq_n 
     * @param {number} piece_id 
     */
    set_piece(sq_n, piece_id){
        var pie_ = (piece_id & 0xf);
        sq_n &= 0x7F; 
        this.EB[sq_n] |= pie_; //^ (this.set_square(sq_n) & 0x3c0);
        
        return this.EB[sq_n]; 
    }

    /**
     * returns boolean value if piece is present on square, true if yes, else false
     * @param {number} sq_n square number on board  (0 - 128) & BOARD_MASK == BOARD_MASK
     * @param {number} player player type , black(1) or white(0) or none(3) 
     * @returns {boolean} value if piece is present on square
     */
    haves_piece(sq_n, player = 3){
        if(!this.piece_area(sq_n)) return false
        var piece = this.EB[sq_n] & 0xF
        if(player == 1) return (piece > 7 && piece < 14);
        else if(player == 0) return (piece > -1 && piece < 6);  
        player = 1     
        if (player == 1 || player == 0) return (piece > -1 && piece < 6) || (piece > 7 && piece < 14);
        else return false
    }

    // move_encode(sq_n, n_sq_n){
    //     return ((((sq_n & x88_MASK) << x88_BITS) | this.piece(sq_n, true)) << x88_MOVE_BITS) | (((n_sq_n & x88_MASK) << x88_BITS) | this.piece(n_sq_n, true)) 
    // }

    move_encode(sq_n, n_sq_n){
        return ( ((((sq_n & x88_MASK) << PIECE_INFO_BITS) | this.EB[sq_n] & PIECE_INFO_MASK) << x88_MOVE_BITS) | (((n_sq_n & x88_MASK) << PIECE_INFO_BITS) | this.EB[n_sq_n] & PIECE_INFO_MASK)) 
    }

    move_decode(c_sq_n){
        return [[(c_sq_n >> (x88_MOVE_BITS + PIECE_INFO_BITS)) & x88_MASK, (c_sq_n >> x88_MOVE_BITS) & PIECE_INFO_MASK], [((c_sq_n >> PIECE_INFO_BITS) & x88_MASK), c_sq_n & PIECE_INFO_MASK]]
    }

    /**
     * return piece value / id on board
     * @param {number} sq_n square no on board
     * @param {boolean} abs absolute piece value if true 
     */
    piece(sq_n, abs = false){
        if(abs) return this.EB[sq_n] & 0xF;
        return this.EB[sq_n] & 0x7;
    }

    pl_type(sq_n){
        if(!this.on_board(sq_n)) return 3 // out of board
        if(this.haves_piece(sq_n, 1)) return 1 // 
        if(this.haves_piece(sq_n, 0)) return 0 //
        if(this.piece_area(sq_n)) return 2 // on board
        return 3
    }


    /**
     * moves the piece on square sq_n to new sqaure of n_sq_n, and set
     * current sq_n to empty square(6)
     * if you are in x state
     * x = undo(move(x))
     * @param {int} sq_n 
     * @param {int} n_sq_n 
     */
    move_nen(sq_n, n_sq_n, valid_moves = null){
        if(!n_sq_n){    
            var t_sq_n = sq_n
            sq_n = n_sq_n ? n_sq_n : this.sq_n
            n_sq_n = t_sq_n
        }console.log("sq_n", sq_n, " n_sq_n : ", n_sq_n, !this.sq_n || sq_n == n_sq_n)
        if(!this.sq_n || sq_n == n_sq_n) return
        console.log("val _ moves  : ", this.val_moves)
        if(this.val_moves.length != [].length){
            valid_moves = this.val_moves
            console.log("valid_moves", valid_moves , sq_n, !valid_moves.includes(n_sq_n))
            if(!valid_moves.includes(n_sq_n)) return
        }
        this.val_moves = []
        this.p_sq_n = [sq_n, this.EB[sq_n]]       // [sq_no, piece_info]  piece_info --> (file .. piece_id )
        this.n_p_sq_n = [n_sq_n, this.EB[n_sq_n]] // [sq_no, piece_info]  piece_info --> (file .. piece_id )  
        
        this.hist_move.push(this.move_encode(sq_n, n_sq_n))
        console.log("hist kmoves : ", this.hist_move)
        var index = (__BORANK[this.pl_type(sq_n)][this.piece(sq_n) < 5 ? 0: 1] << 4) + (this.EB[sq_n] >> 4 & 0x7)  ;
        this.EB[index] = sq_n;

        if(this.pl_type(n_sq_n) == 0 || this.pl_type(n_sq_n) == 1){
            index = (__BORANK[this.pl_type(n_sq_n)][this.piece(n_sq_n) < 5 ? 0: 1] << 4) + (this.EB[n_sq_n] >> 4 & 0x7)  ;
            this.EB[index] = n_sq_n;
        }

        this.EB[n_sq_n] = this.EB[this.sq_n]
        this.EB[sq_n] = EMPTY_SQ

        this.sq_n = n_sq_n      

    }


    /**
     * moves the piece on square sq_n to new sqaure of n_sq_n, and set
     * current sq_n to empty square(6)
     * if you are in x state
     * x = undo(move(x))
     * @param {int} sq_n 
     * @param {int} n_sq_n 
     */
    move(sq_n, n_sq_n, valid_moves = null, su = false){
        if(!n_sq_n){    
            var t_sq_n = sq_n
            sq_n = this.sq_n
            n_sq_n = t_sq_n
        }
        if(!valid_moves) valid_moves = this.val_moves
        if(!sq_n|| sq_n == n_sq_n) return false;

        if(!this.piece_area(sq_n) || !this.piece_area(n_sq_n)) return false;
        if(this.pl_type(n_sq_n) == this.pl_type(sq_n)) return false;
        if(this.pl_type(sq_n) == this.invert(this.turn, 1)) return false;
        
        if(!sq_n) return false;

        if(!su){
            if(!valid_moves.includes(n_sq_n)) return false;
        }
        

        
        this.p_sq_n = [sq_n, this.EB[sq_n]]       // [sq_no, piece_info]  piece_info --> (file .. piece_id )
        this.n_p_sq_n = [n_sq_n, this.EB[n_sq_n]] // [sq_no, piece_info]  piece_info --> (file .. piece_id )  
        
        this.hist_move.push(this.move_encode(sq_n, n_sq_n))
        if([0, 1].includes(this.pl_type(sq_n))){    
            var index = (__BORANK[this.pl_type(sq_n)][this.piece(sq_n) < 5 ? 0: 1] << 4) + (this.EB[sq_n] >> 4 & 0x7) + 8;
            this.EB[index] = n_sq_n;
        }
        // console.log("MOVED SUCCESS FULL TILL VALID  CHECKING .. ", sq_n, n_sq_n)
        // console.log("1. Piece : ", this.piece(sq_n), ", square : ", sq_n, ",  index : ", index, ' n_sq_n : ', n_sq_n)
        if(this.pl_type(n_sq_n) == 0 || this.pl_type(n_sq_n) == 1){
            index = (__BORANK[this.pl_type(n_sq_n)][this.piece(n_sq_n) < 5 ? 0: 1] << 4) + (this.EB[n_sq_n] >> 4 & 0x7) + 8;
            // console.log("2. Piece : ", this.piece(n_sq_n), ", square : ", n_sq_n, ",  index : ", index)
            this.EB[index] = sq_n;
        }
        // console.log("sq_n : ", sq_n, ", n_sq_n : ", n_sq_n) 
        this.EB[n_sq_n] = this.EB[sq_n]
        this.EB[sq_n] = EMPTY_SQ

        this.sq_n = null   
        this.future_move = []
        this.turn = this.invert(this.turn, 1);

        return true
    }


    /**
     * undo reverses back one move, 
     * two times undo results you in same position as earlier
     * x = undo(undo(x))
     */
    undo_one(){

        if(this.now_undo){
            this.redo()
        }
        if(this.now_redo){
            this.undo()
        }

    }

    redo(){
        if(this.future_move.length == 0) return false;

        var last_move = this.future_move.pop()

        last_move = this.move_decode(last_move)

        var p = last_move[0]
        var n = last_move[1]

        this.hist_move.push(this.move_encode(p[0], n[0]))
        var p_sq_n = [this.p_sq_n, this.EB[this.p_sq_n[0]]]       // [sq_no, piece_info]  piece_info --> (file .. piece_id )
        var n_p_sq_n = [this.n_p_sq_n, this.EB[this.n_p_sq_n[0]]] // [sq_no, piece_info]  piece_info --> (file .. piece_id )  
        if([0, 1].includes(this.pl_type(p[0]))){
            var index = (__BORANK[this.pl_type(p[0])][this.piece(p[0]) < 5 ? 0: 1] << 4) + (this.EB[p[0]] >> 4 & 0x7) + 8 ;
            this.EB[index] = p[0];
        }
        if([0, 1].includes(this.pl_type(n[0]))){
            var index = (__BORANK[this.pl_type(n[0])][this.piece(n[0]) < 5 ? 0: 1] << 4) + (this.EB[n[0]] >> 4 & 0x7) + 8 ;
            this.EB[index] = n[0];
        }
        
        this.EB[p[0]] = p[1]// (p[0] & 3) | (p[1] & 0xf)
        this.EB[n[0]] = n[1]// (n[0] & 3) | (n[1] & 0xf)
        this.now_redo = true
        this.turn = this.invert(this.turn, 1);

        return true;

    }
    undo(){        
        if(this.hist_move.length == 0) return false;
        // console.log('hist move before : ', this.hist_move)
        var last_move = this.hist_move.pop()
        // console.log('hist move after : ', this.hist_move)
        last_move = this.move_decode(last_move)
        
        var p = last_move[0]
        var n = last_move[1]
        this.future_move.push(this.move_encode(p[0], n[0]))
        var p_sq_n = [this.p_sq_n, this.EB[this.p_sq_n[0]]]       // [sq_no, piece_info]  piece_info --> (file .. piece_id )
        var n_p_sq_n = [this.n_p_sq_n, this.EB[this.n_p_sq_n[0]]] // [sq_no, piece_info]  piece_info --> (file .. piece_id )  
        if([0, 1].includes(this.pl_type(p[0]))){
            var index = (__BORANK[this.pl_type(p[0])][this.piece(p[0]) < 5 ? 0: 1] << 4) + (this.EB[p[0]] >> 4 & 0x7) + 8 ;
            this.EB[index] = n[0];
            // console.log("1. MODIFIED PIECE SQUARE STRORE OF THE BOEARD ====> index : ", index, "  square : ", this.EB[index]);
        }
        if([0, 1].includes(this.pl_type(n[0]))){
            var index = (__BORANK[this.pl_type(n[0])][this.piece(n[0]) < 5 ? 0: 1] << 4) + (this.EB[n[0]] >> 4 & 0x7) + 8 ;
            this.EB[index] = p[0];
            // console.log("BORANK  : ", this.pl_type(n[0]), this.piece(n[0]) < 5 ? 0: 1 )
            // console.log("2. MODIFIED PIECE SQUARE STRORE OF THE BOEARD ====> index : ", index, "  square : ", this.EB[index]);
        }
        
        this.EB[p[0]] = p[1]// (p[0] & 3) | (p[1] & 0xf)
        this.EB[n[0]] = n[1]// (n[0] & 3) | (n[1] & 0xf)
        
        this.now_undo = true
        this.turn = this.invert(this.turn, 1);

        return true
    }

    /**
     * It evaluates the board and get the integer indicating who is dominating on board
     * +ve score refer white will be wining
     * -ve score refer black will be wining 
     * simple evaluation function deciding wining by influence number of squares 
     * regardless of piece which is attacking
     * @returns {int} integer representation the eval score of board
     */
    eval(){
        var score = 0
        var piece_prt = 0
        for(var i = 0; i < 2; i++){
            var turn = i & 1
            if(i != turn) continue
            var offset_multiplier = turn == 1 ? -1 : 1 // offset multiplier +ve for white and -ve for black 
            // console.log(i, ". offset multiplier : ", offset_multiplier)
            for(var j = 0; j < 2; j++){
                var rank = __BORANK[i][j] // rank
                for(var k = 0; k < 8; k++){
                    var piece_sq = this.EB[rank << 4 | k | 8] & 0x7F // get the square where current piece is store
                    if(!this.piece_area(piece_sq)) continue
                    // piece_prt += __PIECE_VALUE[this.piece(piece_sq, true)]
                    var al = this.valid_moves(piece_sq, null, turn, true)
                    score += al.length
                }
            }
        }
        // print("score : ", score + piece_prt, " sss : ", score, "  ppp : ", piece_prt)
        return score + piece_prt;
    }

    /**
     * 
     * @param {int} sq_n  current square
     * @param {int} p_sq_n previous square
     * @param {int} depth depth of chess chess min-max tree
     */
    next_move(sq_n = 0, p_sq_n = 0, depth = 5, turn = this.turn){
        // print("TOP depth : ", depth, "  sq_n : ", sq_n, "   n_sq_n : ", p_sq_n)
        if(depth == 0){
            var eva = this.eval()
            // print("DEPTH 0 : ", depth, "  sq_n : ", sq_n, "   n_sq_n : ", p_sq_n, eva)
            return {score : eva, sq_n : sq_n & x88_MASK, n_sq_n : p_sq_n & x88_MASK}
        }
        // var all_moves = this.get_all_moves(turn)
        var n_sq_n = null
        // var turn = 0; 
        // console.log("Suggesting move for player : ", turn, __BORANK[turn][0] , __BORANK[turn][1] )
        // console.log("all_moves : ", all_moves)
        var index = 0
        var sc = null, mx = {score : 1000000, sq_n : 0, n_sq_n : 0};
        var sc_arr = []
        var sel_arr = []
        for(var i = 0; i < 2; i++){
            var rank = __BORANK[turn][i] // get the rank where pieces are store
            for(var j = 8; j < 16; j++){
                n_sq_n = this.EB[(rank << 4 )+ j] & x88_MASK // get the square of piece currently present
                // console.log("index : ", (rank << 4) + j)
                if(!this.piece_area(n_sq_n)) continue // Checks if the square got is within piece area of x88 board
                
                var temp_moves = this.valid_moves(n_sq_n, null, turn, true) // ,  Dir offset gives all direction for a piece on square wrt current player king
                // console.log("turn : ", turn, "n_sq_n : ", n_sq_n, " index : ", (rank << 4 )+ j, (rank << 4 ), rank, "TEMP MOVES  : ", temp_moves)
                // mx = {score : 1000000, sq_n : sq_n, n_sq_n : temp_moves[k]}; 
                // console.log("n_sq_n original : ", n_sq_n, "temp moves  : ", temp_moves)
                for(var k = 0; k < temp_moves.length; k++){
                    var moved = this.move(n_sq_n, temp_moves[k], temp_moves);
                    // console.log(k, ". Square sq_n : ", Square.sq_name(n_sq_n, null, 'x88'), ",  n_sq_n : ", Square.sq_name(temp_moves[k], null, 'x88'), " moved : ", moved)
                    // turn = this.invert(turn, 1);
                    // console.log("depth : ", depth, " sq_n : ", n_sq_n, "   n_sq_n : ", temp_moves[k])
                    sc = this.next_move(n_sq_n, temp_moves[k], depth - 1, turn)
                    // console.log(k, ". <= k , be n_sq_n : ", this.EB[(rank << 4 )+ j] & x88_MASK)
                    var undoed = this.undo()
                    // console.log(k, "turn : ", this.turn, turn,  "  moved : ", moved, ". undoed : ", undoed)
                    // console.log(k, ". <= k , af n_sq_n : ", this.EB[(rank << 4 )+ j] & x88_MASK)
                    
                    // console.log(k, ". Piece : ", this.piece(sc.sq_n), "  SQUARE |  sq_n : ", Square.sq_name(sc.sq_n, null, 'x88'), sc.sq_n, ",  n_sq_n : ", Square.sq_name(sc.n_sq_n, null, 'x88'), sc.n_sq_n, " score :", sc.score);
                    sel_arr.push([sc, index])
                    // console.log("score sc", sc, "score mx : ", mx, sc.score > mx.score, sc.score == mx.score)
                    // if(turn == 0) sc.score  *= -1
                    if(sc.score > mx.score && turn == 0) {
                        // console.log("1. ")
                        mx = sc;
                        index = i;
                        sc_arr = [[mx, index]]
                    }else if(sc.score == mx.score){
                        // console.log("2. ")
                        sc_arr.push([sc, index])
                    }else if(sc.score < mx.score && turn == 1) {
                        // console.log("3. ")
                        mx = sc//{score : sc.score, sq_n: sc.sq_n, n_sq_n : sc.n_sq_n};
                        index = i;
                        sc_arr = [[mx, index]]
                    }
                }
            }
        }
        mx = sc_arr[Math.floor(Math.random() * sc_arr.length)][0]
        // console.log(". index : ", index, "Square to return : ", {score : sc, sq_n : all_moves[index] >> x88_BITS, n_sq_n : all_moves[index] & x88_MASK})
        return {score : mx.score, sq_n : mx.sq_n, n_sq_n : mx.n_sq_n}
    }

    get_all_moves(turn){
        var moves = []
        for(var i = 0; i < 2; i++){
            var rank = __BORANK[turn][i] // get the rank where pieces are store
            for(var j = 8; j < 16; j++){
                var n_sq_n = this.EB[(rank << 4 )+ j] // get the square of piece currently present
                // console.log("index : ", (rank << 4) + j)
                if(!this.piece_area(n_sq_n)) continue // Checks if the square got is within piece area of x88 board
                
                var temp_moves = this.valid_moves(n_sq_n, null, turn, true, true) // ,  Dir offset gives all direction for a piece on square wrt current player king
                // console.log(i, j ,"temp_moves ", temp_moves, Square.sq_name(n_sq_n, null, 'x88'), n_sq_n)
                Array.prototype.push.apply(moves, temp_moves)
            }
        }
        return moves.sort((a, b) => this.piece(this.EB[a & x88_MASK]) < this.piece(this.EB[b & x88_MASK]))
    }
    /**
     * return moves dict like object
     * {moves : ... , score : ...}
     * moves are encoded by first 7 bits from lsb for attacked square and next 7 bits for which square is attacking
     * individual 7 bits are big-endian coded
     * 
     * e.g.  if 7th sqaure is attacking 5th sqaure 
     * then enoded in hex is :==  0x0705
     * @param {int} sq_n 
     * @param {Array} directions 
     * @param {int} turn 
     */
    valid_moves(sq_n, directions = null, turn = this.turn, move = false, en = false){
        if(!this.piece_area(sq_n)) return [];
        // if(attacked) this.c_sq_n = sq_n
        var moves = [];
        var piece = this.piece(sq_n);
        if(this.pl_type(sq_n) != turn) return [];
        // console.log("direction  == ", directions)
        // console.log("sq_n : ", sq_n)
        if(piece == 0){ //KING
            if(!directions) moves = this.king_moves(sq_n);
            else moves = this.king_moves(sq_n, directions)
        }
        else if(piece == 1){ //QUEEN
            if(!directions) moves = this.queen_moves(sq_n);
            else moves = this.queen_moves(sq_n, directions);
        }
        else if(piece == 2){ //ROOK
            if(!directions) moves = this.rook_moves(sq_n);
            else moves = this.rook_moves(sq_n, directions);
        }
        else if(piece == 3){ //BISHOP
            if(!directions) moves = this.bishop_moves(sq_n);
            else moves = this.bishop_moves(sq_n, directions);
        }
        else if(piece == 4){ //HORSE
            if(!directions) moves = this.horse_moves(sq_n);
            else moves = this.horse_moves(sq_n, directions);
        }
        else if(piece == 5){ //PAWN
            if(!directions) moves = this.pawn_moves(sq_n);
            else moves = this.pawn_moves(sq_n, directions);
        }else{
            //raise error
            console.log("ERR MOVE")
        }

        this.sq_n = sq_n

        if(move){ 
            this.val_moves = moves['moves'].map(a => a & x88_MASK)
            if(en) return moves['moves']
            else  return this.val_moves
        }
        // this.val_moves = []

        return moves // {moves: moves['moves'], 'score' :moves['score']};
    }

    king_moves(sq_n, directions = __DIR_OFFFSET.KING, turn = this.turn){
        if(!this.piece_area(sq_n)) return []
        var moves = []
        var score = []
        var c_piece_val = __PIECE_VALUE[this.piece(sq_n, true)]
        var pl_type = this.pl_type(sq_n)
        var a_sq_n = 0, b_sq_n = 0, can;
        directions.forEach(o => {
            a_sq_n = sq_n
            for(var i = 0; i < __RANGE.KING; i++){
                a_sq_n = a_sq_n + o
                can = this.go_to_square_if_can(a_sq_n, pl_type, moves)
                if(!can && this.pl_type(a_sq_n) == this.invert(pl_type, 1)) {
                    // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), a_sq_n & x88_MASK," k pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1),pl_type)
                    var f_piece_val = __PIECE_VALUE[this.piece(a_sq_n, true)]
                    // console.log("f piece :", f_piece_val)
                    score.push((f_piece_val * -1))
                    break
                }if(!can) break
            }
        });
        return {'moves' : moves.map(a => (sq_n << x88_BITS ) | (a & x88_MASK)), 'score' : score}
    }
     

    queen_moves(sq_n, directions = __DIR_OFFFSET.QUEEN){
        if(!this.piece_area(sq_n)) return []
        var moves = []
        var score = []
        var c_piece_val = __PIECE_VALUE[this.piece(sq_n, true)]
        var pl_type = this.pl_type(sq_n)
        var a_sq_n = 0, b_sq_n = 0, can;
        directions.forEach(o => {
            a_sq_n = sq_n
            for(var i = 0; i < __RANGE.QUEEN; i++){
                a_sq_n = a_sq_n + o
                can = this.go_to_square_if_can(a_sq_n, pl_type, moves)
                if(!can && this.pl_type(a_sq_n) == this.invert(pl_type, 1)) {
                    // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), a_sq_n & x88_MASK, " q pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1), pl_type)
                    var f_piece_val = __PIECE_VALUE[this.piece(a_sq_n, true)]
                    // console.log("f piece :", f_piece_val)
                    score.push((f_piece_val * -1))
                    break
                }if(!can) break
            }
        });
        return {'moves' : moves.map(a => (sq_n << x88_BITS ) | (a & x88_MASK)), 'score' : score}
    }

    rook_moves(sq_n, directions = __DIR_OFFFSET.ROOK, turn = this.turn){
        if(!this.piece_area(sq_n)) return []
        var moves = []
        var score = []
        var c_piece_val = __PIECE_VALUE[this.piece(sq_n, true)]
        var pl_type = this.pl_type(sq_n);
        var a_sq_n = 0, b_sq_n = 0, can;
        // console.log("directions === > ", directions)
        directions.forEach(o => {
            a_sq_n = sq_n
            for(var i = 0; i < __RANGE.ROOK; i++){
                a_sq_n = a_sq_n + o
                can = this.go_to_square_if_can(a_sq_n, pl_type, moves)
                if(!can && this.pl_type(a_sq_n) == this.invert(pl_type, 1)) {
                    // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), a_sq_n & x88_MASK," r pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1), pl_type)
                    var f_piece_val = __PIECE_VALUE[this.piece(a_sq_n, true)]
                    // console.log("f piece :", f_piece_val)
                    score.push((f_piece_val * -1))
                    break
                }if(!can) break
            }
        });
        return {'moves' : moves.map(a => (sq_n << x88_BITS ) | (a & x88_MASK)), 'score' : score}
    }

    bishop_moves(sq_n , directions = __DIR_OFFFSET.BISHOP, turn = this.turn){
        if(!this.piece_area(sq_n)) return []
        var moves = []
        var score = []
        var c_piece_val = __PIECE_VALUE[this.piece(sq_n, true)]
        var pl_type = this.pl_type(sq_n)
        var a_sq_n = 0, b_sq_n = 0, can;
        directions.forEach(o => {
            a_sq_n = sq_n
            for(var i = 0; i < __RANGE.BISHOP; i++){
                a_sq_n = a_sq_n + o
                can = this.go_to_square_if_can(a_sq_n, pl_type, moves)
                if(!can && this.pl_type(a_sq_n) == this.invert(pl_type, 1)) {
                    // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), a_sq_n & x88_MASK," b pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1), pl_type)
                    var f_piece_val = __PIECE_VALUE[this.piece(a_sq_n, true)]
                    // console.log("f piece :", f_piece_val)
                    score.push((f_piece_val * -1))
                    break
                }if(!can) break
            }
        });
        return {'moves' : moves.map(a => (sq_n << x88_BITS ) | (a & x88_MASK)), 'score' : score}
    }
    /**
     * returns array of all possible horse moves on x88ru board
     * @param {number} sq_n encoded x88ru format 
     * @returns {Array} moves array containing all possible moves
     */
    horse_moves(sq_n, directions = __DIR_OFFFSET.HORSE, turn = this.turn){
        if(!this.piece_area(sq_n)) return []
        var moves = []
        var score = []
        var c_piece_val = __PIECE_VALUE[this.piece(sq_n, true)]
        var can, n_sq_n;
        var pl_type = this.pl_type(sq_n), n_sq_n = 0
        for(var i = 0; i < directions.length; i++){
            n_sq_n = sq_n + directions[i] // new square if horse moved in (2 * i + 1) direction
            can = this.go_to_square_if_can(n_sq_n, pl_type, moves)
            if(!can && this.pl_type(n_sq_n) == this.invert(pl_type, 1)) {
                // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), n_sq_n & x88_MASK," h pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1), pl_type)
                var f_piece_val = __PIECE_VALUE[this.piece(n_sq_n, true)]
                // console.log("f piece :", f_piece_val)
                score.push((f_piece_val * -1))
                continue
            }if(!can) continue
        }
        return {'moves' : moves.map(a => (sq_n << x88_BITS ) | (a & x88_MASK)), 'score' : score}
    } 

    /**
     * 
     * @param {number} sq_n 
     */
    pawn_moves(sq_n, directions = __DIR_OFFFSET.PAWN, turn = this.turn){
        if(!this.piece_area(sq_n)) return []
        
        var pl_type = this.pl_type(sq_n);
        
        var can, n_sq_n, to_add;

        var moves = [];
        var score = [0, 0]
        var c_piece_val = __PIECE_VALUE[this.piece(sq_n, true)]
        var f_piece_val = 0
        var L = directions.length
        
        if(directions != __DIR_OFFFSET.PAWN){
            for(var i = 0; i < 3 - L; i++){
                directions.push(24) // Invalid adder , any addition or subtraction of 8, 24, 48, etc from on board will result off board
            }   
            directions.sort((a, b) => a > b ? a : b)
            L = 3             
        }

        var offsetm = this.piece(sq_n, true) == 5 ? 1 : -1
        
        var RANGE = this.rank(sq_n) == __P_RANK[pl_type] ? 2 : 1; // for first move

        n_sq_n = sq_n + offsetm * directions[L - 3]
        to_add = this.pl_type(n_sq_n) == EMPTY_SQ_TYPE ? false : true
        can = this.go_to_square_if_can(n_sq_n, pl_type, moves, to_add )    
        if(!can && this.pl_type(n_sq_n) == this.invert(pl_type, 1)) {
            // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), a_sq_n & x88_MASK," b pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1), pl_type)
            var f_piece_val = __PIECE_VALUE[this.piece(n_sq_n, true)]
            // console.log("f piece :", f_piece_val)
            score.push((f_piece_val * -1))
        }
        
        n_sq_n = sq_n + offsetm * directions[L - 2]
        to_add = this.pl_type(n_sq_n) == EMPTY_SQ_TYPE ? true : false
        can = this.go_to_square_if_can(n_sq_n, pl_type, moves, to_add )   
        
        if (RANGE == 2 && can) {
            n_sq_n = sq_n + 32 * offsetm
            to_add = this.pl_type(n_sq_n) == EMPTY_SQ_TYPE ? true : false
            can = this.go_to_square_if_can(n_sq_n, pl_type, moves, to_add )   
        }
        
        n_sq_n = sq_n + offsetm * directions[L - 1]
        to_add = this.pl_type(n_sq_n) == EMPTY_SQ_TYPE ? false : true
        can = this.go_to_square_if_can(n_sq_n, pl_type, moves, to_add )  
        if(!can && this.pl_type(n_sq_n) == this.invert(pl_type, 1)) {
            // console.log(i, ". square : ", Square.sq_name(a_sq_n, null, 'x88'), a_sq_n & x88_MASK," b pl_type == sq_pl_type : ", this.pl_type(a_sq_n) == this.invert(pl_type, 1), this.pl_type(a_sq_n) , this.invert(pl_type, 1), pl_type)
            var f_piece_val = __PIECE_VALUE[this.piece(n_sq_n, true)]
            // console.log("f piece :", f_piece_val)
            score.push((f_piece_val * -1))
        }
        
        return {'moves' : moves.map(a => (sq_n << x88_BITS ) | (a & x88_MASK)), 'score' : score}
    }

    

    /**
     * next/new square is confirmed and add in moves array
     * It only checks if player can place on the square irrespective of if king is in danger
     * It checks if the square is empty, or player is present, and type of player and act accordingly
     * @param {number} n_sq_n next/new square to confirm or add in moves array 
     * @param {number} pl_type  it stores player type black(1) or white(0) or None(3)
     * @param {Array} moves array storing the moves, n_sq_n will be added if can
     */
    go_to_square_if_can(n_sq_n, pl_type, moves = [], add = true){
        if(!add) return false;
        var n_ply_type = this.pl_type(n_sq_n)
        // console.log("pl_type : ", n_ply_type, pl_type)
        // console.log("N_PLY TYPE : " + n_ply_type)
        if(n_ply_type == 3) return false // out of board
        if(n_ply_type == 2){ // empty square
            moves.push(n_sq_n);
            return true
        }
        if(n_ply_type != pl_type){ // opposite team player standing
            moves.push(n_sq_n);
            return false
        }return false
    }

    /**
     * Will find all possible moves of oppenent in next turn, and return if sq_n is attacked by opponent
     * @param {number} sq_n 
     */
    if_attacked(sq_n){
        var opp_pl_type = this.invert(this.turn, 1), n_sq_n;
        var moves = [], attackers = [], movesabs = []
        this.turn = this.invert(this.turn, 1) //Inverting the turn, without changing move count
        for(var j = 0; j < 2; j++){
            var rank = __BORANK[opp_pl_type][j]; // Getting the rank where opp_pl_type players pieces position are stored in half part of x88 board
            for(var i = 8; i < 16; i++){
                n_sq_n = this.EB[rank * 16 + i]
                if(!this.piece_area(n_sq_n)) continue // Checks if the square got is within piece area of x88 board
                 
                var direction = this._direction(n_sq_n, sq_n) >> 1 // Get the direction of n_sq_n --> sq_n, see @direction_info (8 direction)
                if (direction == -1 ) continue
                moves = this.valid_moves(n_sq_n, false, [__DIR_OFFFSET_ARR[this.piece(n_sq_n, true)][direction]]) // ,  Dir offset gives all direction for a piece on square wrt current player king
                
                if(this.piece(n_sq_n) == 1){
                    
                }
                if(moves.includes(sq_n)) {
                    // console.log("Found Attacker : " + __PIECE[this.piece(n_sq_n, true)] + "  " + this.piece(n_sq_n, true) + "  on square " + Square.sq_name(n_sq_n, null, 'x88') + "  " + n_sq_n)
                    attackers.push(n_sq_n);
                    Array.prototype.push.apply(movesabs, moves);
                    movesabs.push(n_sq_n)
                } 
            }
            
        }
        this.turn = this.invert(this.turn, 1) //Inverting back the turn, without changing move count
        return {attackers : attackers, moves : movesabs };
    }

    /**
     * 
     * @param {Array} moves array
     * @param {number} direction  [1 - 16)
     */
    go_in_direction( moves , direction){

    }

     /**
     * return sq2 direction from sq1
     * @param {number} sq1 
     * @param {number} sq2 
     */
    _direction(sq1, sq2){
        if(!this.piece_area(sq1) || !this.piece_area(sq2)) return -1 // Both sq1 and sq2 should be in board area
        
        var diff = sq2 - sq1;
   
        if(this._y(diff) == 0 && this._x(diff) > 0) return 0;
        else if(diff == 0x12) return 1;
        else if(diff % 17 == 0 && diff > 0) return 2;
        else if(diff == 0x21) return 3;
        else if(diff % 8 == 0 && diff > 0) return 4;
        else if(diff == 0x1F) return 5;
        else if(diff % 15 == 0 && diff > 0) return 6;
        else if(diff == 0x0F) return 7;
        else if(this._y(diff) == 0 && this._x(diff) < 0 ) return 8;
        else if(diff == -0x12) return 9;
        else if(diff * -1 % 17 == 0 ) return 10;
        else if(diff == -0x21) return 11;
        else if(diff * -1 % 8 == 0) return 12;
        else if(diff == -0x1F) return 13;
        else if(diff * -1 % 15 == 0) return 14;
        else if(diff == -0x0E) return 15;
        else return -1;
    }


}




/**
 * 
 * @param {number} n : rows
 * @param {number} m : columns
 * @param {number} default_val : default value
 */
function array2D(n, m, default_val = null){
    let array = new Array(n); 
	for(let i = 0; i < n; i++) {
        array[i] = new Array(m); 
        for(let j = 0; j < m; j++){
            array[i][j] = default_val;
        }
	}
 
	return array; 
}

/**
 * 
 * @param {number} i 
 * @param {number} j 
 * @returns string representation of square
 */
function square_name(i, j = null, type = 'NORMAL'){
    if(j == null){
        var MOD = __BTYPE_MOD[type]
        i = i % MOD;
        j = Math.floor(j / MOD);
    }
    return __STANDARD[0][i] + __STANDARD[1][j]
}

function sq_color(i, j = null, type = 'NORMAL'){
    return 0
}

/**
 * 
 * @param {Array} array1 
 * @param {Array} array2 
 */
function intersect(array1, array2){
    return array1.filter(x =>{
        return array2.includes(x)
    });
}

/**
 * finds array1 - array2
 * @param {Array} array1 
 * @param {Array} array2 
 */
function minus(array1, array2){
    return array1.filter(x =>{
        return !array2.includes(x);
    }); 
}




// export const CS = {Board, Piece, Engine, Square}

// export const CT = {
//                     __PIECES_STD, __PIECES_ID, BOARD_MASK ,PIECE_MASK , PIECE_INFO_MASK, PIECE_INFO_BITS ,
//                     PIECE_BITS,x88_MASK ,x88_MOVE_BITS, x88_MOVE_MASK , x88_BITS ,DEAD,DIR_OFF_INV,EMPTY_SQ_TYPE, EMPTY_SQ ,
//                     INVALID_SQ,__RANGE, __BORANK , __RANGE_ARR, __DIRECTION , __DIR_LENGTH, __HORSE_MOVES_OFFSET ,__DIR_OFFFSET_M,
//                     __DIR_OFFFSET, __DIR_OFFFSET_ARR , __P_RANK,__DIRECTION_ARR,__PIECE_VALUE, PIECE_VALUE_MASK, __PIECE_SQ, __PIECE_INFL,
//                     __PIECE ,__CLASSIC ,__STANDARD, __BTYPE_MOD, __STYLE, FUNCTION_START, FUNCTION_END

//                 }

// export const FN = {
//     sq_color, intersect, minus, square_name
// }
const E = {
                    Board, Piece, Engine, Square,

                    __PIECES_STD, __PIECES_ID, BOARD_MASK ,PIECE_MASK , PIECE_INFO_MASK, PIECE_INFO_BITS ,
                    PIECE_BITS,x88_MASK ,x88_MOVE_BITS, x88_MOVE_MASK , x88_BITS ,DEAD,DIR_OFF_INV,EMPTY_SQ_TYPE, EMPTY_SQ ,
                    INVALID_SQ,__RANGE, __BORANK , __RANGE_ARR, __DIRECTION , __DIR_LENGTH, __HORSE_MOVES_OFFSET ,__DIR_OFFFSET_M,
                    __DIR_OFFFSET, __DIR_OFFFSET_ARR , __P_RANK,__DIRECTION_ARR,__PIECE_VALUE, PIECE_VALUE_MASK, __PIECE_SQ, __PIECE_INFL,
                    __PIECE ,__CLASSIC ,__STANDARD, __BTYPE_MOD, __STYLE, FUNCTION_START, FUNCTION_END,


                    sq_color, intersect, minus, square_name
                }

//  git diff HEAD:F:\rushikesh\project\chess-board\engine (2).js F:\rushikesh\project\chess-board\engine (2).js