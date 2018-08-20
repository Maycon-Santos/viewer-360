V360.prototype.onload = function(props){

    return e => {

        props.loadedImages++;

        if(props.loadedImages < props.frames && !props.sprite) return;

        this.resizeImage(props);

        this.setImage(props, props.currentFrame);

        this.onmousedown(props);
        this.onmouseup(props);
        this.onmousemove(props);

    }

}