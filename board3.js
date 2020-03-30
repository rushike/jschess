import React, { Component } from 'react'
import Square from './square.jsx'

import State from './utils.js'


import {E} from './engine.js'
import './style.css'

class Board extends Component{
    constructor(props){
        super(props);
        this.statex = props.statex.set_board(this);
        this.eboard = new E.Board(); //ab
        this.state = {engine : this.eboard, statex : this.statex}

        this.clicked_board = this.clicked_board.bind(this);
        this.check_if_cntrl_clicked = this.check_if_cntrl_clicked.bind(this);

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
        var mv = this.eboard.move(this.statex.sq_n.f, this.statex.sq_n.r)
        var valid_moves = this.eboard.valid_moves(this.statex.sq_n.f, this.statex.sq_n.r) // (f, r) == > (x, y)  x --> coloums ==> files  ,,   y --> rows    ==> ranks
        this.statex.set_valid_moves(valid_moves)
        this.setState({statex : this.statex.get()}) // initiates rect re-render mechanism
    }

    draw_row(j){
        let row = []
        for(var i = 0; i < 8; i++){
            row.push(
                <span >
                    <Square sq_id  = {{r : j, f : i}} statex = {this.statex} width = '80' height = '80' color = 'null'/>
                </span>
                )
        }return row
    }

    draw_board(){
        let board = []
        for(var i = 7; i >= 0; i--){
            board.push(
                <div>
                    {this.draw_row(i)}
                </div>
            )
        }return board
    }

    render(){
        return (
            <div onClick = {this.clicked_board}>
                {this.draw_board()}
            </div>
        )
    }
}

export default Board;