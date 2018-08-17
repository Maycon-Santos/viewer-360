V360.prototype.onresize = function(props){

    return () => {

        const $target = props.target;
        const $canvas = props.canvas.target;

        if($canvas.width != $target.offsetWidth || $canvas.height != $target.height){

            const ctx = props.canvas.ctx;
            const imgs = props.imgs;
            const currentImg = props.currentImg;

            this.resizeCanvas($target, $canvas);
            this.resizeImage($canvas, imgs);

            this.setImage($canvas, ctx, imgs, currentImg, props.frames);
            
        }

    }
    
}