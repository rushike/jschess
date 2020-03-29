class Game {
    constructor(){
        this.board = new Board()
    }

    move(){
        var c = this.board_index(i, j)
        i = c.x; j = c.y
        this.board.move(i, j)
        this.hold_flag = !this.hold_flag;
        this.board.valid_moves(i, j)
    }
    valid_moves(){
        var c = this.board_index(i, j)
        i = c.x; j = c.y
        this.hold_flag = !this.hold_flag;
        this.board.valid_moves(i, j)
    }
}