V360.prototype.onmousedown = function(props){

    return e => {

        if(!props.allowDrag) return;

        props.mousePressing = true;
        props.mouseStart = e.pageX;

    }

}