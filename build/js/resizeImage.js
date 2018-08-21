V360.prototype.resizeImage = function(props){

    const $canvas = props.canvas.target;
    const imgs = props.imgs;
    const sprite = !!props.sprite; // Is a sprite
    const frames = props.frames;

    for(let i = 0, l = imgs.length; i < l; i++){

        const $img = imgs[i];

        if(sprite) $img.realWidth = $img.realWidth / frames;

        // Simple rule of 3
        $img.height = ($img.realHeight * $canvas.width) / $img.realWidth;
        $img.width = $canvas.width;

        if($img.width > $canvas.width || $img.height > $canvas.height){

            // Simple rule of 3
            $img.height = $canvas.height;
            $img.width = ($img.realWidth * $canvas.height) / $img.realHeight;

        }

        if(sprite) {
            $img.width = $img.width * frames;
            $img.realWidth = $img.realWidth * frames;
        }

    }

}