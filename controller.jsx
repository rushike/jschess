import React, {Component} from 'react';
import config from './config.js'

import redo from './images/redo_icon.svg'


class CButton extends Component{
    constructor(props){
        super(props);
        this.statex = props.statex;
        this.state = {statex : this.statex};
        this.type = props.type;
        this.svg = config.CONTROLLER[ props.type.toLowerCase() ] ;

        this.clicked = this.clicked.bind(this);
    }
    componentDidMount(){
        

    }
    componentDidUpdate(){

    }


    clicked(){
        this.statex.set_cntrl(this.type);
        this.setState({statex : this.statex.get()});
    }

    render(){
        return (
            <span>
                <img src = {this.svg} onClick = {this.clicked} width = "80" height = "80" />
            </span>
        );
    }
}

class Controller extends Component{
    constructor(props){
        super(props);
        this.statex = props.statex;
        this.state = {statex : props.statex}
    }

    render(){
        return (
            <div>
                <CButton type = 'undo'  statex = {this.statex} > </CButton>
                <CButton type = 'blank' statex = {this.statex} > </CButton>
                <CButton type = 'redo'  statex = {this.statex} > </CButton>
            </div>
        )
    }
}


export default Controller;
export {CButton}
