const games = []

class Game {
    
    constructor(props){
        this.mount_board(props.id)

        games.push(this)
    }
    static update_all(instance){
        for(var i in games){
            games[i].update(instance)
        }
    }

    /**
     * The mount function instantiate neccessary components require to play game
     */
    mount_board(id){
        this.board = new UiBoard(props = {id : id})        // This is construtor init phase

        this.config = JSON.parse(JSON.stringify(config));   // | This can termed as 
        this.config.BOARD = this.board                      // | getDerivedStateFromProps phase
        
        $("#test").html(this.board.render())                     // This is render phase
        
        this.board.componentDidMount()                           // This is Did Mount phase
    }

    /**
     * The update function needs to be call when the State is changed. 
     * Every Component in game has this.statex varible which is object of class State
     */
    update(instance){
        for(var i in instance.ui_board){
            for(var j in instance.ui_board[i]){
                if(instance.ui_board[i][j].shouldComponentUpdate()){
                    instance.ui_board[i][j].rerender()
                    instance.ui_board[i][j].componentDidUpdate()
                    
                }
            }
        }
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