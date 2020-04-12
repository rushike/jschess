class State{
    constructor(board){
        this.board = board ? board : null; 
        this.sq_n = null;
        this.valid_moves = [];
        this.clicked = false;
        this.movenow = false;
        this.update = false;
        this.cntrl = {type : 'nan'};
        
    }
    get(){
        this.clicked = !this.clicked;
        return this;
    }
    move(){
        if(this.contains(this.sq_n)){ // x ==? f,   y ==? r
            this.movenow = true
        }else this.movenow = false
        return this.movenow;
    }
    
    contains(n_sq_n){
        // console.log("valid_moves ", this.valid_moves.map(x => this.x88_sq_id({r : x.y, f : x.x})), "n_sq_n", this.x88_sq_id(n_sq_n))
        return this.valid_moves.map(x => this.x88_sq_id({r : x.y, f : x.x})).includes(this.x88_sq_id(n_sq_n))
    }

    set_cntrl(type){
        this.cntrl.type = type;
    }

    set_board(board){
        this.board = board;
        return this;
    }

    set_sq_n(sq_n){
        this.clicked = true;
        this.sq_n = sq_n;
    }
    set_valid_moves(valid_moves){
        this.clicked = true;
        this.valid_moves = valid_moves;
    }
    set(sq_n, valid_moves){
        this.clicked = true;
        this.valid_moves = valid_moves;
        this.sq_n = sq_n
    }
    x88_sq_id(sq_n){
        if(sq_n) return (sq_n.r << 4) | sq_n.f
        if(this.sq_n == null) return null;
        return (this.sq_n.r << 4) | this.sq_n.f;
    }
}

const games = []
