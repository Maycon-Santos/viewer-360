V360.prototype.onmousemove = function(props){

    return e => {

        // If is mouse event set preventDefault()
        if(e.type != 'touchmove') e.preventDefault();

        // If you did not start the drag stop here
        if(!props.mousePressing) return;

        // Saves the mouse or touch point current
        const pageX = e.pageX || e.touches[0].screenX;

        let mouseMoved = (props.mouseStart - pageX) / props.dragSensitivity;

        // Reverse the number pole
        if(mouseMoved > 1) mouseMoved = 1;
        if(mouseMoved < -1) mouseMoved = -1;

        if(Math.abs(mouseMoved) == 1){

            // Switches the starting point to the current
            props.mouseStart = pageX;

            let roundMouseMoved = Math.round(mouseMoved);

            props.currentFrame += roundMouseMoved / Math.abs(roundMouseMoved);

            // If the frame is greater than the maximum frame it returns to 0
            if(props.currentFrame > props.frames - 1) props.currentFrame = 0;

            // If the frame is below 0 it will be the maximum
            if(props.currentFrame < 0) props.currentFrame = props.frames - 1;

            // Draw image
            this.setImage(props, props.currentFrame);

        }

    }

}