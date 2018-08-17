V360.prototype.setImage = function($canvas, ctx, imgs, n, frames){

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    // If length == 1 is a sprite
    if(imgs.length > 1)
        ctx.drawImage(imgs[n], 0, 0, imgs[n].width, imgs[n].height);
    else{
        ctx.drawImage(imgs[0],
            -((imgs[0].width / frames) * n),
            0,
            imgs[0].width,
            imgs[0].height
        );
    }

}