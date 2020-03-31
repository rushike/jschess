class Component{
    constructor(props){
        this.props = props;
        this.statex = props.statex;
    }
    setState(){
        this.statex.update = true
        var event = new Event('update');
        var body = document.getElementsByTagName('body')[0]
        body.addEventListener('update', Game.update_all(this))
        body.dispatchEvent(event)

    }
}

