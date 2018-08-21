V360.prototype.preload = function(props){

    // Preload all images
    for(let j = 1; j <= props.frames; j++){

        // Insert and get img from the array
        const img = props.imgs[props.imgs.push(new Image()) - 1];

        img.onload = this.onload(props);

        // If is sprite
        if(props.sprite){
            img.src = props.sprite;
            break;
        }

        img.src = props.srcs.replace('#{frame}', ('000' + j).slice(-3));

    }

}