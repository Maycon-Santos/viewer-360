V360.prototype.resizeImage = function($canvas, imgs){

    for(let i = 0, l = imgs.length; i < l; i++){

        const $img = imgs[i];

        // If l == 1 is a sprite
        if($canvas.width <= $canvas.height && l > 1){

            $img.height = ($img.height * $canvas.width) / $img.width;
            $img.width = $canvas.width;

        }else{

            $img.width = ($img.width * $canvas.height) / $img.height;
            $img.height = $canvas.height;

        }

    }

}