V360.prototype.onmouseup = function(props){

    return () => {

        props.mousePressing = false;
        props.mouseStart = 0;

    }

}