V360.prototype.onmousedown = function(props){

    return e => {

        props.mousePressing = true;
        props.mouseStart = e.pageX;

    }

}