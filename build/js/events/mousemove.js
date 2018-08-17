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

            props.currentImg += roundMouseMoved / Math.abs(roundMouseMoved);

            if(props.currentImg > props.frames - 1) props.currentImg = 0;
            if(props.currentImg < 0) props.currentImg = props.frames - 1;

            this.setImage(props.canvas.target, props.canvas.ctx, props.imgs, props.currentImg, props.frames);

        }

    }

}