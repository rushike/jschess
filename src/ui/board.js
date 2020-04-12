class UiBoard extends Component{
    constructor(props){
        super(props);
        this.divid = props.id
        this.eboard = new E.Board(); //ab
        this.state = {engine : this.eboard, statex : this.statex}
        this.statex = new State(this)
        this.ui_board = this.init_ui_board()
        this.clicked_board = this.clicked_board.bind(this);
        this.check_if_cntrl_clicked = this.check_if_cntrl_clicked.bind(this);
        objects.add(this)
    }

    init_ui_board(){
        let ui_board = []
        console.debug(`divid : ${this.divid}`)
        for(var i = 0; i < 8; i++){
            ui_board.push([])
            for(var j = 0; j < 8; j++){
                ui_board[i].push(new UiSquare(
                    {
                        sq_id : {
                            r : j,
                            f : i
                        },
                        statex : this.statex,
                        width : converter.vh2px(config.SQ_SIZE), // in pixels
                        height : converter.vh2px(config.SQ_SIZE), // in pixels
                        color : null,
                        divid : this.divid
                    }
                ))
            }
        }
        return ui_board;
    }
    componentDidMount(){
        for(var i = 0; i < this.ui_board.length; i++){
            for(var j = 0; j < this.ui_board.length; j++){
                this.ui_board[i][j].componentDidMount()
            }
        }
    }
    componentDidUpdate(){
    }

    shouldComponentUpdate(){
        // this.check_if_cntrl_clicked();
        return true;
    }

    check_if_cntrl_clicked(){
        if(this.statex.cntrl.type != 'nan'){
            this.eboard.cntrl(this.statex.cntrl.type);
            this.statex.set_cntrl('nan');
            this.setState() // initiates react re-render mechanism
        }
    }

    clicked_board(){
        var mv = this.eboard.move(this.statex.sq_n.r, this.statex.sq_n.f)
        
        var valid_moves = this.eboard.valid_moves(this.statex.sq_n.r, this.statex.sq_n.f) // (f, r) == > (x, y)  x --> coloums ==> files  ,,   y --> rows    ==> ranks
        
        this.statex.set_valid_moves(valid_moves)
        this.statex = this.statex.get() // initiates rect re-render mechanism
        
        this.setState()
    }

    draw_row(j){
        let row = []
        for(var i = 0; i < 8; i++){
            row.push(
                // <Square sq_id  = {{r : j, f : i}} statex = {this.statex} width = '80' height = '80' color = 'null'/>
                `<div style = "display:inline-block">
                    ${this.ui_board[i][j].render()}
                </div>` 
                )
        }return row
    }
    draw_board(){
        let board = []
        for(var i = 7; i >= 0; i--){
            board.push(
                `<div>
                    ${this.draw_row(i)}
                </div>`
            )
        }return board
    }
    uistring(){
        var div_board  = this.draw_board()
        var string = '';
        for(var i = 0; i < div_board.length; i++){
            for(var j = 0; j < div_board[i].length; j++){
                string += div_board[i][j]
            }
        }return string
    }
    render(){
        console.debug()
        return `<div >
                    ${this.uistring()} 
                </div>`
    }
}


// export const Component;
// export const Click;
// export const Square;
// export const Board;
