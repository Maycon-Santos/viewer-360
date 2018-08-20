Object.prototype.merge = function(object){
    for (const key in object) this[key] = object[key];
}
class V360{

    constructor(){

        const $v360 = document.querySelectorAll('[v360], [V360]');

        for (let i = 0, l = $v360.length; i < l; i++)
            this.init($v360[i]);

        return 'teste';

    }

    init($target){

        // If you are already a V360
        if($target.v360 && $target.v360.played)
            return $target.v360.restart();

        const props = {

            target: $target,

            srcs: undefined,
            sprite: undefined,
            frames: 0,
            dragSensitivity: 5,

            canvas: this.appendCanvas($target),

            imgs: [],
            currentFrame: 0,

            allowDrag: true,
            mousePressing: undefined,
            mouseStart: 0,

            loadedImages: 0

        };

        // Replace all ' to "
        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

        this.preload(props);
        this.onresize(props);

        this.V360DOM($target, props);

    }

}

window.addEventListener('load', () => window.v360 = new V360());
V360.prototype.appendCanvas = function($target){

    let canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    $target.appendChild(canvas.target);

    return canvas;

}
/*  
    * Github: https://gist.github.com/gre/1650294
    * Easing Functions - inspired from http://gizma.com/easing/
    * only considering the t value for the range [0, 1] => [0, 1]
*/
V360.prototype.easingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
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
V360.prototype.setImage = function(props, n){

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
        
    }else ctx.drawImage($img, 0, 0, $img.width, $img.height);

}
V360.prototype.V360DOM = function($target, props){

    const $canvas = props.canvas.target;
    const frames = props.frames - 1;

    // Handles
    const mousedownHandle = this.onmousedown(props);
    const mouseupHandle = this.onmouseup(props);
    const mousemoveHandle = this.onmousemove(props);
    const resizeHandle = this.onresize(props);    

    $canvas.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);
    window.addEventListener('resize', resizeHandle);

    $target.v360 = { played: true };

    $target.v360.start = () => {

        this.init($target);

        $target.v360.played = true;

    }

    $target.v360.stop = () => {

        // Remove events
        $canvas.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);
        window.removeEventListener('resize', resizeHandle);

        // Remove canvas of the DOM
        if($canvas) $canvas.remove();

        $target.v360.played = false;

    }

    $target.v360.restart = () => {

        $target.v360.stop();
        $target.v360.start();

    }

    let stopAnimation;
    $target.v360.animate = (to, duration, easingFunction = 'linear', callback) => {

        let start = performance.now();
        let progressed = 0;

        props.allowDrag = false;

        requestAnimationFrame(function animate(time){

            let timeFraction = (time - start) / duration;
        
            // Calculate the current animation state
            let progress = this.easingFunctions[easingFunction || 'linear'](timeFraction);
        
            if(to == Infinity || to == -Infinity){

                if(~~timeFraction > progressed){
                    progressed = ~~timeFraction;
                    props.currentFrame += (to == Infinity) ? 1 : -1;
                }

            }else if(~~(progress * Math.abs(to)) > progressed){

                progressed = ~~(progress * Math.abs(to));

                let direction = to / Math.abs(to);
                let nextFrame = props.currentFrame + ~~(progress * to);

                props.currentFrame += nextFrame / Math.abs(nextFrame) * direction;

                console.log(props.currentFrame);

            }

            if(props.currentFrame > frames) props.currentFrame = 0;
            else if(props.currentFrame < 0) props.currentFrame = frames;

            this.setImage(props, props.currentFrame);

            if(stopAnimation) return props.allowDrag = !(stopAnimation = false);

            if(to == Infinity) return requestAnimationFrame(animate.bind(this));

            if(timeFraction < 1) return requestAnimationFrame(animate.bind(this));
            else if(typeof callback == 'function')return callback();

            // If you get here means the animation has come to an end
            props.allowDrag = true;

        }.bind(this));

    }

    $target.v360.stopAnimation = () => stopAnimation = true;

}
V360.prototype.onload = function(props){

    return e => {

        props.loadedImages++;

        if(props.loadedImages < props.frames && !props.sprite) return;

        this.resizeImage(props);

        this.setImage(props, props.currentFrame);

        this.onmousedown(props);
        this.onmouseup(props);
        this.onmousemove(props);

    }

}
V360.prototype.onmousedown = function(props){

    return e => {

        if(!props.allowDrag) return;

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

            props.currentFrame += roundMouseMoved / Math.abs(roundMouseMoved);

            if(props.currentFrame > props.frames - 1) props.currentFrame = 0;
            if(props.currentFrame < 0) props.currentFrame = props.frames - 1;

            this.setImage(props, props.currentFrame);

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

            const currentFrame = props.currentFrame;

            this.resizeCanvas($target, $canvas);
            this.resizeImage(props);

            this.setImage(props, currentFrame);
            
        }

    }
    
}
V360.prototype.restart = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.restart();

}
V360.prototype.set = function($element, props){

    $element.setAttribute('v360', JSON.stringify(props).replace(/\"/g, "'"));

    this.init($element);

}
V360.prototype.start = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.start();

}
V360.prototype.stop = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.stop();

}
//# sourceMappingURL=v360.js.map
