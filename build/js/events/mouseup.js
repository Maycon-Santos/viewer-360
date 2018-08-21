V360.prototype.onmouseup = function(props){

    return () => {

        // Serves to inform the other functions that the user stopped dragging
        props.mousePressing = false;
        props.mouseStart = 0;

    }

}