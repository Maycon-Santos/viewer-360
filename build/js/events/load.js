V360.prototype.onload = function(props){

    return e => {

        props.loadedImages++;

        e.target.realWidth = e.target.width;
        e.target.realHeight = e.target.height;

        // If did not load all images ends here
        if(props.loadedImages < props.frames && !props.sprite) return;

        props.allLoaded = props.allowDrag = true;

        this.resizeImage(props);
        this.setImage(props, props.currentFrame);

        if(typeof props.target.v360.onload == 'function')
            props.target.v360.onload();

    }

}