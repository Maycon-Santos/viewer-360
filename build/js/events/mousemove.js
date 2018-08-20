V360.prototype.onmousemove = function(props){

    return e => {

        e.preventDefault();

        if(!props.mousePressing) return;

        let mouseMoved = (props.mouseStart - e.pageX) / props.dragSensitivity;

        if(mouseMoved > 1) mouseMoved = 1;
        if(mouseMoved < -1) mouseMoved = -1;

        if(mouseMoved == 1 || mouseMoved == -1){

            props.mouseStart = e.pageX;

            let roundMouseMoved = Math.round(mouseMoved);

            props.currentFrame += roundMouseMoved / Math.abs(roundMouseMoved);

            if(props.currentFrame > props.frames - 1) props.currentFrame = 0;
            if(props.currentFrame < 0) props.currentFrame = props.frames - 1;

            this.setImage(props, props.currentFrame);

        }

    }

}