const redox = './images/redo_icon.svg'

const undox = './images/undo_icon.svg'

const blank = './images/blank.svg'

var config = {
        WHITE :     '#f8ecec',
        BLACK :     '#ffa500',
        HIGHLIGHT : '#646400',
        CONTROLLER : {
                redo : redox,
                undo : undox,
                blank : blank
        },
        SQ_SIZE: 10,
        BOARD : null
};

class Component{
    constructor(props){
        this.props = props;
    }
}

class converter{
    static vh2px(value) {
        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      
        var result = (y*value)/100;
        return result;
      }
      static vw2px(value) {
        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      
        var result = (x*value)/100;
        return result;
      }

      static percent2px(value, rootdivid = 'chess-board') {
        var g = document.getElementById(rootdivid);
        var x = g.clientWidth,
          y = g.clientHeight; 
        const result = {
            x : (x*value)/100,
            y : (y*value)/100
        };
        return result;
      }
}

class State{
    constructor(board){
        this.board = board ? board : null; 
        this.sq_n = null;
        this.valid_moves = [];
        this.clicked = false;
        this.movenow = false;
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


class Click{
    static clicked_square(r, f){
        console.log("square clicked : id ", r, f)
        config.BOARD.ui_board[r][f].clicked_square()
        config.BOARD.clicked_board()
        return
    }

    static clicked_board(){
        console.log("board clicked")
        return
    }
}

class UiSquare extends Component{
    constructor(props){
        super(props)
        this.statex = props.statex;
        this.sq_id = props.sq_id;
        this.piece_id = this.set_piece_id(this.sq_id);
        this.attacked = false
        this.state = {sq_id : this.sq_id, statex : this.statex},
        this.divid = props.divid
        this.check_if_cntrl_clicked = this.check_if_cntrl_clicked.bind(this);
    }
    componentDidMount() {
        console.debug(`Basic Square Mounted with HTML`)
        // this.draw_square()
        this.draw_name()
        if(this.attacked){
            this.highlight_square()
        }
    }

    shouldComponentUpdate(){ 
        this.check_if_cntrl_clicked()
        this.set_piece_id(this.sq_id)
        return true
    }
    

    check_if_cntrl_clicked(){
        if(this.statex.cntrl.type != 'nan'){
            this.statex.board.eboard.cntrl(this.statex.cntrl.type);
            this.statex.set_cntrl('nan');
            this.setState({statex : this.statex.get()}) // initiates react re-render mechanism
        }
    }

    clicked_square(){
        this.statex.set_sq_n(this.sq_id) 
        if(this.statex.move()){
            return;
        }
    } 

    draw_square(){
        let k = this.sq_id;
        var color;
        if((k.f ^ k.r) & 1) color = config.WHITE
        else color = config.BLACK
    
        const canvas = $(`#${this.sq_name()}`)[0]
        console.info(`canvas : ${canvas}`)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

    }
    highlight_square(){
        const canvas = $(`#${this.sq_name()}`)[0]
        const ctx = canvas.getContext("2d")
        var x = canvas.width / 2, y = canvas.height / 2;
        ctx.arc(x, y, 0.3 * x, 0, 2 * Math.PI)
        ctx.fillStyle = config.HIGHLIGHT
        ctx.fill()
    }

    draw_name(){
        const canvas = $(`#${this.sq_name()}`)[0]
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "#000"
        ctx.font = "12px Courier"

        ctx.fillText(this.sq_name(), converter.vh2px(0.5), this.props.height - converter.vh2px(0.8))
        ctx.fillText(this.sq_name('x88'), this.props.width - converter.vh2px(3), this.props.height - converter.vh2px(0.8))
    }

    sq_color(){
        let k = this.props.sq_id;
        return constant.bg_cname[~(k.f ^ k.r) & 1]
    }

    set_piece_id(k){
        // console.debug(`statex.board : ${this.statex.board.eboard.board}`, this.statex.board)
        this.piece_id = this.statex.board.eboard.board[k.r][k.f].piece.piece_id//E.__PIECES_STD[w]
        return this.piece_id
    }

    sq_name(type = '8x8'){
        let k = this.props.sq_id;
        if(type == '8x8') return constant.FILE[k.f] + k.r.toString()
        else if(type == 'x88') return (k.r << 4) | k.f 
    }

    render(){
        // this.attacked = this.statex.contains(this.sq_id)
        return  `<div class = ${this.sq_color()} onClick = 'Click.clicked_square(${this.sq_id.r}, ${this.sq_id.f})' style = 'width: ${config.SQ_SIZE}vh; height:${config.SQ_SIZE}vh;'>
                    <div class= "posi" style="position:absolute;width:${config.SQ_SIZE}vh;height:${config.SQ_SIZE}vh;"> ${SVG.piece_svg(this.piece_id, 50)}</div>
                    <canvas ref = "canvas" id = ${this.sq_name()} className= 'posi' width = ${this.props.width} height =${this.props.height} style="position:absolute"/>
                </div>`
        
    }
}

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
            this.setState({statex : this.statex.get()}) // initiates react re-render mechanism
        }
    }

    clicked_board(){
        console.log("Clicked board")
        var mv = this.eboard.move(this.statex.sq_n.r, this.statex.sq_n.f)
        console.log(`sq_n statex : ${this.statex}`, this.statex)
        var valid_moves = this.eboard.valid_moves(this.statex.sq_n.r, this.statex.sq_n.f) // (f, r) == > (x, y)  x --> coloums ==> files  ,,   y --> rows    ==> ranks
        console.log(`valid_moves statex : ${this.statex}`, this.statex)
        this.statex.set_valid_moves(valid_moves)
        this.statex = this.statex.get() // initiates rect re-render mechanism
        console.log(`last statex : ${this.statex}`, this.statex)
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