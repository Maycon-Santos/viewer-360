V360.prototype.onresize = function(props){

    return () => {

        const $target = props.target;
        const $canvas = props.canvas.target;

        // If the container changes size
        if($canvas.width != $target.offsetWidth || $canvas.height != $target.height){

            const currentFrame = props.currentFrame;

            this.resizeCanvas($target, $canvas);
            this.resizeImage(props);

            this.setImage(props, currentFrame);
            
        }

    }
    
}