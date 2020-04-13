class UiSquare extends Component{
    constructor(props){
        super(props)
        this.sq_id = props.sq_id;
        this.piece_id = this.set_piece_id(this.sq_id);
        this.attacked = false
        this.state = {sq_id : this.sq_id, statex : this.statex},
        this.divid = props.divid
        this.check_if_cntrl_clicked = this.check_if_cntrl_clicked.bind(this);
        objects.add(this)
    }
    componentDidMount() {
        console.debug(`Basic Square Mounted with HTML`)
        // this.draw_square()
        this.draw_name()
        if(this.attacked){
            this.highlight_square()
        }
    }

    componentDidUpdate(){
        this.clear()
        this.draw_name()
        if(this.attacked){
            this.highlight_square()
        }
    }

    shouldComponentUpdate(){ 
        this.check_if_cntrl_clicked()
        this.set_piece_id(this.sq_id)
        this.attacked = this.statex.contains(this.sq_id)
        return true
    }
    

    check_if_cntrl_clicked(){
        if(this.statex.cntrl.type != 'nan'){
            this.statex.board.eboard.cntrl(this.statex.cntrl.type);
            this.statex.set_cntrl('nan');
            this.setState() // initiates react re-render mechanism
        }
    }

    clicked_square(){
        this.statex.set_sq_n(this.sq_id) 
        if(this.statex.move()){
            return;
        }
    } 

    clear(){
        const canvas = document.getElementById(`${this.sq_name()}`)
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    draw_square(){
        let k = this.sq_id;
        var color;
        if((k.f ^ k.r) & 1) color = config.WHITE
        else color = config.BLACK
    
        const canvas = document.getElementById(`${this.sq_name()}`)
        console.info(`canvas : ${canvas}`)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

    }
    highlight_square(){
        const canvas = document.getElementById(`${this.sq_name()}`)
        const ctx = canvas.getContext("2d")
        var x = canvas.width / 2, y = canvas.height / 2;
        ctx.arc(x, y, 0.3 * x, 0, 2 * Math.PI)
        ctx.fillStyle = config.HIGHLIGHT
        ctx.fill()
    }

    draw_name(){
        const canvas = document.getElementById(`${this.sq_name()}`)
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "#000"
        ctx.font = "12px Courier"

        ctx.fillText(this.sq_name(), converter.vh2px(0.5), this.props.height - converter.vh2px(0.8))
        ctx.fillText(this.sq_name('x88'), this.props.width - converter.vh2px(4), this.props.height - converter.vh2px(0.8))
    }

    sq_color(){
        let k = this.props.sq_id;
        return constant.bw_cname[~(k.f ^ k.r) & 1]
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

    rerender(){
        document.getElementById(`${this.sq_name()}-svg`).innerHTML = `${SVG.piece_svg(this.piece_id, 50)}`
    }
    render(){
        return  `<div id = '${this.sq_name()}-square' class = ${this.sq_color()} onClick = 'Click.clicked_square(${this.sq_id.r}, ${this.sq_id.f})' style = 'width: ${config.SQ_SIZE}px; height:${config.SQ_SIZE}px; margin:-4px;'>
                    <div id = '${this.sq_name()}-svg' class= "posi" style="position:absolute;width:${config.SQ_SIZE}px;height:${config.SQ_SIZE}px;"> ${SVG.piece_svg(this.piece_id, 50)}</div>
                    <canvas ref = "canvas" id = ${this.sq_name()} className= 'posi' width = ${this.props.width} height =${this.props.height} style="position:absolute"/>
                </div>`
        
    }
}