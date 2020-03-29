import React, { Component } from 'react'
import CONST from './const'

import config from './config.js'

import piece_svg from './pieces.js'
import {E} from './engine.js'

import './style.css'




class Square extends Component{
    constructor(props){
        super(props)
        this.statex = props.statex;
        this.sq_id = props.sq_id;
        this.piece_id = this.set_piece_id(this.sq_id);
        this.attacked = false
        this.state = {sq_id : this.sq_id, statex : this.statex}

        this.clicked = this.clicked.bind(this)
        this.check_if_cntrl_clicked = this.check_if_cntrl_clicked.bind(this);
    }
    componentDidMount() {
        this.draw_square()
        this.draw_name()
        if(this.attacked){
            this.highlight_square()
        }
    }

    componentDidUpdate() {
        this.draw_square()
        this.draw_name()
        if(this.attacked){
            this.highlight_square()
        }
    }

    shouldComponentUpdate(){ 
        // console.log("Square Should Component Update : .. .. . .. .")
        this.check_if_cntrl_clicked()
        this.set_piece_id(this.sq_id)
        return true
    }
    

    check_if_cntrl_clicked(){
        if(this.statex.cntrl.type != 'nan'){
            // console.log("undo or redo clicked ... .. . . ");
            this.statex.board.eboard.cntrl(this.statex.cntrl.type);
            this.statex.set_cntrl('nan');
            this.setState({statex : this.statex.get()}) // initiates react re-render mechanism
        }
    }

    clicked(){

        this.statex.set_sq_n(this.sq_id) 
        if(this.statex.move()){
            return;
        }
        this.setState({})
    } 

    draw_square(){
        let k = this.sq_id;
        var color;
        if((k.f ^ k.r) & 1) color = config.WHITE
        else color = config.BLACK
    
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

    }
    highlight_square(){
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        var x = canvas.width / 2, y = canvas.height / 2;
        ctx.arc(x, y, 0.3 * x, 0, 2 * Math.PI)
        ctx.fillStyle = config.HIGHLIGHT
        ctx.fill()
    }

    draw_name(){
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "#000"
        ctx.font = "12px Courier"

        ctx.fillText(this.sq_name(), 10, this.props.height - 10)
        ctx.fillText(this.sq_name('x88'), this.props.width - 25, this.props.height - 10)
    }

    sq_color(){
        let k = this.props.sq_id;
        return CONST.BW_CNAME[~(k.f ^ k.r) & 1]
    }

    set_piece_id(k){
        this.piece_id =  this.statex.board.eboard.board[k.r][k.f].piece.piece_id//E.__PIECES_STD[w]
        return this.piece_id
    }

    sq_name(type = '8x8'){
        let k = this.props.sq_id;
        if(type == '8x8') return CONST.FILE[k.f] + k.r.toString()
        else if(type == 'x88') return (k.r << 4) | k.f 
    }

    render(){
        this.attacked = this.statex.contains(this.sq_id)
        return (
            <span onClick = {this.clicked}>
                <span className= 'posi'  >{piece_svg(this.piece_id, 50)} </span>   
                <canvas ref = "canvas"  className= 'posi' className= {this.sq_color()} width = {this.props.width} height = {this.props.height}  />
            </span>
        )
    }
}


export default Square;