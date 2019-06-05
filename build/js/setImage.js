V360.prototype.setImage = function(props, n){

    if(!props.allLoaded) return;

    const $canvas = props.canvas.target;
    const ctx = props.canvas.ctx;
    const imgs = props.imgs;
    const frames = props.frames;
    const sprite = !!props.sprite;

    const $img = imgs[sprite ? 0 : n];

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    if(sprite){

        const pos = -(($img.width / frames) * n);
        const spriteWidth = $img.width / frames;

        ctx.drawImage($img, pos, 0, $img.width, $img.height);

        ctx.clearRect(spriteWidth, 0, $canvas.width - spriteWidth, $canvas.height);
        
    }else {
        console.log($img, n)
        ctx.drawImage($img, 0, 0, $img.width, $img.height);
    }

}