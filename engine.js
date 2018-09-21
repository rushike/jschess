

const __PIECES_STD = [];
__PIECES_STD["wK"] = 0; __PIECES_STD["wQ"] = 1; __PIECES_STD["wR"] = 2; __PIECES_STD["wB"] = 3; __PIECES_STD["wN"] = 4; __PIECES_STD["wP"] = 5; __PIECES_STD["X"] = 6;
__PIECES_STD["bK"] = 8; __PIECES_STD["bQ"] = 9; __PIECES_STD["bR"] = 10; __PIECES_STD["bB"] = 11; __PIECES_STD["bN"] = 12; __PIECES_STD["bP"] = 13;

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

const __DIRECTION_ARR = [__DIRECTION.KING, __DIRECTION.QUEEN, __DIRECTION.ROOK, __DIRECTION.BISHOP, __DIRECTION.HORSE, __DIRECTION.PAWN, __DIRECTION.DEFAULT, [],
                        __DIRECTION.KING, __DIRECTION.QUEEN, __DIRECTION.ROOK, __DIRECTION.BISHOP, __DIRECTION.HORSE, __DIRECTION.PAWN, __DIRECTION.DEFAULT, []];

const __PIECE_VALUE = [10, 9, 5, 3, 3, 1, 0, 0, 522, 521, 517, 515, 515, 513, 0, 0];

const __PIECE_INFL = [1, 3, 5, 7, 7, 9, 0, 0, 513, 515, 517, 519, 519, 521, 0, 0];

const __PIECE = ["wK", "wQ", "wR", "wB", "wN", "wP", "wX", "WRE", "bK", "bQ", "bR", "bB", "bN", "bP", "bX", "BRE"];

const __CLASSIC = ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR',
            'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
            'X',  'X',  'X',  'X',  'X',  'X',  'X',  'X',
            'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' ,
            'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' , 'X' ,
            'X',  'X',  'X',  'X',  'X',  'X',  'X',  'X',
            'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
            'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
            ];

const FUNCTION_START = "__________________________________________________\nProcess Start\n__________________________________________________";
const FUNCTION_END = "__________________________________________________\nProcess End\n__________________________________________________";

/**
 * 
 * @param {String} function_name 
 */
const START = function(function_name){
    var str = LINE(50) + "Function Start : " + function_name + "\n" + LINE(50);
    console.log(str);
    return str;
}

const END = function(){
    var str = LINE(50) + "Function End \n" + LINE(50);
    console.log(str);
    return str;
}

const LINE = function(num){
    var i = -1, str = "";
    while(++i < num){
        str += "_"; 
    }return str + "\n";
}

class PRI_ENGINE{

/**
* Length : 64
* Contains INT value of which only 10 used for now
* First 6 from LSB for representation of square, so th E can place any where on board
* Second 4  [6, 10) for piece representation.
* Instruction Format
* |sign_bit|  [ EMPTY_INVALID_BITS]  | influence_int | | peices_info| | sq_no[0-64] |
*    31            30  ... 20           20 ... 10         10 ... 6        6 ... 0 
* @EMPTY_INVALID_BITS 
* 11 bits not assign anything [20, 31);
* 
* @influence_int
* 10 bit number forming sign int [-511 , 0 , 511] 1023 nums
* negative for black influence and vice versa
* 
* @piecesinfo
* Piece def 
* 0000 0 white_king
* 0001 1 white_queen
* 0010 2 white_rook
* 0011 3 white_bishop
* 0100 4 white_knight
* 0101 5 white_pawn
* 0110 6 _no_piece
* 0111 7 _invalid
* 1000 8 black_king
* 1001 9 black_queen
* 1010 10 black_rook
* 1011 11 black_bishop
* 1100 12 black_knight
* 1101 13 black_pawn
* 1110 14 _no_piece
* 1111 15 __invalid 
*/

/**
 * 
 * @param {Array} board 
 */
constructor(board = __CLASSIC){
    this.EB = [];
    this.EB  = Convert.to_engine_board(board);
    this.ZERO = 0;
    this._INI = 0x1ff;
    this._REV = 0x3ff;
}

/**
 * 
 * @param {Array} board 
 */
set(board){
    this.EB = Convert.to_engine_board(board);
}

set_square(sq_n){
    sq_n &= 0x3f; 
    this.EB[sq_n] = (this.EB[sq_n] & 0xffffff40) | sq_n;
    return this.EB[sq_n];
}
set_piece(pie_, sq_n){
    pie_ =(pie_ & 0xf) << 6;
    sq_n &= 0x3f; 
    this.EB[sq_n] = pie ^ (this.set_square(sq_n) & 0x3c0);
    return this.EB[sq_n]; 
}

/**
 * 
 * @param {number} sq_n 
 * @param {number} infl_  
 */
set_infl(sq_n, infl_){
    infl_ = ((infl_) & 0x3ff) << 10;
    sq_n &= 0x3f; 
    this.EB[sq_n] = infl_ ^ (this.EB[sq_n] & 0x3ff);
    return this.EB[sq_n]; 
}

/**
 * return square encoded with influence
 * @param {number} sq_n 
 * @param {number} offset 
 */
set_infl_with_offset(sq_n, offset){
    //if(this._infl(this.EB[sq_n]) == this._INI) this.set_infl(sq_n, this.ZERO);
    var thisinfl = this._infl(this.EB[sq_n]);
    //console.log("sq_n : "+sq_n+" :___offset : " + offset);
    if(offset > this._INI) offset =  (offset & this._INI) * -1;
    if(thisinfl > this._INI) thisinfl = (thisinfl & this._INI) * -1;
    //console.log(":___this.infl : " + thisinfl);
    var infl_ = thisinfl + offset;
    //console.log(":___infl : " + infl_);
    if(infl_ < 0) {
        infl_ = (infl_ * -1) + this._INI + 1;
    }
    //console.log(":@after___infl : " + infl_);
    return this.set_infl(sq_n, infl_);
}

/**
 * returns value of square from encoded format
 * @param {number} sq_n encoded in Int32
 */
_square(sq_n){
    return sq_n & 0x3f;
}

/**
 * returns value of piece from encoded format
 * @param {number} sq_n 
 */
_piece(sq_n){
    return (sq_n & 0x3c0) >>> 6;
}

/**
 * 
 * @param {number} sq_n in encoded Int32
 */
_infl(sq_n){
    return (sq_n >>> 10) & 0x3ff;
}

/**
 * return if given piece is black(1) or white(0)
 * @param {number} sq_n encode in Int32
 */
_player_sq(sq_n){
    return (this._piece(sq_n) & 8) >>> 3;
}

/**
 * return if given piece is black(1) or white(0)
 * @param {number} pie piece number 0 - 16
 */
_player(pie){
    return (pie & 0xf) >>> 3;
}

/**
 * returns boolean value for piece, true if yes, else false
 * @param {number} opie piece number 0 - 16 
 */
_is_piece(opie){
    return (opie > -1 && opie < 6) || (opie > 7 && opie < 14);
}

static _encode(sq, pie){
    //console.log("_encode : _sq_n - " + sq + " _pie : " + pie);
    if(pie >= 0 && sq >= 0 && pie < 16 && sq < 64){
        return ((pie & 0xf) << 6) | (sq & 0x3f);
    }return -1;
}

/**
 * returns rank of piece, relative black_piece_rank = | 7 - white_piece_rank |
 * @param {number} sq_n encoded in Int32
 */
_rank(sq_n){
    if(this._player_sq(sq_n) == 0) return this._y(this._square(sq_n));
    else return Math.abs(this._y(this._square(sq_n)) - 7 );
}



/**
 * return x co-ordinate of square
 * @param {number} sq 
 */
_x(sq){
    //console.log("X: _sq :" +sq + "  _res :" + (sq & 7));
    if(sq < 64 && sq >= 0 && Number.isInteger(sq)) return sq & 7;
    return -1;
}

/**
 * returns y co-ordinate of square
 * @param {number} sq 
 */
_y(sq){
    //console.log("Y: _sq :" +sq + "  _res :" + (sq >>> 3));
    if(sq < 64 && sq >= 0 && Number.isInteger(sq)) return sq >>> 3;
    return -1;
}

/**
 * computational Work
 */


 _INI_INFL(){
    for(var i = 0; i < 64; i++){
        this.set_infl(i, this.ZERO);
    }
 }

 _sum_infl(){
    var sum = 0;
    for(var i = 0; i < 64; i++){
        sum += this._infl(this.EB[i]);
    }return sum;
 }

 /**
  * 
  * @param {Number} sq_n 
  * @param {Number | String} pie_ 
  */
 _valid_moves(sq_n, pie_, bool = true){
    START("_valid_moves");
    /**
     * rt - Piece Value 0 - 16
     * mvs -Move Array
     */
    var rt = this._validate_params_valid_moves(sq_n, pie_);
    var mvs = [];
    if(!Number.isInteger(rt)) return [];
    var rst = this._check_king_if_attacked(sq_n, rt);
    var ksq = this._kings_square(rt);
    var pinned = false;

    //var att = this._attacker(this._square(ksq), this._piece(ksq));

    console.log("_check_king_if_attacked : " + rst);

    console.log("sq : " + sq_n +" pie : " + rt + " encode " + PRI_ENGINE._encode(sq_n, rt));
    // checjing pin
    var atk_pi = this._attacker(PRI_ENGINE._encode(sq_n, rt));
    console.log("attacker to curr pie : "+ atk_pi);
    /**
     * Enter if king not attacked
     * pkd - Piece-King_Direction
     * cpd - Current-Piece-Direction
     */
    if(rst.length  < 1){
        var atk_pi = this._attacker(PRI_ENGINE._encode(sq_n, rt));
        console.log("attker pieces : " + atk_pi);
        if(atk_pi.length > 0){    
            var pkd = this._direction(sq_n, ksq), cpd, tyr = [];
            console.log("Piece-King Direction : " + pkd);
            for(var i = 0; i < atk_pi.length; i++){
                cpd = this._direction(atk_pi[i], sq_n);
                console.log("Current-Piece-Direction : " + cpd)
                if(__DIRECTION_ARR[this._piece(this.EB[atk_pi[i]])].includes(cpd)){
                    console.log("Is valid direction that i(piece) can play.");
                    if(cpd == pkd){
                        console.log("We are pinned...");
                        mvs = add(mvs, this._go_in_direction(cpd, atk_pi[i], 8));
                        mvs = add(mvs, this._go_in_direction( 8 ^ cpd, atk_pi[i], 8));

                        console.log("mvs generated is " + mvs);
                        END();
                        return mvs;
                    }
                }
            }
        }
    }

    if(Number.isInteger(rt)){
        if(rt === 0 || rt === 8){
            mvs =  this._king_moves(PRI_ENGINE._encode(sq_n, rt), bool);
        }else if(rt === 1 || rt === 9){
            mvs = this._queen_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 2 || rt === 10){
            mvs = this._rook_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 3 || rt === 11){
            mvs = this._bishop_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 4 || rt === 12){
            mvs =  this._horse_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 5 || rt === 13){
            mvs = this._go_straight_if_pawn(PRI_ENGINE._encode(sq_n, rt),this._pawn_moves(PRI_ENGINE._encode(sq_n, rt)));
        }else{
            END();
            return mvs;
        }
    }
    mvs = this._go_straight(PRI_ENGINE._encode(sq_n, rt), mvs);

    //checks king attacker and gives apropiate sqaures
    if(rst.length > 0 && rt != 0 && rt != 8 && !pinned){
        if(rst.length > 1) return [];
        console.log("valid_moves : _mvs : " + mvs + " ksq  " + ksq + " pie k ing " + this._piece(ksq));
        var cvs = [], ks = [];
        cvs = this._iter_moves(this._square(this.EB[rst[0]]), this._piece(this.EB[rst[0]]));
        ks = this._queen_moves(ksq);
        cvs = this._go_straight(this.EB[rst[0]], cvs);
        ks = this._go_straight(this.EB[rst[0]], ks);
        cvs = intersect(cvs, ks);
        cvs.push(rst[0]);
        var drt = intersect(cvs, mvs);
        console.log("Attatcker = " + rst[0]);
        console.log("cvs : " + cvs);
        console.log("ks " + ks);
        cvs = intersect(cvs, ks);
        console.log("valid_moves : _%cvs : " + cvs);
        console.log(" only king saving  moves DRT  ============ " + drt);
        END();
        return drt;  
    }END();
    return mvs;
 }
 _validate_params_valid_moves(sq_n, pie_){
     if(typeof sq_n === 'number'){
        if(typeof pie_ === 'number'){
            if(pie_ < 6 || (pie_ > 7 && pie_ < 14)) return pie_; 
            return false;
        }else if(typeof pie_ === 'string'){
            if(__PIECES_STD[pie_] === undefined){
                return false;
            }return __PIECES_STD[pie_];
        }
     }return false;
 }

_iter_moves(sq, pie) {
    console.log(FUNCTION_START);
    console.log("_iter_moves\n");
    var rt = this._validate_params_valid_moves(sq, pie);
    var sq_n = PRI_ENGINE._encode(sq, pie);
    var range = __RANGE_ARR[rt];
    var dir = __DIRECTION_ARR[rt];
    var mov = [];

    for(var i = 0; i < dir.length; i++){
        mov= add(mov, this._go_in_direction(dir[i], sq_n, range));
    }console.log("__iter_moves __mov: " + mov);
    console.log(FUNCTION_END);
    return mov;
}

 _attacker(rsq){
    START("_attacker")
    var pie_sq = [], offset = 0, pie = this._piece(rsq);
    //console.log("PRI_ENGINE:_check_king_if_attack :_pie = " + pie);
    //console.log("Attacker Sqauare is : " + this._square(rsq) + " piece : " + this._piece(rsq) + " _infl : " + this._infl(rsq));

    var art = [];
    art = this.__moves(rsq);
    //console.log("offset "+offset+" ART " + art);
    art = this._go_straight(rsq, art);
    //console.log("offset "+offset+" ART " + art);
    if(pie <= 8) offset = 8;
    var tyr = [];
    for(var i = 0; i < art.length; i++){
        //console.log("i " + i + " SQ_ART " + art[i] + " piece no " + this._piece(this.EB[art[i]]) +" true con is piece " + this._is_piece(this._piece(this.EB[art[i]])));
        if(this._is_piece(this._piece(this.EB[art[i]]))){
           // console.log("After one check Will Push");
            if(this._piece(this.EB[art[i]]) != offset) {
                //console.log("Will Push");
                tyr = this._attacking_moves(art[i], this._piece(this.EB[art[i]]));
                console.log("defending square " + this._square(rsq) +"  | attacker piece: "+ this._piece(this.EB[art[i]]) +" square  attacker["+art[i]+"] is : " + tyr );
                console.log("bool condn : " + tyr.includes(this._square(rsq)));
                if(tyr.includes(this._square(rsq))) {
                    console.log("Pushing " + art[i]);
                    pie_sq.push(art[i]);
                }
            }
        }
    }console.log("Pie_Sq " + pie_sq);
    END();
    return pie_sq;
 }

 /**
  * return array of attackers
  * @param {number} sq_n 
  * @param {number} pie is 0 - 16 
  */
 _check_king_if_attacked(sq_n, pie){
    START("_check_king_if_attacked");
    var pie_sq = [], offset = 0, rsq = 0;
    console.log("PRI_ENGINE:_check_king_if_attack :_pie = " + pie);

    rsq = this._kings_square(pie);

    console.log("King Sqauare is : " + this._square(rsq) + " piece : " + this._piece(rsq) + " _infl : " + this._infl(rsq));

    var art = [];
    art = this.__moves(rsq);
    //console.log("offset "+offset+" ART " + art);
    art = this._go_straight(rsq, art);
    //console.log("offset "+offset+" ART " + art);
    if(pie <= 8) offset = 8;

    for(var i = 0; i < art.length; i++){
       // console.log("i " + i + " SQ_ART " + art[i] + " piece no " + this._piece(this.EB[art[i]]) +" true con is piece " + this._is_piece(this.EB[art[i]]));
        if(this._is_piece(this._piece(this.EB[art[i]]))){
           // console.log("After one check Will Push");
            if(this._piece(this.EB[art[i]]) != offset) {
                //console.log("Will Push");
                if(__DIRECTION_ARR[this._piece(this.EB[art[i]])].includes(this._direction(art[i], rsq))) pie_sq.push(art[i]);
            }
        }
    }console.log("_check_king_if_attacked OUTPUT " + pie_sq);
    END();
    return pie_sq;
 }

 _kings_square(pie){
     var offset = 0, pie_sq;
    if(pie < 8) {
        offset = 0;
        pie_sq = this._pieces_on_board(0);
    } else {
        offset = 8;
        pie_sq = this._pieces_on_board(1);
    }
    for(var i = 0; i < pie_sq.length; i++){
        //console.log("i." + i + " " + this._piece(pie_sq[i]));
        if(this._piece(pie_sq[i]) == offset){
            sq = this._square(pie_sq[i]);
            break;
        }
    }
    return this.EB[sq];
 }

 _attacking_moves(sq_n, pie, bool = true){
     START("_attacking_moves");
    var rt = this._validate_params_valid_moves(sq_n, pie), mvs = [];
    if(Number.isInteger(rt)){
        if(rt === 0 || rt === 8){
            mvs =  this._king_moves(PRI_ENGINE._encode(sq_n, rt), bool);
        }else if(rt === 1 || rt === 9){
            mvs = this._queen_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 2 || rt === 10){
            mvs = this._rook_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 3 || rt === 11){
            mvs = this._bishop_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 4 || rt === 12){
            mvs =  this._horse_moves(PRI_ENGINE._encode(sq_n, rt));
        }else if(rt === 5 || rt === 13){
            mvs = this._pawn_moves(PRI_ENGINE._encode(sq_n, rt));
            //removing non attacking moves.
            var art = [], sq1, sq2;
            if(pie < 8) {
                sq1 = sq_n + 8; sq2 = sq_n + 16;
            }else {
                sq1 = sq_n - 8; sq2 = sq_n - 16;
            }
            console.log("mvs : " + mvs);
            for(var i = 0; i < mvs.length; i++){
                if(mvs[i] != sq1 && mvs[i] != sq2) art.push(mvs[i]);
            }
            mvs = art;
        }
    }END();
    return mvs;
 }

 /**
  * 
  * @param {Number} sq_n in encoded format Int32
  */
 _pawn_moves(sq_n){
    var mov = [], gyt = [], dir, offset = 0;
    if(this._piece(sq_n) > 8) offset = 8; 
    //console.log("_pawn_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
    for(dir = 0; dir < __DIRECTION.PAWN.length; dir++){
        gyt = this._go_in_direction(__DIRECTION.PAWN[dir] + offset, sq_n, __RANGE.PAWN);
        mov = add(mov, gyt);
        //console.log("_pawn_moves : for: " + mov);
    }//console.log("_pawn_moves : " + mov);
    
    //mov = this._go_straight_if_pawn(sq_n, mov);

    if(offset > 0) offset = -32;

    if(this._rank(sq_n) == 1) mov.push(this._square(sq_n) + 16 + offset);

    return mov;
 }

 /**
  * 
  * @param {number} sq_n in encoded format Int32 
  */
 _horse_moves(sq_n){
    var mov = [], gyt = [], dir, offset = 0;
    if(this._piece(sq_n) > 8) offset = 8; 
    //console.log("_horse_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
    for(dir = 0; dir < __DIRECTION.HORSE.length; dir++){
        gyt = this._go_in_direction(__DIRECTION.HORSE[dir] + offset, sq_n, __RANGE.HORSE);
        mov = add(mov, gyt);
        //console.log("_horse_moves : for: " + mov);
    }//console.log("Engine:PRI_ENGINE:_horse_moves= " + mov);
    //mov = this._go_straight(sq_n, mov);
    //console.log("Engine:PRI_ENGINE:_horse_moves= " + mov);
    return mov;
 }

 /**
  * 
  * @param {number} sq_n in encoded format Int32
  */
 _bishop_moves(sq_n){
     var mov = [],  gyt = [], dir, offset = 0;
     if(this._piece(sq_n) > 8) offset = 8; 
     //console.log("_horse_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
     for(dir = 0; dir < __DIRECTION.BISHOP.length; dir++){
         gyt = this._go_in_direction(__DIRECTION.BISHOP[dir] + offset, sq_n, __RANGE.BISHOP);
         mov = add(mov, gyt);
         //console.log("_horse_moves : for: " + mov);
     }//console.log("Engine:PRI_ENGINE:_bishop_moves= " + mov);
     //mov = this._go_straight(sq_n, mov);
     //console.log("Engine:PRI_ENGINE:_bishop_moves= " + mov);
     return mov;
 }

 /**
  * 
  * @param {number} sq_n in encoded format Int32
  */
 _rook_moves(sq_n){
    var mov = [],  gyt = [], dir, offset = 0;
    if(this._piece(sq_n) > 8) offset = 8; 
    //console.log("_rook_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
    for(dir = 0; dir < __DIRECTION.ROOK.length; dir++){
        gyt = this._go_in_direction(__DIRECTION.ROOK[dir] + offset, sq_n, __RANGE.ROOK);
        mov = add(mov, gyt);
        //console.log("_rook_moves : for: " + mov);
    }//console.log("Engine:PRI_ENGINE:_rook_moves= " + mov);
    //mov = this._go_straight(sq_n, mov);
    //console.log("Engine:PRI_ENGINE:_rook_moves= " + mov);
    return mov;
}

 /**
  * 
  * @param {number} sq_n in encoded format Int32
  */
 _queen_moves(sq_n){
    var mov = [],  gyt = [], dir, offset = 0;
    if(this._piece(sq_n) > 8) offset = 8; 
    //console.log("_queen_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
    for(dir = 0; dir < __DIRECTION.QUEEN.length; dir++){
        gyt = this._go_in_direction(__DIRECTION.QUEEN[dir] + offset, sq_n, __RANGE.QUEEN);
        mov = add(mov, gyt);
        //console.log("_queen_moves : for: " + mov);
    }//console.log("Engine:PRI_ENGINE:_queen_moves= " + mov);
    //mov = this._go_straight(sq_n, mov);
    //console.log("Engine:PRI_ENGINE:_queen_moves= " + mov);
    return mov;
}

/**
  * 
  * @param {number} sq_n in encoded format Int32
  */
__moves(sq_n){
    var mov = [],  gyt = [], dir, offset = 0;

    mov = add(mov, this._queen_moves(sq_n));
    //console.log("Engine:PRI_ENGINE:__moves  brf= " + mov);
    mov = add(mov, this._horse_moves(sq_n));

    mov = union(mov, mov);
    //console.log("Engine:PRI_ENGINE:__moves= " + mov);
    return mov;


    // if(this._piece(sq_n) > 8) offset = 8; 
    // //console.log("_queen_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
    // for(dir = 0; dir < __DIRECTION.DEFAULT.length; dir++){
    //     gyt = this._go_in_direction(__DIRECTION.DEFAULT[dir] + offset, sq_n, __RANGE.DEFAULT);
    //     mov = add(mov, gyt);
    //     //console.log("_queen_moves : for: " + mov);
    // }//console.log("Engine:PRI_ENGINE:_queen_moves= " + mov);
    // //mov = this._go_straight(sq_n, mov);
    // console.log("Engine:PRI_ENGINE:__moves= " + mov);
    // return mov;
}
/**
  * 
  * @param {number} sq_n in encoded format Int32
  */
 _king_moves(sq_n, bool){
    var mov = [],  gyt = [], dir, offset = 0;
    if(this._piece(sq_n) > 8) offset = 8; 
    //console.log("_queen_moves : DIR - __DIRECTION.PAWN : " + __DIRECTION.PAWN)
    for(dir = 0; dir < __DIRECTION.KING.length; dir++){
        gyt = this._go_in_direction(__DIRECTION.KING[dir] + offset, sq_n, __RANGE.KING);
        mov = add(mov, gyt);
        //console.log("_queen_moves : for: " + mov);
    }//console.log("Engine:PRI_ENGINE:_king_moves= " + mov);
    //mov = this._go_straight(sq_n, mov);
    //console.log("Engine:PRI_ENGINE:_KING_moves= " + mov);
    var mcd = [];
    if(bool){
        if(offset == 0)this._evaluate_infl(1);
        else this._evaluate_infl(0);
    
    //console.log("PRINTED EVALUATER INFL +++++  ");
    // for(var i = 0 ; i < 64; i++){
    //     console.log("i."+i+" " + this._infl(this.EB[i]));
    // }
    //console.log("PRINTED EVALUATER INFL  " + mov);
    for(var i = 0; i < mov.length; i++){
        if(offset == 0){
            if(this._infl(this.EB[mov[i]]) <= this._INI){
                mcd.push(mov[i]);
            }
        }else if(offset == 8){
            if(this._infl(this.EB[mov[i]]) > this._INI || this._infl(this.EB[mov[i]]) == this.ZERO){
                mcd.push(mov[i]);
            }
        }
    }//console.log("P  " + mcd);
    mov = mcd;
 }
    return mov;
}

 /**
  * removes all moves where pieces of self team if is present
  * @param {number} sq_n current square in encoded format Int32
  * @param {Array} mov filtering array
  */
 _go_straight(sq_n, mov){
    var art = [], player_type = (this._piece(sq_n) & 8) >> 3, current_sq_no = this._square(sq_n), front, offset;
    var i = 0, opie, other_player_type;
    //console.log("Engine:go_straight __Mov Len  "+mov.length+" l___mov "+mov);
    while(i < mov.length){
        opie = this._piece(this.EB[mov[i]]);
        //console.log("Mov i : " + mov[i]);
        other_player_type = (opie & 8) >>> 3;
        //console.log("Engine:PRI_ENGINE:_go_straight=%while==   i.("+i+") opie: " + opie + " TRUE&_is_piece :" + this._is_piece(opie));
        if(this._is_piece(opie)){
            if(player_type != other_player_type) art.push(mov[i]);
        }else art.push(mov[i]);
        i++;
    }//console.log("Engine:PRI_ENGINE:_go_straight= ___art: " + art);
    return art;
 }

 _evaluate_infl(player = 3){
    var df = [], mcv = [], mv = [];
    this._INI_INFL();
    df = this._pieces_on_board(player);
    //console.log("Pieces to evaluate of opposite player "+ player + " : Total len " + df.length);
    for(var i = 0; i < df.length; i++){
        console.log(this._piece(df[i]));
    }
    for(var i = 0; i < df.length; i++){
        mcv = this._attacking_moves(this._square(df[i]), this._piece(df[i]), false);
        //console.log("PRI_ENGINE:_evaluate_infl   $mcv: " + mcv);
        for(var j = 0; j < mcv.length; j++){
            //if(this._infl(this.EB[mcv[j]]) == this._INI || this._infl(this.EB[mcv[j]]) == this._REV) mv.push(mcv[j]);
            //console.log("Piece : df => " + this._piece(df[i]));
            this.set_infl_with_offset(mcv[j], __PIECE_INFL[this._piece(df[i])]);
        }   
    }return this._sum_infl();
 }

 /**
  * 
  * @param {number} player 0 for white 1 for black
  */
 _pieces_on_board(player = 3){
    var player_pieces = [];
    //console.log("INFL  LOOP    RECUR ");
    //console.log("PRI_ENGINE:_pieces_on_board $player :" + player);
    if(player == 3){
        player_pieces = add(player_pieces, this._pieces_on_board(0));
        player_pieces = add(player_pieces, this._pieces_on_board(1));
        //console.log("player_pieces : len "+ player_pieces.length + " player_pieces" + player_pieces);
        return player_pieces;
    }
    // var offset = 0;
    // if(player == 1) offset = 8;
    //console.log("Reached ..!!");
    for(var i = 0; i < 64; i++){
        if(player == 0){
            if(this._piece(this.EB[i]) < 6){
                player_pieces.push(this.EB[i]);
            }
        }else {
            if(this._piece(this.EB[i]) > 7 && this._piece(this.EB[i]) < 14){
                player_pieces.push(this.EB[i]);
            }
        }
    }return player_pieces;
 }

 /**
  * 
  * @param {number} sq_n curr square encoded format Int32
  * @param {Array} mov Array of possible moves 
  */
 _go_straight_if_pawn(sq_n, mov){
    var art = [], player_type = (this._piece(sq_n) & 8) >> 3, ce = this._square(sq_n), front, offset;
    //art = this._go_straight(sq_n, mov);
    if(player_type == 1) offset = -8;
    else offset = 8;
    front = this._square(sq_n) + offset;
    console.log("Engine:PRI_ENGINE:_straight_if_can = ___mov " + mov);
    var pty, opie, i = 0;
    while(i < mov.length){
        opie = this._piece(this.EB[mov[i]]);
        pty = (opie & 8) >>> 3;
        //console.log("_go_straight_if_can - opie :" + opie + "  pty : " + pty + "  player_type : " + player_type + " isPiece_opie :" +this._is_piece(opie) + " \nopie_square val : " + this.EB[mov[i]]);
        if(front == mov[i]){
            if(!this._is_piece(opie)) art.push(mov[i]);
        }
        else if (this._is_piece(opie)){
            if(pty != player_type){ //redundant check.
                art.push(mov[i]);
            }
        }
        i++;
    }
    if(offset < 0) offset = -32;
    else offset = 0;

    if(this._rank(sq_n) == 1) art.push(ce + 16 + offset);

    return art;
 }

 /**
  * return sq2 direction from sq1
  * @param {number} sq1 
  * @param {number} sq2 
  */
 _direction(sq1, sq2){
     var diff = sq2 - sq1;
     var xt = this._x(sq2) - this._x(sq1);
     var yt = this._y(sq2) - this._y(sq1);

    if(this._y(diff) == 0 && this._x(diff) > 0) return 0;
    else if(xt == 2  && yt == 1) return 1;
    else if(diff % 9 == 0) return 2;
    else if(xt == 1  && yt == 2) return 3;
    else if(diff % 8 == 0) return 4;
    else if(xt == -1  && yt == 2) return 5;
    else if(diff % 7 == 0) return 6;
    else if(xt == -2  && yt == 1) return 7;
    else if(this._y(diff) == 0 && this._x(diff) < 0 ) return 8;
    else if(xt == -2  && yt == -1) return 9;
    else if(diff * -1 % 9 == 0 ) return 10;
    else if(xt == -1  && yt == -2) return 11;
    else if(diff * -1 % 8 == 0) return 12;
    else if(xt == 1  && yt == -2) return 13;
    else if(diff * -1 % 7 == 0) return 14;
    else if(xt == 2  && yt == -1) return 15;
    else return -1;
 }

 /**
  * returns number array
  * range of piece(pie_) as first parameter, and direction rest parameters
  * see __DIRECTION reference for direction and __RANGE[] for range values
  * @param {Number} pie_ 
  */
 _direction_arr(pie_){
    if(pie_ === 0 || pie_ === 8 ) {
        return [__RANGE.KING, __DIRECTION.KING];
    } else if(pie_ === 1 || pie_ === 9) {
        return [__RANGE.KING, __DIRECTION.KING];
    } else if(pie_ === 2 || pie_ === 10) {
        return [__RANGE.KING, __DIRECTION.KING];
    } else if(pie_ === 3 || pie_ === 11) {
        return [__RANGE.KING, __DIRECTION.KING];
    } else if(pie_ === 4 || pie_ === 12) {
        return [__RANGE.KING, __DIRECTION.KING];
    } else if(pie_ === 5 || pie_ === 13){
        return [__RANGE.KING, __DIRECTION.KING];
    } else {
        return [__RANGE.KING, __DIRECTION.KING];
    }
 }

 /**
  * 
  * @param {number} dir 
  * @param {number} curr_sqn
  * @param {number} range 
  */
 _go_in_direction(dir, sq_n, range){
    //console.log("Engine:PRI_ENGINE:_go_in_direction=  ___sq_n : " + sq_n);
    var i, piece = this._piece(sq_n), sq = this._square(sq_n), nxt_piece = 0,cv, mov = [];
    dir &= 0xf; sq_n &= 0x40;  
    for(i = 0; i < range; i++){
        cv = this._transform(dir, sq, i + 1);
        //console.log("_transform : " + cv);
        if(cv != -1) {
            nxt_piece = this._piece(this.EB[cv]);
            //console.log("This.piece : "+piece+" NxT piece : " + nxt_piece);
            //console.log("This.piece : "+piece+" NxT piece : " + nxt_piece + " _player this.piece : " + this._player(piece) + ", Nxt Piece : " + this._player(nxt_piece) + "  _is_piece nxt piece: " + this._is_piece(nxt_piece) );
            if(this._is_piece(nxt_piece)){
                mov.push(cv); 
                break;
            } 
         // if(piece === nxt_piece) break;
            else if(!this._is_piece(nxt_piece)){ 
                mov.push(cv);
            }else{
                mov.push(cv);
                break;
            }
        }else break;
    }//console.log("_go_in_direction : " + mov);
    return mov;
 }

 /**
  * 
  * @param {number} dir < 16, odd dir for horse moves
  * @param {number} sq current square, center square
  * @param {number} dist distance in direction dir away from center sq
  */
 _transform(dir, sq, dist){
    var nc = 0;
    var x = this._x(sq), y = this._y(sq);
    if(sq < 0 && sq > 63 && !Number.isInteger(sq)) return -1;

    //console.log("T:_dir : " + dir + " _sq :" + sq + " _dist:" + dist);
     if(dir == 0){
        if(this._x(sq + dist) - x > -1 && this._y(sq + dist) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return sq + dist;
        return -1;
     }else if(dir == 1){
        nc = sq + 10;
        if(this._x(nc) - x > -1 && this._y(nc) - y > -1 && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
     }else if(dir == 2){
         nc = sq + dist * 9;
         if(this._x(nc) - x > -1 && this._y(nc) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
         return -1;
     }else if(dir == 3){
        nc = sq + 17;
        if(this._x(nc) - x > -1 && this._y(nc) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 4){
         nc = sq + dist * 8;
         if(this._x(nc) - x > -1 && this._y(nc) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
         return -1; 
    }else if(dir == 5){
        nc = sq + 15;
        if(this._x(nc) - x < 1 && this._y(nc) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 6){
        nc = sq + dist * 7;
        if(this._x(nc) - x < 1 && this._y(nc) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 7){
         nc = sq + 6;
         if(this._x(nc) - x < 1 && this._y(nc) - y > -1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 8){
         nc = sq - dist;
         if(this._x(nc) - x < 1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 9){
        nc = sq - 10;
        if(this._x(nc) - x < 1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 10){
        nc = sq - dist * 9;
        if(this._x(nc) - x < 1 && this._y(nc) - y < 1 && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 11){
        nc = sq - 17;
        if(this._x(nc) - x < 1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 12){
        nc = sq - dist * 8;
        if(this._x(nc) - x < 1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir == 13){
        nc = sq - 15;
        if(this._x(nc) - x > -1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir === 14){
        nc = sq - 7 * dist;
        if(this._x(nc) - x > -1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else if(dir === 15){
        nc = sq - 6;
        if(this._x(nc) - x > -1 && this._y(nc) - y < 1  && this._y(nc) != -1 && this._x(nc) != -1) return nc;
        return -1;
    }else return -1;
 }
}

class Convert{
/**
 * convert to engine board
 * @param {Array} gui 
 */
static to_engine_board(gui){
    var eng = [], piece, square, i;
    for(i = 0; i < gui.length; i++){
        // console.log("to_engine_board : i -" + i + " Piece_gui : " + gui[i] + " Piece{STD} : " + __PIECES_STD[gui[i]]);
        eng[i] = PRI_ENGINE._encode(i, __PIECES_STD[gui[i]]);
    }
    console.log(eng);
    return eng;
}
}

/**
* Protype function ...
*/

/**
* Will add array 'arr' elements  to this array
* @param {Array} arr 
*/
Array.prototype.add = function(arr){
for(ele in arr){
    this.push(ele);
}
}

/**
* 
* @param {Array} arr1 
* @param {Array} arr2 
*/
const add = function(arr1, arr2){
var i = 0;
for(i = 0; i < arr2.length; i++){
    arr1.push(arr2[i]);
}return arr1;
}

/**
* returns arr[] with elements common in both array
* @param {Array} arr1 array 1
* @param {Array} arr2 array 2 
*/
const intersect = function(arr1 , arr2){
var i; res = [];
for(i = 0; i < arr1.length; i++){
    if(arr2.includes(arr1[i]) && !res.includes(arr1[i])) res.push(arr1[i]);
}return res;
}

/**
* returns arr[] with all elements in both array
* @param {Array} arr1 array 1
* @param {Array} arr2 array 2 
*/
const union = function(arr1, arr2){
    var i; res = [];
    for(i = 0; i < arr1.length; i++){
        if(!res.includes(arr1[i])) res.push(arr1[i]);
    }
    for(i = 0; i < arr2.length; i++){
        if(!res.includes(arr2[i])) res.push(arr2[i]);
    }
    return res;   
}

const in_direction = function(arr1, dir){
 
}

