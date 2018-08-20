V360.prototype.resizeImage = function(props){

    const $canvas = props.canvas.target;
    const imgs = props.imgs;
    const sprite = !!props.sprite;
    const frames = props.frames;

    for(let i = 0, l = imgs.length; i < l; i++){

        const $img = imgs[i];
        
        if($canvas.width <= $canvas.height){

            if(sprite) $img.width = $img.width / frames;

            $img.height = ($img.height * $canvas.width) / $img.width;
            $img.width = $canvas.width;

            if(sprite) $img.width = $img.width * frames;

        }else{

            if(sprite) $img.width = $img.width / frames;

            $img.width = ($img.width * $canvas.height) / $img.height;
            $img.height = $canvas.height;

            if(sprite) $img.width = $img.width * frames;

        }

    }

}