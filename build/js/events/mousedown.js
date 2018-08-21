V360.prototype.onmousedown = function(props){

    return e => {

        // If drag dont's allowed stop here
        if(!props.allowDrag) return;

        // Serves to inform the other functions that the user began to drag
        props.mousePressing = true;

        // Saves the mouse or touch point
        props.mouseStart = e.pageX || e.touches[0].screenX;

    }

}