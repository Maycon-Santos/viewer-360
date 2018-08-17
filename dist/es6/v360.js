Object.prototype.merge = function(object){
    for (const key in object) this[key] = object[key];
}
class V360{

    constructor(){

        const $v360 = document.querySelectorAll('[v360], [V360]');

        for (let i = 0, l = $v360.length; i < l; i++)
            this.init($v360[i]);

    }

    init($target){

        const props = {

            target: $target,
            
            srcs: undefined,
            sprite: undefined,
            frames: 0,
            dragSensitivity: 5,

            canvas: this.appendCanvas($target),

            imgs: [],
            currentImg: 0,

            mousePressing: undefined,
            mouseStart: 0,
            
            loadedImages: 0

        };

        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

        this.preload(props);
        this.onresize(props);

        this.V360DOM($target, props);

    }

}

window.addEventListener('load', () => new V360());
V360.prototype.appendCanvas = function($target){

    let canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    $target.appendChild(canvas.target);

    return canvas;

}
V360.prototype.preload = function(props){

    // Preload all images
    for(let j = 1; j <= props.frames; j++){

        // Insert and get img from the array
        const img = props.imgs[props.imgs.push(new Image()) - 1];

        img.onload = this.onload(props);

        if(props.sprite){
            img.src = props.sprite;
            break;
        }

        img.src = props.srcs.replace('#{frame}', ('000' + j).slice(-3));

    }

}
V360.prototype.resizeCanvas = function($target, $canvas){

    $canvas.width = $target.offsetWidth;
    $canvas.height = $target.offsetHeight;

}
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
V360.prototype.V360DOM = function($target, props){

    const mousedownHandle = this.onmousedown(props);
    const mouseupHandle = this.onmouseup(props);
    const mousemoveHandle = this.onmousemove(props);
    const resizeHandle = this.onresize(props);

    props.canvas.target.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);
    window.addEventListener('resize', resizeHandle);

    $target.V360 = {};

    $target.V360.destroy = () => {

        props.canvas.target.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);
        window.removeEventListener('resize', resizeHandle);

        props.canvas.target.remove();

    }

    $target.V360.start = () => this.init($target);

    $target.V360.restart = () => {

        $target.V360.destroy();
        $target.V360.start();

    }


}
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
V360.prototype.onmousedown = function(props){

    return e => {

        props.mousePressing = true;
        props.mouseStart = e.pageX;

    }

}
V360.prototype.onmousemove = function(props){

    return e => {

        e.preventDefault();

        if(!props.mousePressing) return;

        let mouseMoved = (props.mouseStart - e.pageX) / props.dragSensitivity;

        if(mouseMoved > 1) mouseMoved = 1;
        if(mouseMoved < -1) mouseMoved = -1;

        if(mouseMoved == 1 || mouseMoved == -1){

            props.mouseStart = e.pageX;

            let roundMouseMoved = Math.round(mouseMoved);

            props.currentImg += roundMouseMoved / Math.abs(roundMouseMoved);

            if(props.currentImg > props.frames - 1) props.currentImg = 0;
            if(props.currentImg < 0) props.currentImg = props.frames - 1;

            this.setImage(props.canvas.target, props.canvas.ctx, props.imgs, props.currentImg, props.frames);

        }

    }

}
V360.prototype.onmouseup = function(props){

    return () => {

        props.mousePressing = false;
        props.mouseStart = 0;

    }

}
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
//# sourceMappingURL=v360.js.map
