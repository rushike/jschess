class Game {
    
    constructor(div){
        this.mount_board()
    }
    /**
     * The mount function instantiate neccessary components require to play game
     */
    mount_board(){
        this.board = new UiBoard(props = {id : div})        // This is construtor init phase

        this.config = JSON.parse(JSON.stringify(config));   // | This can termed as 
        this.config.BOARD = this.board                      // | getDerivedStateFromProps phase
        
        $("#test").html(board.render())                     // This is render phase
        
        board.componentDidMount()                           // This is Did Mount phase
    }

    /**
     * The update function needs to be call when the State is changed. 
     * Every Component in game has this.statex varible which is object of class State
     */
    update(){

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