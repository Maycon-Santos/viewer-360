V360.prototype.onload = function(props){

    const $canvas = props.canvas.target;
    const ctx = props.canvas.ctx;
    const imgs = props.imgs;

    return e => {

        props.loadedImages++;

        if(props.loadedImages < props.frames && !props.sprite) return;

        this.resizeImage($canvas, imgs);

        this.setImage($canvas, ctx, imgs, props.currentImg, props.frames);

        this.onmousedown(props);
        this.onmouseup(props);
        this.onmousemove(props);

    }

}